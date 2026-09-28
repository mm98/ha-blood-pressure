// The readings: the sensor history from the recorder, put together into
// measurements, and measurements of one sitting merged into a reading.

import type { BloodPressureConfig } from "./config";
import type { HistoryStates, HomeAssistant } from "./home-assistant";

export interface Measurement {
	// Milliseconds since the epoch.
	time: number;
	systolic: number;
	diastolic: number;
	pulse?: number;
}

export interface Reading extends Measurement {
	// The measurements of the sitting, the values above are their average.
	measurements: Measurement[];
}

export interface Average {
	systolic: number;
	diastolic: number;
	pulse?: number;
	// Each sitting counts once.
	readings: number;
}

type Role = "systolic" | "diastolic" | "pulse";

interface Change {
	time: number;
	role: Role;
	value: number;
}

// The sensors of one measurement change within seconds of each other.
const PAIR_MS = 60 * 1000;

// Measurements taken this soon after the first one of a sitting become one
// reading with the average values, the way doctors count them.
const SITTING_MS = 10 * 60 * 1000;

const mean = (values: number[]): number => values.reduce((sum, value) => sum + value, 0) / values.length;

const meanPulse = (items: { pulse?: number }[]): number | undefined => {
	const pulses = items.flatMap((item) => (item.pulse === undefined ? [] : [item.pulse]));
	return pulses.length ? mean(pulses) : undefined;
};

// The changes of one sensor. A value that comes back unchanged after the
// sensor was unavailable, for example after a restart, is no new measurement.
const changesOf = (role: Role, states: HistoryStates[string] = []): Change[] => {
	const changes: Change[] = [];
	let last: number | undefined;
	let available = true;
	for (const state of states) {
		const value = state.s === "" ? NaN : Number(state.s);
		if (!Number.isFinite(value)) {
			available = false;
			continue;
		}
		const returned = !available && value === last;
		available = true;
		if (!returned) {
			last = value;
			changes.push({ time: (state.lc ?? state.lu) * 1000, role, value });
		}
	}
	return changes;
};

// Puts the changes of the sensors together into measurements. A sensor that
// did not change for a measurement had the same value as the time before.
export const pairChanges = (changes: Change[], roles: Role[]): Measurement[] => {
	const measurements: Measurement[] = [];
	const known: Partial<Record<Role, number>> = {};
	let pending: Set<Role> | undefined;
	let pendingAt = 0;
	const commit = (): void => {
		if (pending && known.systolic !== undefined && known.diastolic !== undefined) {
			measurements.push({ time: pendingAt, systolic: known.systolic, diastolic: known.diastolic, pulse: known.pulse });
		}
		pending = undefined;
	};
	for (const change of [...changes].sort((a, b) => a.time - b.time)) {
		if (pending && (pending.has(change.role) || change.time - pendingAt > PAIR_MS)) {
			commit();
		}
		if (!pending) {
			pending = new Set();
			pendingAt = change.time;
		}
		pending.add(change.role);
		known[change.role] = change.value;
		if (roles.every((role) => pending?.has(role))) {
			commit();
		}
	}
	commit();
	return measurements;
};

// Merges the measurements of one sitting into a reading. Expects them in time order.
export const mergeSittings = (measurements: Measurement[]): Reading[] => {
	const sittings: Measurement[][] = [];
	for (const measurement of measurements) {
		const sitting = sittings.at(-1);
		if (sitting && measurement.time - sitting[0].time <= SITTING_MS) {
			sitting.push(measurement);
		} else {
			sittings.push([measurement]);
		}
	}
	return sittings.map((sitting) => averageReading(sitting[0].time, sitting));
};

// A reading with the average of measurements, for a sitting or for a day.
export const averageReading = (time: number, measurements: Measurement[]): Reading => ({
	time,
	systolic: mean(measurements.map((measurement) => measurement.systolic)),
	diastolic: mean(measurements.map((measurement) => measurement.diastolic)),
	pulse: meanPulse(measurements),
	measurements,
});

// The lowest and the highest value of a reading's measurements.
export const rangeOf = (reading: Reading, axis: "systolic" | "diastolic" | "pulse"): [number, number] | undefined => {
	const values = reading.measurements.flatMap((measurement) => (measurement[axis] === undefined ? [] : [measurement[axis]]));
	return values.length ? [Math.min(...values), Math.max(...values)] : undefined;
};

export const averageOf = (readings: Reading[]): Average | undefined =>
	readings.length
		? {
				systolic: mean(readings.map((reading) => reading.systolic)),
				diastolic: mean(readings.map((reading) => reading.diastolic)),
				pulse: meanPulse(readings),
				readings: readings.length,
			}
		: undefined;

// The readings of the last days, through the command Home Assistant's
// history graph uses.
export const fetchReadings = async (hass: HomeAssistant, config: BloodPressureConfig, days: number): Promise<Reading[]> => {
	const sensors: [Role, string | undefined][] = [
		["systolic", config.systolic],
		["diastolic", config.diastolic],
		["pulse", config.pulse],
	];
	const used = sensors.filter((sensor): sensor is [Role, string] => Boolean(sensor[1]));
	const end = new Date();
	const start = new Date(end.getTime() - days * 24 * 3600 * 1000);
	const history = await hass.callWS<HistoryStates>({
		type: "history/history_during_period",
		start_time: start.toISOString(),
		end_time: end.toISOString(),
		entity_ids: used.map(([, entityId]) => entityId),
		include_start_time_state: false,
		significant_changes_only: false,
		minimal_response: true,
		no_attributes: true,
	});
	const changes = used.flatMap(([role, entityId]) => changesOf(role, history[entityId]));
	return mergeSittings(pairChanges(changes, used.map(([role]) => role)));
};
