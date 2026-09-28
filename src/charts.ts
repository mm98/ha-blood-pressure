// The chart types. Each draws into an SVG that is WIDTH wide, with the time
// running from left to right, except the pie chart.

import { nothing, svg, type SVGTemplateResult } from "lit";
import { type ChartType, PULSE_RANGE } from "./config";
import { type Category, classify, classifyValue, normalRange, PULSE_COLORS, type Scheme } from "./guidelines";
import { translate } from "./i18n";
import { averageReading, rangeOf, type Reading } from "./readings";

export const WIDTH = 500;

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
}

export interface Chart {
	height(input: ChartInput): number;
	draw(input: ChartInput): SVGTemplateResult | SVGTemplateResult[];
}

type Axis = "systolic" | "diastolic" | "pulse";

const LEFT = 4;
// Room on the right for the numbers of the grid lines.
const RIGHT = 468;
const DAY_MS = 24 * 3600 * 1000;
// The main area, the pulse area below it, and the dates below that.
const TOP = 10;
const BOTTOM = 190;
const PULSE_TOP = 206;
const PULSE_BOTTOM = 252;
const DATES = 18;

// A value scale for one area of the chart.
interface Scale {
	low: number;
	high: number;
	y: (value: number) => number;
}

const scale = (low: number, high: number, top: number, bottom: number): Scale => ({
	low,
	high,
	y: (value) => bottom - ((value - low) / (high - low)) * (bottom - top),
});

// The values of the readings, with a margin, never narrower than min to max.
const valueScale = (values: number[], min: number, max: number, top: number, bottom: number): Scale =>
	scale(Math.min(min, ...values) - 5, Math.max(max, ...values) + 5, top, bottom);

const timeScale = ({ start, end }: ChartInput) => (time: number) =>
	LEFT + ((time - start) / Math.max(end - start, 1)) * (RIGHT - LEFT);

const valuesOf = (readings: Reading[], axis: Axis): number[] =>
	readings.flatMap((reading) => reading.measurements.flatMap((measurement) => measurement[axis] ?? []));

// Grid lines at round numbers, with the numbers on the right.
const grid = (area: Scale, step: number): SVGTemplateResult[] => {
	const lines: SVGTemplateResult[] = [];
	for (let value = Math.ceil(area.low / step) * step; value <= area.high; value += step) {
		lines.push(svg`
			<line class="grid" x1=${LEFT} x2=${RIGHT} y1=${area.y(value)} y2=${area.y(value)}></line>
			<text class="axis" x=${RIGHT + 6} y=${area.y(value) + 4}>${value}</text>
		`);
	}
	return lines;
};

// Grid lines at the given values only, for the small pulse area.
const gridAt = (area: Scale, values: number[]): SVGTemplateResult[] =>
	values.map(
		(value) => svg`
			<line class="grid" x1=${LEFT} x2=${RIGHT} y1=${area.y(value)} y2=${area.y(value)}></line>
			<text class="axis" x=${RIGHT + 6} y=${area.y(value) + 4}>${value}</text>
		`,
	);

// A faded band between two values, in the color of what it stands for.
const band = (area: Scale, [from, to]: [number, number], color: string): SVGTemplateResult => {
	const top = area.y(Math.min(to, area.high));
	return svg`<rect class="normal" x=${LEFT} width=${RIGHT - LEFT} y=${top} height=${Math.max(area.y(Math.max(from, area.low)) - top, 0)}
		style=${`fill: ${color}`}></rect>`;
};

const polyline = (points: [number, number][]): SVGTemplateResult =>
	svg`<polyline class="line" points=${points.map(([x, y]) => `${x},${y}`).join(" ")}></polyline>`;

const fill = (category: Category): string => `fill: ${category.color}`;

// The pulse as a line with its dots, over the faded band of a usual resting pulse.
const pulseArea = (input: ChartInput, x: (reading: Reading) => number, top = PULSE_TOP, bottom = PULSE_BOTTOM) => {
	const readings = input.readings.filter((reading) => reading.pulse !== undefined);
	const area = valueScale(valuesOf(readings, "pulse"), PULSE_RANGE[0], PULSE_RANGE[1], top, bottom);
	return svg`
		${band(area, PULSE_RANGE, PULSE_COLORS.usual)}
		${gridAt(area, PULSE_RANGE)}
		${polyline(readings.map((reading) => [x(reading), area.y(reading.pulse!)]))}
		${readings.map((reading) => svg`<circle class="pulse" cx=${x(reading)} cy=${area.y(reading.pulse!)} r="3"></circle>`)}
	`;
};

