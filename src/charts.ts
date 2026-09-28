// The chart types. Each draws into an SVG of the given width and height in
// pixels, with the time running from left to right, except the pie chart.

import { nothing, svg, type SVGTemplateResult } from "lit";
import { type ChartType, PULSE_RANGE } from "./config";
import { type Category, classify, classifyValue, normalRange, PULSE_COLORS, type Scheme } from "./guidelines";
import { translate } from "./i18n";
import { averageReading, rangeOf, type Reading } from "./readings";

export interface ChartInput {
	readings: Reading[];
	// The categories of the guideline, with the colors to draw with.
	scheme: Scheme;
	// The period of the chart, in milliseconds since the epoch.
	start: number;
	end: number;
	// Whether the pulse shows below the chart.
	pulse: boolean;
	language: string;
	timeZone?: string;
	// The size of the drawing in pixels.
	width: number;
	height: number;
}

export interface Chart {
	// The height of the chart type when no height is set.
	height(input: Omit<ChartInput, "height">): number;
	draw(input: ChartInput): SVGTemplateResult | SVGTemplateResult[];
}

type Axis = "systolic" | "diastolic" | "pulse";

const DAY_MS = 24 * 3600 * 1000;
const LEFT = 0;
// Room on the right for the numbers of the grid lines.
const NUMBERS = 32;
// Room above the main area, for the highest dot.
const TOP = 10;
// The pulse area below the main area, and the gap between them.
const PULSE_HEIGHT = 46;
const PULSE_GAP = 16;
// Room below for the first and the last day.
const DATES = 28;
// The smallest main area, however low the chart is set.
const SMALLEST = 40;

// Where the areas of a chart with the time running across are, from the
// bottom: the room for the dates, the pulse and the main area above them.
const frameOf = (input: ChartInput, below: number) => {
	const pulse = input.pulse ? PULSE_HEIGHT + PULSE_GAP : 0;
	const bottom = Math.max(input.height - below - pulse, TOP + SMALLEST);
	return {
		right: input.width - NUMBERS,
		bottom,
		pulseTop: bottom + PULSE_GAP,
		pulseBottom: bottom + PULSE_GAP + PULSE_HEIGHT,
	};
};

// The default height of those charts: a main area of 180 pixels.
const timeChartHeight = (below: number) => (input: Omit<ChartInput, "height">): number =>
	TOP + 180 + (input.pulse ? PULSE_GAP + PULSE_HEIGHT : 0) + below;

// A value scale for one area of the chart.
interface Scale {
	low: number;
	high: number;
	right: number;
	y: (value: number) => number;
}

const scale = (low: number, high: number, top: number, bottom: number, right: number): Scale => ({
	low,
	high,
	right,
	y: (value) => bottom - ((value - low) / (high - low)) * (bottom - top),
});

// The values of the readings, with a margin, never narrower than min to max.
const valueScale = (values: number[], [min, max]: [number, number], top: number, bottom: number, right: number): Scale =>
	scale(Math.min(min, ...values) - 5, Math.max(max, ...values) + 5, top, bottom, right);

const timeScale = ({ start, end }: ChartInput, right: number) => (time: number) =>
	LEFT + ((time - start) / Math.max(end - start, 1)) * (right - LEFT);

const valuesOf = (readings: Reading[], axis: Axis): number[] =>
	readings.flatMap((reading) => reading.measurements.flatMap((measurement) => measurement[axis] ?? []));

// Both blood pressure values, for the charts that show them in one area.
const pressureOf = (readings: Reading[]): number[] => [...valuesOf(readings, "systolic"), ...valuesOf(readings, "diastolic")];

// A grid line with its number on the right.
const gridLine = (area: Scale, value: number): SVGTemplateResult => svg`
	<line class="grid" x1=${LEFT} x2=${area.right} y1=${area.y(value)} y2=${area.y(value)}></line>
	<text class="axis" x=${area.right + 6} y=${area.y(value) + 4}>${value}</text>
`;

