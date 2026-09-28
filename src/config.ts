// The card's config. Optional keys stay optional, and defaults are never
// written into the saved YAML.

import type { LovelaceCardConfig } from "./home-assistant";

export const CHART_TYPES = ["bars", "lines", "daily", "split", "calendar", "pie"] as const;
export type ChartType = (typeof CHART_TYPES)[number];

export const GUIDELINE_IDS = ["esc_2024", "esc_esh_2018", "acc_aha_2017"] as const;
export type GuidelineId = (typeof GUIDELINE_IDS)[number];

// The recorder keeps 10 days by default.
export const DEFAULT_DAYS = 10;

// What the visual editor holds: the sensors may still be missing.
export interface EditorConfig extends LovelaceCardConfig {
	systolic?: string;
	diastolic?: string;
	pulse?: string;
	name?: string;
	chart_type?: ChartType;
	days_to_show?: number;
	guideline?: GuidelineId;
	// Which parts show, each on by default. The pulse needs a pulse sensor.
	show_name?: boolean;
	show_icon?: boolean;
	show_state?: boolean;
	show_category?: boolean;
	show_average?: boolean;
	show_pulse?: boolean;
	show_scales?: boolean;
	show_chart?: boolean;
	show_legend?: boolean;
}

// The parts of the card that can be turned off, in the order they show.
export const SHOW_KEYS = [
	"show_name",
	"show_icon",
	"show_state",
	"show_category",
	"show_average",
	"show_pulse",
	"show_scales",
	"show_chart",
	"show_legend",
] as const;

// Whether a part shows: everything shows unless it is turned off.
export const shows = (config: EditorConfig, key: (typeof SHOW_KEYS)[number]): boolean => config[key] !== false;

// The value of each setting that is not set. The editor shows them, and
// leaves them out of the saved YAML.
export const DEFAULTS: Partial<EditorConfig> = {
	chart_type: "bars",
	days_to_show: DEFAULT_DAYS,
	guideline: "esc_2024",
	...Object.fromEntries(SHOW_KEYS.map((key) => [key, true])),
};

// The usual resting pulse of adults, the faded band of the pulse.
export const PULSE_RANGE: [number, number] = [60, 100];

// What the card shows.
export interface BloodPressureConfig extends EditorConfig {
	systolic: string;
	diastolic: string;
}

// Whether a setting has a value. An emptied field in the editor counts as none.
export const isSet = <T>(value: T): value is Exclude<T, undefined | null | ""> =>
	value !== undefined && value !== null && value !== "";
