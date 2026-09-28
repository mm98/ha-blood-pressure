// Finds the blood pressure and pulse sensors of a monitor, to fill in a new
// card and to suggest the card in the card picker.

import type { HomeAssistant } from "./home-assistant";

type Role = "systolic" | "diastolic" | "pulse";

export interface Sensors {
	systolic: string;
	diastolic: string;
	pulse?: string;
}

// Words that mark the sensors in entity IDs, in English, Danish, German and
// Spanish, as Home Assistant writes them in entity IDs (without accents).
const WORDS: Record<Role, string[]> = {
	systolic: ["systolic", "systolisk", "systolisch", "sistolica"],
	diastolic: ["diastolic", "diastolisk", "diastolisch", "diastolica"],
	pulse: ["pulse", "puls", "pulso", "heart"],
};

const UNITS: Record<Role, string> = { systolic: "mmHg", diastolic: "mmHg", pulse: "bpm" };

const holds = (hass: HomeAssistant, entityId: string, role: Role): boolean =>
	entityId.startsWith("sensor.") &&
	hass.states[entityId]?.attributes.unit_of_measurement === UNITS[role] &&
	WORDS[role].some((word) => entityId.includes(word));

// How many characters two entity IDs share at the start: sensors of the same
// monitor start the same, like sensor.withings_.
const shared = (first: string, second: string): number => {
	let length = 0;
	while (length < first.length && first[length] === second[length]) {
		length++;
	}
	return length;
};

// The sensor for a role, the one closest to near when there are several.
const find = (hass: HomeAssistant, role: Role, near = ""): string | undefined =>
	Object.keys(hass.states)
		.filter((entityId) => holds(hass, entityId, role))
		.sort((a, b) => shared(b, near) - shared(a, near))[0];

const around = (hass: HomeAssistant, systolic = "", diastolic = find(hass, "diastolic", systolic) ?? ""): Sensors => {
	const pulse = find(hass, "pulse", systolic || diastolic);
	return pulse ? { systolic, diastolic, pulse } : { systolic, diastolic };
};

// The sensors of a new card.
export const stubConfig = (hass: HomeAssistant): Sensors => around(hass, find(hass, "systolic"));

// The sensors that belong with a picked sensor, when it is a blood pressure sensor.
export const sensorsFor = (hass: HomeAssistant, entityId: string): Sensors | null => {
	const sensors = holds(hass, entityId, "systolic")
		? around(hass, entityId)
		: holds(hass, entityId, "diastolic")
			? around(hass, find(hass, "systolic", entityId), entityId)
			: undefined;
	return sensors?.systolic && sensors.diastolic ? sensors : null;
};
