// Blood pressure categories of the published guidelines.
//
// A reading belongs to the highest category that its systolic or its
// diastolic value reaches, as all three guidelines say. Below the lowest
// category, a reading under 90 systolic or 60 diastolic counts as low.

import type { GuidelineId } from "./config";
import { computeCssColor } from "./home-assistant";

export type CategoryKey =
	| "low"
	| "non_elevated"
	| "elevated"
	| "hypertension"
	| "optimal"
	| "normal"
	| "high_normal"
	| "grade_1"
	| "grade_2"
	| "grade_3"
	| "stage_1"
	| "stage_2"
	| "crisis";

export interface Category {
	// Also the text key: category.<key>.
	key: CategoryKey;
	// Where the category starts. Infinity when a value cannot reach it alone.
	systolic: number;
	diastolic: number;
	// A Home Assistant theme color like amber, or any CSS color. In a scheme
	// the CSS color to draw with.
	color: string;
}

// The categories of a guideline with the colors of the card.
export interface Scheme {
	low: Category;
	categories: Category[];
}

const LOW: Category = { key: "low", systolic: 90, diastolic: 60, color: "blue" };

// Just above a limit, for the categories that start above a value.
const ABOVE = 1e-9;

const GUIDELINES: Record<GuidelineId, Category[]> = {
	// 2024 ESC Guidelines for the management of elevated blood pressure and hypertension.
	esc_2024: [
		{ key: "non_elevated", systolic: 0, diastolic: 0, color: "green" },
		{ key: "elevated", systolic: 120, diastolic: 70, color: "amber" },
		{ key: "hypertension", systolic: 140, diastolic: 90, color: "red" },
	],
	// 2018 ESC/ESH Guidelines for the management of arterial hypertension.
	esc_esh_2018: [
		{ key: "optimal", systolic: 0, diastolic: 0, color: "green" },
		{ key: "normal", systolic: 120, diastolic: 80, color: "light-green" },
		{ key: "high_normal", systolic: 130, diastolic: 85, color: "amber" },
		{ key: "grade_1", systolic: 140, diastolic: 90, color: "orange" },
		{ key: "grade_2", systolic: 160, diastolic: 100, color: "deep-orange" },
		{ key: "grade_3", systolic: 180, diastolic: 110, color: "red" },
	],
	// 2017 ACC/AHA Guideline for high blood pressure in adults. Elevated is
	// set by the systolic value alone, and a crisis starts above 180 or above 120.
	acc_aha_2017: [
		{ key: "normal", systolic: 0, diastolic: 0, color: "green" },
		{ key: "elevated", systolic: 120, diastolic: Infinity, color: "amber" },
		{ key: "stage_1", systolic: 130, diastolic: 80, color: "orange" },
		{ key: "stage_2", systolic: 140, diastolic: 90, color: "deep-orange" },
		{ key: "crisis", systolic: 180 + ABOVE, diastolic: 120 + ABOVE, color: "red" },
	],
};

// The colors of the pulse: a usual resting pulse and a fast one. A slow
// pulse has the color of low.
export const PULSE_COLORS = { usual: computeCssColor("green"), fast: computeCssColor("amber") };

// Every category of a guideline, from low to the highest, with its own color.
export const categoriesOf = (guideline: GuidelineId): Category[] => [LOW, ...GUIDELINES[guideline]];

// The categories of a guideline, each with the chosen color or its own.
export const schemeOf = (guideline: GuidelineId, colors: Partial<Record<CategoryKey, string>> = {}): Scheme => {
	const paint = (category: Category): Category => ({
		...category,
		color: computeCssColor(colors[category.key] || category.color),
	});
	return { low: paint(LOW), categories: GUIDELINES[guideline].map(paint) };
};

// The highest category a value reaches on its own.
const levelOf = (categories: Category[], value: number, axis: "systolic" | "diastolic"): number =>
	categories.reduce((level, category, index) => (value >= category[axis] ? index : level), 0);

export const classify = ({ low, categories }: Scheme, systolic: number, diastolic: number): Category => {
	const level = Math.max(levelOf(categories, systolic, "systolic"), levelOf(categories, diastolic, "diastolic"));
	if (level === 0 && (systolic < low.systolic || diastolic < low.diastolic)) {
		return low;
	}
	return categories[level];
};

// The category one value reaches on its own, for the charts that show the
// systolic and the diastolic value apart.
export const classifyValue = ({ low, categories }: Scheme, axis: "systolic" | "diastolic", value: number): Category => {
	const level = levelOf(categories, value, axis);
	return level === 0 && value < low[axis] ? low : categories[level];
};

// Where a value is neither low nor in a higher category.
export const normalRange = ({ low, categories }: Scheme, axis: "systolic" | "diastolic"): [number, number] => [
	low[axis],
	Math.min(...categories.slice(1).map((category) => category[axis])),
];

// The categories one value can reach, each with the value where it starts,
// for the scales and the gauges. Categories the value cannot reach alone are
// left out.
export const scaleOf = ({ low, categories }: Scheme, axis: "systolic" | "diastolic"): { from: number; category: Category }[] => [
	{ from: -Infinity, category: low },
	{ from: low[axis], category: categories[0] },
	...categories
		.slice(1)
		.filter((category) => Number.isFinite(category[axis]))
		.map((category) => ({ from: category[axis], category })),
];

// Where the scales of the latest reading start and end, in mmHg.
export const SCALE_LIMITS = { systolic: [70, 200], diastolic: [40, 130] } as const;

// Where a reading sits on one scale of all categories, from low (0) to the
// highest: the number of its category plus how far into that category the
// value that decided it is, between 0 and 1. For the gauge.
export const positionOf = (scheme: Scheme, systolic: number, diastolic: number): number => {
	const category = classify(scheme, systolic, diastolic);
	const fractions = (["systolic", "diastolic"] as const).flatMap((axis) => {
		const value = axis === "systolic" ? systolic : diastolic;
		if (classifyValue(scheme, axis, value) !== category) {
			return [];
		}
		const steps = scaleOf(scheme, axis);
		const step = steps.findIndex((item) => item.category === category);
		const from = Math.max(steps[step].from, SCALE_LIMITS[axis][0]);
		const to = steps[step + 1]?.from ?? SCALE_LIMITS[axis][1];
		return [Math.min(Math.max((value - from) / (to - from), 0), 0.99)];
	});
	return [scheme.low, ...scheme.categories].indexOf(category) + (fractions.length ? Math.max(...fractions) : 0.5);
};