// Grid lines at round numbers. A low area gets fewer of them.
const grid = (area: Scale, step: number): SVGTemplateResult[] => {
	const lines: SVGTemplateResult[] = [];
	const every = Math.abs(area.y(step) - area.y(0)) < 18 ? step * 2 : step;
	for (let value = Math.ceil(area.low / every) * every; value <= area.high; value += every) {
		lines.push(gridLine(area, value));
	}
	return lines;
};

// A faded band between two values, in the color of what it stands for.
const band = (area: Scale, [from, to]: [number, number], color: string): SVGTemplateResult => {
	const top = area.y(Math.min(to, area.high));
	return svg`<rect class="normal" x=${LEFT} width=${area.right - LEFT} y=${top} height=${Math.max(area.y(Math.max(from, area.low)) - top, 0)}
		style=${`fill: ${color}`}></rect>`;
};

const polyline = (points: [number, number][]): SVGTemplateResult =>
	svg`<polyline class="line" points=${points.map(([x, y]) => `${x},${y}`).join(" ")}></polyline>`;

const fill = (category: Category): string => `fill: ${category.color}`;

// The pulse as a line with its dots, over the faded band of a usual resting pulse.
const pulseArea = (readings: Reading[], x: (reading: Reading) => number, top: number, bottom: number, right: number) => {
	const withPulse = readings.filter((reading) => reading.pulse !== undefined);
	const area = valueScale(valuesOf(withPulse, "pulse"), PULSE_RANGE, top, bottom, right);
	return svg`
		${band(area, PULSE_RANGE, PULSE_COLORS.usual)}
		${PULSE_RANGE.map((value) => gridLine(area, value))}
		${polyline(withPulse.map((reading) => [x(reading), area.y(reading.pulse!)]))}
		${withPulse.map((reading) => svg`<circle class="pulse" cx=${x(reading)} cy=${area.y(reading.pulse!)} r="3"></circle>`)}
	`;
};

// The first and the last day of the period, below the chart.
const dates = ({ start, end, language, timeZone, height }: ChartInput, right: number): SVGTemplateResult => {
	const format = new Intl.DateTimeFormat(language, { day: "numeric", month: "short", timeZone });
	return svg`
		<text class="axis" x=${LEFT} y=${height - 6}>${format.format(start)}</text>
		<text class="axis" x=${right} y=${height - 6} text-anchor="end">${format.format(end)}</text>
	`;
};

// One bar per reading, from diastolic up to systolic, colored by its category.
const bars: Chart = {
	height: timeChartHeight(DATES),
	draw: (input) => {
		const { right, bottom, pulseTop, pulseBottom } = frameOf(input, DATES);
		const x = timeScale(input, right);
		const area = valueScale(pressureOf(input.readings), [60, 150], TOP, bottom, right);
		const width = Math.max(2, Math.min(10, ((right - LEFT) / Math.max(input.readings.length, 1)) * 0.6));
		return svg`
			${grid(area, 20)}
			${input.readings.map((reading) => {
				const top = area.y(reading.systolic);
				return svg`<rect x=${x(reading.time) - width / 2} y=${top} width=${width} rx="2"
					height=${Math.max(area.y(reading.diastolic) - top, 2)}
					style=${fill(classify(input.scheme, reading.systolic, reading.diastolic))}></rect>`;
			})}
			${input.pulse ? pulseArea(input.readings, (reading) => x(reading.time), pulseTop, pulseBottom, right) : nothing}
			${dates(input, right)}
		`;
	},
};

