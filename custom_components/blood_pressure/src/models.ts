/*
 * Measurements, readings and averages.
 */

const MERGE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export interface Measurement {
	time: number; // Timestamp in ms
	systolic: number;
	diastolic: number;
	pulse?: number;
}

export interface Reading {
	time: number;
	systolic: number;
	diastolic: number;
	pulse?: number;
	measurements: Measurement[]; // The individual measurements merged into this reading
}

export interface Average {
	systolic: number;
	diastolic: number;
	pulse?: number;
	count: number;
	timeRange: [number, number]; // [start, end] in ms
}

export function mergeReadings(measurements: Measurement[]): Reading[] {
	if (!measurements.length) return [];
	measurements.sort((a, b) => a.time - b.time);
	const readings: Reading[] = [];
	let currentGroup: Measurement[] = [measurements[0]];

	for (let i = 1; i < measurements.length; i++) {
		if (measurements[i].time - currentGroup[0].time <= MERGE_WINDOW_MS) {
			currentGroup.push(measurements[i]);
		} else {
			readings.push(groupToReading(currentGroup));
			currentGroup = [measurements[i]];
		}
	}
	if (currentGroup.length) {
		readings.push(groupToReading(currentGroup));
	}
	return readings;
}

function groupToReading(group: Measurement[]): Reading {
	const avgSys = group.reduce((sum, m) => sum + m.systolic, 0) / group.length;
	const avgDia = group.reduce((sum, m) => sum + m.diastolic, 0) / group.length;
	const pulses = group.filter((m) => m.pulse !== undefined).map((m) => m.pulse!);
	const avgPulse = pulses.length ? pulses.reduce((a, b) => a + b) / pulses.length : undefined;
	return {
		time: group[0].time,
		systolic: avgSys,
		diastolic: avgDia,
		pulse: avgPulse,
		measurements: group,
	};
}

export function calculateAverage(readings: Reading[]): Average | null {
	if (!readings.length) return null;
	const avgSys = readings.reduce((sum, r) => sum + r.systolic, 0) / readings.length;
	const avgDia = readings.reduce((sum, r) => sum + r.diastolic, 0) / readings.length;
	const pulses = readings.filter((r) => r.pulse !== undefined).map((r) => r.pulse!);
	const avgPulse = pulses.length ? pulses.reduce((a, b) => a + b) / pulses.length : undefined;
	return {
		systolic: avgSys,
		diastolic: avgDia,
		pulse: avgPulse,
		count: readings.length,
		timeRange: [readings[0].time, readings[readings.length - 1].time],
	};
}
