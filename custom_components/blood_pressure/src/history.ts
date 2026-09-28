/*
 * Fetch history from the recorder.
 */

import type { HomeAssistant } from "./home-assistant";
import type { Measurement } from "./models";

export async function fetchHistory(
	hass: HomeAssistant,
	systolicId: string,
	diastolicId: string,
	pulseId: string | undefined,
	hoursBack: number
): Promise<Measurement[]> {
	const now = new Date();
	const start = new Date(now.getTime() - hoursBack * 3600 * 1000);

	const url = `/api/history/period/${start.toISOString()}`;
	const params = new URLSearchParams();
	params.append("filter_entity_id", systolicId);
	if (diastolicId) params.append("filter_entity_id", diastolicId);
	if (pulseId) params.append("filter_entity_id", pulseId);
	params.append("minimal_response", "true");

	try {
		const response = await fetch(`${url}?${params}`, {
			headers: {
				Authorization: `Bearer ${(hass as any).auth?.accessToken || ""}`,
			},
		});
		if (!response.ok) {
			console.warn("Failed to fetch history", response.status);
			return [];
		}

		const history = await response.json();
		return mergeHistory(history, systolicId, diastolicId, pulseId);
	} catch (error) {
		console.error("Error fetching history:", error);
		return [];
	}
}

function mergeHistory(
	history: any[],
	systolicId: string,
	diastolicId: string,
	pulseId?: string
): Measurement[] {
	const measurements: Record<string, Measurement> = {};

	for (const series of history) {
		if (!Array.isArray(series) || !series.length) continue;
		const entityId = series[0]?.entity_id;
		if (!entityId) continue;

		for (const state of series) {
			const time = new Date(state.last_changed).getTime();
			const key = time.toString();

			if (!measurements[key]) {
				measurements[key] = { time, systolic: 0, diastolic: 0 };
			}

			const value = parseFloat(state.state);
			if (isNaN(value)) continue;

			if (entityId === systolicId) {
				measurements[key].systolic = value;
			} else if (entityId === diastolicId) {
				measurements[key].diastolic = value;
			} else if (entityId === pulseId) {
				measurements[key].pulse = value;
			}
		}
	}

	return Object.values(measurements)
		.filter((m) => m.systolic && m.diastolic)
		.sort((a, b) => a.time - b.time);
}