// Systolic and diastolic as two lines, over faded bands where each value is
// neither low nor in a higher category.
const lines: Chart = {
	height: timeChartHeight(DATES),
	draw: (input) => {
		const { right, bottom, pulseTop, pulseBottom } = frameOf(input, DATES);
		const x = timeScale(input, right);
		const area = valueScale(pressureOf(input.readings), [60, 150], TOP, bottom, right);
		const line = (axis: "systolic" | "diastolic") => polyline(input.readings.map((reading) => [x(reading.time), area.y(reading[axis])]));
		return svg`
			${band(area, normalRange(input.scheme, "systolic"), input.scheme.categories[0].color)}
			${band(area, normalRange(input.scheme, "diastolic"), input.scheme.categories[0].color)}
			${grid(area, 20)}
			${line("systolic")}
			${line("diastolic")}
			${input.readings.map((reading) => {
				const style = fill(classify(input.scheme, reading.systolic, reading.diastolic));
				return svg`
					<circle cx=${x(reading.time)} cy=${area.y(reading.systolic)} r="4" style=${style}></circle>
					<circle cx=${x(reading.time)} cy=${area.y(reading.diastolic)} r="4" style=${style}></circle>
				`;
			})}
			${input.pulse ? pulseArea(input.readings, (reading) => x(reading.time), pulseTop, pulseBottom, right) : nothing}
			${dates(input, right)}
		`;
	},
};

// The day of a time, like 2026-09-28, in the time zone of the user profile.
const dayOf = (time: number, timeZone?: string): string =>
	new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone }).format(time);

// Noon UTC of the days of the period, oldest first, so a date is the same in
// every time zone.
const daysOf = ({ start, end, timeZone }: ChartInput): number[] => {
	const noon = (time: number) => {
		const [year, month, date] = dayOf(time, timeZone).split("-").map(Number);
		return Date.UTC(year, month - 1, date, 12);
	};
	const days: number[] = [];
	for (let day = noon(end); day > noon(start); day -= DAY_MS) {
		days.unshift(day);
	}
	return days;
};

// The average of each day with readings, keyed by the day.
const dailyReadings = (input: ChartInput): Map<string, Reading> => {
	const byDay = new Map<string, Reading[]>();
	for (const reading of input.readings) {
		const day = dayOf(reading.time, input.timeZone);
		byDay.set(day, [...(byDay.get(day) ?? []), reading]);
	}
	return new Map(
		[...byDay].map(([day, readings]) => [day, averageReading(readings[0].time, readings.flatMap((reading) => reading.measurements))]),
	);
};

// A diamond, the mark of the diastolic value.
const diamond = (x: number, y: number, style: string): SVGTemplateResult =>
	svg`<rect x=${x - 3.5} y=${y - 3.5} width="7" height="7" transform=${`rotate(45 ${x} ${y})`} style=${style}></rect>`;

// Room below the daily chart for the date and the weekday of each day.
const DAY_LABELS = 40;

// One point per day: the day's average as a circle (systolic) and a diamond
// (diastolic), its lowest and highest value as a thin line.
const daily: Chart = {
	height: timeChartHeight(DAY_LABELS),
	draw: (input) => {
		const { right, bottom, pulseTop, pulseBottom } = frameOf(input, DAY_LABELS);
		const days = daysOf(input);
		const byDay = dailyReadings(input);
		const slot = (right - LEFT) / days.length;
		const x = (index: number) => LEFT + slot * (index + 0.5);
		const area = valueScale(pressureOf(input.readings), [60, 150], TOP, bottom, right);
		const withReadings = days.flatMap((day, index) => {
			const reading = byDay.get(dayOf(day, "UTC"));
			return reading ? [{ index, reading }] : [];
		});
		const indexOf = new Map(withReadings.map(({ index, reading }) => [reading, index]));
		const labelEvery = Math.ceil(days.length / Math.max(Math.floor((right - LEFT) / 44), 1));
		const date = new Intl.DateTimeFormat(input.language, { day: "numeric", timeZone: "UTC" });
		const weekday = new Intl.DateTimeFormat(input.language, { weekday: "short", timeZone: "UTC" });
		const labelsY = (input.pulse ? pulseBottom : bottom) + 18;
		return svg`
			${band(area, normalRange(input.scheme, "systolic"), input.scheme.categories[0].color)}
			${band(area, normalRange(input.scheme, "diastolic"), input.scheme.categories[0].color)}
			${grid(area, 20)}
			${(["systolic", "diastolic"] as const).map((axis) => polyline(withReadings.map(({ index, reading }) => [x(index), area.y(reading[axis])])))}
			${withReadings.map(({ index, reading }) => {
				const style = fill(classify(input.scheme, reading.systolic, reading.diastolic));
				return svg`
					${(["systolic", "diastolic"] as const).map((axis) => {
						const [low, high] = rangeOf(reading, axis)!;
						return svg`<line class="range" x1=${x(index)} x2=${x(index)} y1=${area.y(low)} y2=${area.y(high)}></line>`;
					})}
					<circle cx=${x(index)} cy=${area.y(reading.systolic)} r="4" style=${style}></circle>
					${diamond(x(index), area.y(reading.diastolic), style)}
				`;
			})}
			${input.pulse
				? pulseArea(withReadings.map(({ reading }) => reading), (reading) => x(indexOf.get(reading)!), pulseTop, pulseBottom, right)
				: nothing}
			${days.map((day, index) =>
				(days.length - 1 - index) % labelEvery
					? nothing
					: svg`
						<text class="axis" x=${x(index)} y=${labelsY} text-anchor="middle">${date.format(day)}</text>
						<text class="axis" x=${x(index)} y=${labelsY + 14} text-anchor="middle">${weekday.format(day)}</text>
					`,
			)}
		`;
	},
};

