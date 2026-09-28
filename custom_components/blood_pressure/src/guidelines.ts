/*
 * Blood pressure categories by guideline.
 * A reading belongs to the highest category its systolic or diastolic reaches.
 */

export interface Category {
	key: string;
	systolic: number;
	diastolic: number;
	color: string;
}

export interface Guideline {
	key: string;
	name: string;
	categories: Category[];
	lowColor: string;
}

export const ESC_2024: Guideline = {
	key: "esc_2024",
	name: "ESC 2024",
	categories: [
		{ key: "non_elevated", systolic: 0, diastolic: 0, color: "green" },
		{ key: "elevated", systolic: 120, diastolic: 70, color: "amber" },
		{ key: "hypertension", systolic: 140, diastolic: 90, color: "red" },
	],
	lowColor: "blue",
};

export const ESC_ESH_2018: Guideline = {
	key: "esc_esh_2018",
	name: "ESC/ESH 2018",
	categories: [
		{ key: "optimal", systolic: 0, diastolic: 0, color: "green" },
		{ key: "normal", systolic: 120, diastolic: 80, color: "lime" },
		{ key: "high_normal", systolic: 130, diastolic: 85, color: "amber" },
		{ key: "grade_1", systolic: 140, diastolic: 90, color: "orange" },
		{ key: "grade_2", systolic: 160, diastolic: 100, color: "deep-orange" },
		{ key: "grade_3", systolic: 180, diastolic: 110, color: "red" },
	],
	lowColor: "blue",
};

export const ACC_AHA_2017: Guideline = {
	key: "acc_aha_2017",
	name: "ACC/AHA 2017",
	categories: [
		{ key: "normal", systolic: 0, diastolic: 0, color: "green" },
		{ key: "elevated", systolic: 120, diastolic: 999, color: "amber" },
		{ key: "stage_1", systolic: 130, diastolic: 80, color: "orange" },
		{ key: "stage_2", systolic: 140, diastolic: 90, color: "deep-orange" },
		{ key: "crisis", systolic: 180, diastolic: 120, color: "red" },
	],
	lowColor: "blue",
};

export const GUIDELINES: Record<string, Guideline> = {
	esc_2024: ESC_2024,
	esc_esh_2018: ESC_ESH_2018,
	acc_aha_2017: ACC_AHA_2017,
};

export function classify(guideline: Guideline, systolic: number, diastolic: number): string {
	const sysLevel = guideline.categories.findIndex((c) => systolic < c.systolic);
	const diaLevel = guideline.categories.findIndex((c) => diastolic < c.diastolic);
	const level = Math.max(
		sysLevel === -1 ? guideline.categories.length - 1 : sysLevel - 1,
		diaLevel === -1 ? guideline.categories.length - 1 : diaLevel - 1
	);
	const cat = guideline.categories[Math.max(0, level)];
	if ((systolic < 90 || diastolic < 60) && level === 0) {
		return "low";
	}
	return cat.key;
}

export function getColor(guideline: Guideline, systolic: number, diastolic: number): string {
	const category = classify(guideline, systolic, diastolic);
	if (category === "low") {
		return guideline.lowColor;
	}
	return guideline.categories.find((c) => c.key === category)?.color || "gray";
}
