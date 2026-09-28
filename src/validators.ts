// Checks the config. Home Assistant shows the error when one is wrong, like
// its own cards, in English. Home Assistant's own keys (type, view_layout,
// layout_options, grid_options, visibility, disabled) are never rejected.

import { type BloodPressureConfig, CHART_TYPES, type EditorConfig, GUIDELINE_IDS, isSet, SHOW_KEYS } from "./config";

// The config the editor can show. The sensors may still be missing.
export function validateEditorConfig(config: unknown): asserts config is EditorConfig {
	if (!config || typeof config !== "object") {
		throw new Error("The settings must be a map.");
	}
	const values = config as Record<string, unknown>;
	for (const key of ["systolic", "diastolic", "pulse", "title"] as const) {
		if (isSet(values[key]) && typeof values[key] !== "string") {
			throw new Error(`${key} must be text.`);
		}
	}
	if (isSet(values.chart_type) && !(CHART_TYPES as readonly unknown[]).includes(values.chart_type)) {
		throw new Error(`chart_type must be one of: ${CHART_TYPES.join(", ")}.`);
	}
	if (isSet(values.guideline) && !(GUIDELINE_IDS as readonly unknown[]).includes(values.guideline)) {
		throw new Error(`guideline must be one of: ${GUIDELINE_IDS.join(", ")}.`);
	}
	if (isSet(values.days_to_show) && !(typeof values.days_to_show === "number" && values.days_to_show > 0)) {
		throw new Error("days_to_show must be a number above 0.");
	}
	if (
		isSet(values.colors) &&
		(typeof values.colors !== "object" ||
			Array.isArray(values.colors) ||
			Object.values(values.colors as object).some((color) => isSet(color) && typeof color !== "string"))
	) {
		throw new Error("colors must be a map from a category to a color, like elevated: amber.");
	}
	for (const key of SHOW_KEYS) {
		if (isSet(values[key]) && typeof values[key] !== "boolean") {
			throw new Error(`${key} must be true or false.`);
		}
	}
}

// The config the card can show.
export function validateConfig(config: unknown): asserts config is BloodPressureConfig {
	validateEditorConfig(config);
	if (!config.systolic || !config.diastolic) {
		throw new Error("Set both systolic and diastolic.");
	}
	if (config.systolic === config.diastolic) {
		throw new Error("systolic and diastolic must be two different sensors.");
	}
}