// Each area of the split chart and the gap below it, in the default height.
const SPLIT_STEP = 84;
const SPLIT_GAP = 14;
// Room below the split chart for the dates.
const SPLIT_DATES = 18;

// Systolic, diastolic and the pulse each in their own area, over the faded
// band of that value, with the limit where it gets high on the right. The
// measurements of a sitting show as a short bar from the lowest to the highest.
const split: Chart = {
	height: (input) => (input.pulse ? 3 : 2) * SPLIT_STEP + SPLIT_DATES,
	draw: (input) => {
		const right = input.width - NUMBERS;
		const x = timeScale(input, right);
		const step = Math.max((input.height - SPLIT_DATES) / (input.pulse ? 3 : 2), SPLIT_GAP + SMALLEST);
		const areas = (["systolic", "diastolic"] as const).map((axis, index) => {
			const top = TOP + index * step;
			const [low, high] = normalRange(input.scheme, axis);
			const area = valueScale(valuesOf(input.readings, axis), [low, high], top, top + step - SPLIT_GAP, right);
			return svg`
				${band(area, [low, high], input.scheme.categories[0].color)}
				<line class="limit" x1=${LEFT} x2=${right} y1=${area.y(high)} y2=${area.y(high)}></line>
				<text class="axis" x=${right + 6} y=${area.y(high) + 4}>${high}</text>
				<text class="axis" x=${LEFT} y=${top + 2}>${translate(`text.${axis}`, input.language)}</text>
				${polyline(input.readings.map((reading) => [x(reading.time), area.y(reading[axis])]))}
				${input.readings.map((reading) => {
					const [from, to] = rangeOf(reading, axis)!;
					const style = fill(classifyValue(input.scheme, axis, reading[axis]));
					return svg`
						${to > from ? svg`<line class="range" x1=${x(reading.time)} x2=${x(reading.time)} y1=${area.y(from)} y2=${area.y(to)}></line>` : nothing}
						<circle cx=${x(reading.time)} cy=${area.y(reading[axis])} r="3.5" style=${style}></circle>
					`;
				})}
			`;
		});
		const pulseTop = TOP + 2 * step;
		return svg`
			${areas}
			${input.pulse
				? svg`
					<text class="axis" x=${LEFT} y=${pulseTop + 2}>${translate("text.pulse_name", input.language)}</text>
					${pulseArea(input.readings, (reading) => x(reading.time), pulseTop, pulseTop + step - SPLIT_GAP, right)}
				`
				: nothing}
			${svg`<g transform="translate(0 2)">${dates(input, right)}</g>`}
		`;
	},
};

const CALENDAR_WEEKS = 5;
const CALENDAR_GAP = 6;
const CALENDAR_TOP = 22;