// The first and the last day of the period, below the chart.
const dates = ({ start, end, language, timeZone }: ChartInput, y: number): SVGTemplateResult => {
	const format = new Intl.DateTimeFormat(language, { day: "numeric", month: "short", timeZone });
	return svg`
		<text class="axis" x=${LEFT} y=${y}>${format.format(start)}</text>
		<text class="axis" x=${RIGHT} y=${y} text-anchor="end">${format.format(end)}</text>
	`;
};

// The height of the charts with the main area: the pulse and the dates below it.
const timeChartHeight = (input: ChartInput): number => (input.pulse ? PULSE_BOTTOM : BOTTOM) + DATES + 10;

// One bar per reading, from diastolic up to systolic, colored by its category.
const bars: Chart = {
	height: timeChartHeight,
	draw: (input) => {
		const x = timeScale(input);
		const area = valueScale([...valuesOf(input.readings, "systolic"), ...valuesOf(input.readings, "diastolic")], 60, 150, TOP, BOTTOM);
		const width = Math.max(2, Math.min(10, ((RIGHT - LEFT) / Math.max(input.readings.length, 1)) * 0.6));
		return svg`
			${grid(area, 20)}
			${input.readings.map((reading) => {
				const top = area.y(reading.systolic);
				return svg`<rect x=${x(reading.time) - width / 2} y=${top} width=${width} rx="2"
					height=${Math.max(area.y(reading.diastolic) - top, 2)}
					style=${fill(classify(input.scheme, reading.systolic, reading.diastolic))}></rect>`;
			})}
			${input.pulse ? pulseArea(input, (reading) => x(reading.time)) : nothing}
			${dates(input, timeChartHeight(input) - 6)}
		`;
	},
};

