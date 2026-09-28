/*
 * Blood Pressure Card for Home Assistant dashboards.
 * Shows systolic, diastolic and pulse readings over time,
 * colored by a clinical guideline.
 */

import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import type { HomeAssistant, LovelaceCard, LovelaceCardConfig } from "./home-assistant";
import { validateConfig, type BloodPressureCardConfig } from "./config";
import { GUIDELINES } from "./guidelines";
import { fetchHistory } from "./history";
import { mergeReadings, calculateAverage, type Reading } from "./models";
import { renderLinesChart, renderBarsChart, renderCalendarChart, renderPieChart } from "./charts";

declare const __VERSION__: string;

@customElement("blood-pressure-card")
export class BloodPressureCard extends LitElement implements LovelaceCard {
	static override styles = css`
		:host {
			display: block;
		}
		ha-card {
			height: 100%;
		}
		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 16px;
			border-bottom: 1px solid var(--divider-color);
		}
		.title {
			font-size: 18px;
			font-weight: 500;
		}
		.readings {
			padding: 16px;
			display: grid;
			grid-template-columns: auto 1fr;
			gap: 16px;
			align-items: center;
		}
		.value {
			font-size: 40px;
			font-weight: 700;
			line-height: 1;
		}
		.unit {
			font-size: 14px;
			color: var(--secondary-text-color);
			margin-top: 4px;
		}
		.chart {
			padding: 16px;
			height: 300px;
			overflow: hidden;
		}
		.chart svg {
			width: 100%;
			height: 100%;
		}
	`;

	@property({ attribute: false }) accessor hass: HomeAssistant | undefined;
	@state() private accessor _config: BloodPressureCardConfig | undefined;
	@state() private accessor _readings: Reading[] = [];
	@state() private accessor _loading = true;

	static getStubConfig(): LovelaceCardConfig {
		return {
			type: `custom:blood-pressure-card`,
			systolic: "sensor.systolic",
			diastolic: "sensor.diastolic",
		};
	}

	setConfig(config: LovelaceCardConfig): void {
		validateConfig(config);
		this._config = config;
		this._loadData();
	}

	getCardSize(): number {
		return 4;
	}

	protected override updated(): void {
		if (this.hass && this._config) {
			this._loadData();
		}
	}

	private async _loadData(): Promise<void> {
		if (!this.hass || !this._config) return;
		this._loading = true;
		const measurements = await fetchHistory(
			this.hass,
			this._config.systolic,
			this._config.diastolic,
			this._config.pulse,
			this._config.hours_to_show || 720
		);
		this._readings = mergeReadings(measurements);
		this._loading = false;
	}

	protected override render(): TemplateResult {
		if (!this.hass || !this._config) {
			return html`<ha-card><div class="card-content">Not configured</div></ha-card>`;
		}

		const systolic = this.hass.states[this._config.systolic];
		const diastolic = this.hass.states[this._config.diastolic];

		if (!systolic || !diastolic) {
			return html`<ha-card><div class="card-content">Sensors not found</div></ha-card>`;
		}

		const lastSystolic = parseInt(systolic.state);
		const lastDiastolic = parseInt(diastolic.state);
		const pulse = this._config.pulse ? this.hass.states[this._config.pulse] : undefined;
		const lastPulse = pulse ? parseInt(pulse.state) : undefined;

		const guideline = GUIDELINES[this._config.guideline || "esc_2024"];
		const chartType = this._config.chart_type || "bars";

		let chartSvg = "";
		if (this._readings.length > 0) {
			if (chartType === "lines") {
				chartSvg = renderLinesChart(this._readings, guideline);
			} else if (chartType === "calendar") {
				chartSvg = renderCalendarChart(this._readings, guideline);
			} else if (chartType === "pie") {
				chartSvg = renderPieChart(this._readings, guideline);
			} else {
				// Default to bars
				chartSvg = renderBarsChart(this._readings, guideline);
			}
		}

		const avg = calculateAverage(this._readings);

		return html`
			<ha-card>
				<div class="header">
					<div class="title">Blood Pressure</div>
					<div style="font-size: 12px; color: var(--secondary-text-color);">
						${guideline.name}
					</div>
				</div>
				<div class="readings">
					<div>
						<div class="value">${lastSystolic}/${lastDiastolic}</div>
						<div class="unit">mmHg</div>
						${lastPulse ? html`<div class="unit" style="margin-top: 8px;">${lastPulse} bpm</div>` : ""}
					</div>
					<div>
						${avg
							? html`
									<div style="font-size: 12px; color: var(--secondary-text-color); margin-bottom: 4px;">
										Average (${avg.count} readings)
									</div>
									<div style="font-size: 20px; font-weight: 500;">
										${Math.round(avg.systolic)}/${Math.round(avg.diastolic)}
									</div>
									${avg.pulse ? html`<div style="font-size: 12px; margin-top: 4px;">${Math.round(avg.pulse)} bpm</div>` : ""}
								`
							: ""}
					</div>
				</div>
				${chartSvg ? html`<div class="chart">${unsafeHTML(chartSvg)}</div>` : ""}
			</ha-card>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"blood-pressure-card": BloodPressureCard;
	}
}

window.customCards ??= [];
window.customCards.push({
	type: "blood-pressure-card",
	name: "Blood Pressure Card",
	description: "Shows blood pressure readings over time",
	preview: true,
	documentationURL: "https://github.com/mm98/ha-blood-pressure",
});

console.info(`blood-pressure-card ${__VERSION__}`);