// The last five weeks, one box per day in the color of that day's average,
// the week as wide as the card and the weeks as high as the chart. Weeks
// start on Monday, and the last row is the current week.
const calendar: Chart = {
	height: () => CALENDAR_TOP + CALENDAR_WEEKS * (40 + CALENDAR_GAP),
	draw: (input) => {
		const byDay = dailyReadings(input);
		const [year, month, date] = dayOf(input.end, input.timeZone).split("-").map(Number);
		const today = Date.UTC(year, month - 1, date, 12);
		const first = today - (((new Date(today).getUTCDay() + 6) % 7) + (CALENDAR_WEEKS - 1) * 7) * DAY_MS;
		const weekday = new Intl.DateTimeFormat(input.language, { weekday: "short", timeZone: "UTC" });
		const dayNumber = new Intl.DateTimeFormat(input.language, { day: "numeric", timeZone: "UTC" });
		const width = (input.width - 6 * CALENDAR_GAP) / 7;
		const row = Math.max((input.height - CALENDAR_TOP) / CALENDAR_WEEKS - CALENDAR_GAP, 12);
		const cells: SVGTemplateResult[] = [];
		for (let index = 0; index < CALENDAR_WEEKS * 7; index++) {
			const day = first + index * DAY_MS;
			const x = (index % 7) * (width + CALENDAR_GAP);
			const y = CALENDAR_TOP + Math.floor(index / 7) * (row + CALENDAR_GAP);
			if (index < 7) {
				cells.push(svg`<text class="axis" x=${x + width / 2} y="12" text-anchor="middle">${weekday.format(day)}</text>`);
			}
			if (day > today) {
				continue;
			}
			const reading = byDay.get(dayOf(day, "UTC"));
			cells.push(svg`
				<rect class=${reading ? "day" : "day empty"} x=${x} y=${y} width=${width} height=${row} rx="6"
					style=${reading ? fill(classify(input.scheme, reading.systolic, reading.diastolic)) : nothing}></rect>
				${row >= 24 ? svg`<text class="date" x=${x + 8} y=${y + 16}>${dayNumber.format(day)}</text>` : nothing}
			`);
		}
		return cells;
	},
};

export interface Share {
	category: Category;
	count: number;
}

// How many readings fell in each category, from low to the highest.
export const sharesOf = (readings: Reading[], scheme: Scheme): Share[] =>
	[scheme.low, ...scheme.categories]
		.map((category) => ({
			category,
			count: readings.filter((reading) => classify(scheme, reading.systolic, reading.diastolic) === category).length,
		}))
		.filter((share) => share.count > 0);

// The width of the ring of the pie chart.
const RING = 28;

// A ring with the share of each category, and the number of readings inside.
// The ring grows with the height of the chart.
const pie: Chart = {
	height: () => 200,
	draw: ({ readings, scheme, language, width, height }) => {
		const cx = width / 2;
		const cy = height / 2;
		const radius = Math.max(Math.min(width, height) / 2 - RING / 2 - 2, RING);
		const circumference = 2 * Math.PI * radius;
		let offset = 0;
		const slices = sharesOf(readings, scheme).map(({ category, count }) => {
			const length = (count / readings.length) * circumference;
			const slice = svg`<circle class="slice" cx=${cx} cy=${cy} r=${radius}
				stroke-dasharray=${`${length} ${circumference - length}`} stroke-dashoffset=${-offset}
				transform=${`rotate(-90 ${cx} ${cy})`} style=${`stroke: ${category.color}`}></circle>`;
			offset += length;
			return slice;
		});
		return svg`
			${slices}
			<text class="total" x=${cx} y=${cy + 4} text-anchor="middle">${readings.length}</text>
			<text class="axis" x=${cx} y=${cy + 24} text-anchor="middle">
				${translate(readings.length === 1 ? "text.reading" : "text.readings", language)}
			</text>
		`;
	},
};

// The gauge is Home Assistant's own gauge element, drawn by the card.
export const CHARTS: Record<Exclude<ChartType, "gauge">, Chart> = { bars, lines, daily, split, calendar, pie };