// Systolic and diastolic as two lines, over faded bands where each value is
// neither low nor in a higher category.
const lines: Chart = {
	height: timeChartHeight,
	draw: (input) => {
		const x = timeScale(input);
		const area = valueScale([...valuesOf(input.readings, "systolic"), ...valuesOf(input.readings, "diastolic")], 60, 150, TOP, BOTTOM);
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
			${input.pulse ? pulseArea(input, (reading) => x(reading.time)) : nothing}
			${dates(input, timeChartHeight(input) - 6)}
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

// One point per day: the day's average as a circle (systolic) and a diamond
// (diastolic), its lowest and highest value as a thin line.
const daily: Chart = {
	height: (input) => (input.pulse ? PULSE_BOTTOM : BOTTOM) + 40,
	draw: (input) => {
		const days = daysOf(input);
		const byDay = dailyReadings(input);
		const slot = (RIGHT - LEFT) / days.length;
		const x = (index: number) => LEFT + slot * (index + 0.5);
		const area = valueScale([...valuesOf(input.readings, "systolic"), ...valuesOf(input.readings, "diastolic")], 60, 150, TOP, BOTTOM);
		const shown = days.map((day, index) => ({ index, reading: byDay.get(dayOf(day, "UTC")) }));
		const withReadings = shown.filter((item): item is { index: number; reading: Reading } => Boolean(item.reading));
		const labelEvery = Math.ceil(days.length / 10);
		const date = new Intl.DateTimeFormat(input.language, { day: "numeric", timeZone: "UTC" });
		const weekday = new Intl.DateTimeFormat(input.language, { weekday: "short", timeZone: "UTC" });
		const labelsY = (input.pulse ? PULSE_BOTTOM : BOTTOM) + 18;
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
			${input.pulse ? pulseArea({ ...input, readings: withReadings.map(({ reading }) => reading) }, (reading) => x(withReadings.find((item) => item.reading === reading)!.index)) : nothing}
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

const SPLIT_HEIGHT = 70;
const SPLIT_GAP = 14;

// Systolic, diastolic and the pulse each in their own area, over the faded
// band of that value, with the limit where it gets high on the right. The
// measurements of a sitting show as a short bar from the lowest to the highest.
const split: Chart = {
	height: (input) => (input.pulse ? 3 : 2) * (SPLIT_HEIGHT + SPLIT_GAP) + DATES,
	draw: (input) => {
		const x = timeScale(input);
		const areas = (["systolic", "diastolic"] as const).map((axis, index) => {
			const top = TOP + index * (SPLIT_HEIGHT + SPLIT_GAP);
			const [low, high] = normalRange(input.scheme, axis);
			const area = valueScale(valuesOf(input.readings, axis), low, high, top, top + SPLIT_HEIGHT);
			return svg`
				${band(area, [low, high], input.scheme.categories[0].color)}
				<line class="limit" x1=${LEFT} x2=${RIGHT} y1=${area.y(high)} y2=${area.y(high)}></line>
				<text class="axis" x=${RIGHT + 6} y=${area.y(high) + 4}>${high}</text>
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
		const pulseTop = TOP + 2 * (SPLIT_HEIGHT + SPLIT_GAP);
		return svg`
			${areas}
			${input.pulse
				? svg`
					<text class="axis" x=${LEFT} y=${pulseTop + 2}>${translate("text.pulse_name", input.language)}</text>
					${pulseArea(input, (reading) => x(reading.time), pulseTop, pulseTop + SPLIT_HEIGHT)}
				`
				: nothing}
			${dates(input, split.height(input) - 4)}
		`;
	},
};

const CALENDAR_WEEKS = 5;
const CALENDAR_GAP = 6;
const CALENDAR_ROW = 40;
const CALENDAR_TOP = 22;

// The last five weeks, one box per day in the color of that day's average,
// the week as wide as the card. Weeks start on Monday, and the last row is
// the current week.
const calendar: Chart = {
	height: () => CALENDAR_TOP + CALENDAR_WEEKS * (CALENDAR_ROW + CALENDAR_GAP),
	draw: (input) => {
		const byDay = dailyReadings(input);
		const [year, month, date] = dayOf(input.end, input.timeZone).split("-").map(Number);
		const today = Date.UTC(year, month - 1, date, 12);
		const first = today - (((new Date(today).getUTCDay() + 6) % 7) + (CALENDAR_WEEKS - 1) * 7) * DAY_MS;
		const weekday = new Intl.DateTimeFormat(input.language, { weekday: "short", timeZone: "UTC" });
		const dayNumber = new Intl.DateTimeFormat(input.language, { day: "numeric", timeZone: "UTC" });
		const width = (WIDTH - 6 * CALENDAR_GAP) / 7;
		const cells: SVGTemplateResult[] = [];
		for (let index = 0; index < CALENDAR_WEEKS * 7; index++) {
			const day = first + index * DAY_MS;
			const x = (index % 7) * (width + CALENDAR_GAP);
			const y = CALENDAR_TOP + Math.floor(index / 7) * (CALENDAR_ROW + CALENDAR_GAP);
			if (index < 7) {
				cells.push(svg`<text class="axis" x=${x + width / 2} y="12" text-anchor="middle">${weekday.format(day)}</text>`);
			}
			if (day > today) {
				continue;
			}
			const reading = byDay.get(dayOf(day, "UTC"));
			cells.push(svg`
				<rect class=${reading ? "day" : "day empty"} x=${x} y=${y} width=${width} height=${CALENDAR_ROW} rx="6"
					style=${reading ? fill(classify(input.scheme, reading.systolic, reading.diastolic)) : nothing}></rect>
				<text class="date" x=${x + 8} y=${y + 16}>${dayNumber.format(day)}</text>
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

// A ring with the share of each category, and the number of readings inside.
const pie: Chart = {
	height: () => 200,
	draw: ({ readings, scheme, language }) => {
		const radius = 72;
		const circumference = 2 * Math.PI * radius;
		let offset = 0;
		const slices = sharesOf(readings, scheme).map(({ category, count }) => {
			const length = (count / readings.length) * circumference;
			const slice = svg`<circle class="slice" cx=${WIDTH / 2} cy="100" r=${radius}
				stroke-dasharray=${`${length} ${circumference - length}`} stroke-dashoffset=${-offset}
				transform=${`rotate(-90 ${WIDTH / 2} 100)`} style=${`stroke: ${category.color}`}></circle>`;
			offset += length;
			return slice;
		});
		return svg`
			${slices}
			<text class="total" x=${WIDTH / 2} y="104" text-anchor="middle">${readings.length}</text>
			<text class="axis" x=${WIDTH / 2} y="124" text-anchor="middle">
				${translate(readings.length === 1 ? "text.reading" : "text.readings", language)}
			</text>
		`;
	},
};

// The gauges are Home Assistant's own gauge elements, drawn by the card.
export const CHARTS: Record<Exclude<ChartType, "gauge">, Chart> = { bars, lines, daily, split, calendar, pie };
