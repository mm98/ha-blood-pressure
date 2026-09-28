import { isValidEntityId } from "./home-assistant";

export interface BloodPressureCardConfig {
	type: "custom:blood-pressure-card";
	systolic: string;
	diastolic: string;
	pulse?: string;
	guideline?: "esc_2024" | "esc_esh_2018" | "acc_aha_2017";
	chart_type?: "bars" | "lines" | "zone" | "calendar" | "weekly";
	hours_to_show?: number;
	pulse_low?: number;
	pulse_high?: number;
}

export function validateConfig(config: any): asserts config is BloodPressureCardConfig {
	if (!config.systolic || !isValidEntityId(config.systolic)) {
		throw new Error("systolic entity is required and must be valid");
	}
	if (!config.diastolic || !isValidEntityId(config.diastolic)) {
		throw new Error("diastolic entity is required and must be valid");
	}
	if (config.pulse && !isValidEntityId(config.pulse)) {
		throw new Error("pulse entity must be valid");
	}
}
