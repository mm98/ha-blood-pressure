// Blood pressure categories of the published guidelines.
//
// A reading belongs to the highest category that its systolic or its
// diastolic value reaches, as all three guidelines say. Below the lowest
// category, a reading under 90 systolic or 60 diastolic counts as low.

import type { GuidelineId } from "./config";

export interface Category {
	// Also the text key: category.<key>.
	key: "low" | "non_elevated" | "elevated" | "hypertension" | "optimal" | "normal" | "high_normal"
		| "grade_1" | "grade_2" | "grade_3" | "stage_1" | "stage_2" | "crisis";
	// Where the category starts. Infinity when a value cannot reach it alone.
	systolic: number;
	diastolic: number;
	color: string;
}

// Home Assistant's theme colors, with its default values as fallback.
const color = (name: string, fallback: string): string => `var(--${name}-color, ${fallback})`;
const GREEN = color("green", "#4caf50");
const LIGHT_GREEN = color("light-green", "#8bc34a");
const AMBER = color("amber", "#ffc107");
const ORANGE = color("orange", "#ff9800");
const DEEP_ORANGE = color("deep-orange", "#ff5722");
const RED = color("red", "#f44336");

export const LOW: Category = { key: "low", systolic: 90, diastolic: 60, color: color("blue", "#2196f3") };

// Just above a limit, for the categories that start above a value.
const ABOVE = 1e-9;

export const GUIDELINES: Record<GuidelineId, Category[]> = {
	// 2024 ESC Guidelines for the management of elevated blood pressure and hypertension.
	esc_2024: [
		{ key: "non_elevated", systolic: 0, diastolic: 0, color: GREEN },
		{ key: "elevated", systolic: 120, diastolic: 70, color: AMBER },
		{ key: "hypertension", systolic: 140, diastolic: 90, color: RED },
	],
	// 2018 ESC/ESH Guidelines for the management of arterial hypertension.
	esc_esh_2018: [
		{ key: "optimal", systolic: 0, diastolic: 0, color: GREEN },
		{ key: "normal", systolic: 120, diastolic: 80, color: LIGHT_GREEN },
		{ key: "high_normal", systolic: 130, diastolic: 85, color: AMBER },
		{ key: "grade_1", systolic: 140, diastolic: 90, color: ORANGE },
		{ key: "grade_2", systolic: 160, diastolic: 100, color: DEEP_ORANGE },
		{ key: "grade_3", systolic: 180, diastolic: 110, color: RED },
	],
	// 2017 ACC/AHA Guideline for high blood pressure in adults. Elevated is
	// set by the systolic value alone, and a crisis starts above 180 or above 120.
	acc_aha_2017: [
		{ key: "normal", systolic: 0, diastolic: 0, color: GREEN },
		{ key: "elevated", systolic: 120, diastolic: Infinity, color: AMBER },
		{ key: "stage_1", systolic: 130, diastolic: 80, color: ORANGE },
		{ key: "stage_2", systolic: 140, diastolic: 90, color: DEEP_ORANGE },
		{ key: "crisis", systolic: 180 + ABOVE, diastolic: 120 + ABOVE, color: RED },
	],
};

// The highest category a value reaches on its own.
const levelOf = (categories: Category[], value: number, axis: "systolic" | "diastolic"): number =>
	categories.reduce((level, category, index) => (value >= category[axis] ? index : level), 0);

export const classify = (categories: Category[], systolic: number, diastolic: number): Category => {
	const level = Math.max(levelOf(categories, systolic, "systolic"), levelOf(categories, diastolic, "diastolic"));
	if (level === 0 && (systolic < LOW.systolic || diastolic < LOW.diastolic)) {
		return LOW;
	}
	return categories[level];
};

// The category one value reaches on its own, for the charts that show the
// systolic and the diastolic value apart.
export const classifyValue = (categories: Category[], axis: "systolic" | "diastolic", value: number): Category => {
	const level = levelOf(categories, value, axis);
	return level === 0 && value < LOW[axis] ? LOW : categories[level];
};

// Where a value is neither low nor in a higher category.
export const normalRange = (categories: Category[], axis: "systolic" | "diastolic"): [number, number] => [
	LOW[axis],
	Math.min(...categories.slice(1).map((category) => category[axis])),
];

// The categories one value can reach, each with the value where it starts,
// for the scales. Categories the value cannot reach alone are left out.
export const scaleOf = (categories: Category[], axis: "systolic" | "diastolic"): { from: number; category: Category }[] => [
	{ from: -Infinity, category: LOW },
	{ from: LOW[axis], category: categories[0] },
	...categories
		.slice(1)
		.filter((category) => Number.isFinite(category[axis]))
		.map((category) => ({ from: category[axis], category })),
];
