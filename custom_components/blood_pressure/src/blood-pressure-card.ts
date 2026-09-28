/*
 * Blood Pressure Card for Home Assistant dashboards.
 * Shows systolic, diastolic and pulse readings over time,
 * colored by a clinical guideline.
 */

import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { HomeAssistant, LovelaceCard, LovelaceCardConfig } from "./home-assistant";
import { validateConfig, type BloodPressureCardConfig } from "./config";

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
	`;

	@property({ attribute: false }) accessor hass: HomeAssistant | undefined;
	@state() private accessor _config: BloodPressureCardConfig | undefined;

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
	}

	getCardSize(): number {
		return 4;
	}

	protected override render(): TemplateResult {
		if (!this.hass || !this._config) {
			return html`<ha-card><div class="card-content"></div></ha-card>`;
		}

		const systolic = this.hass.states[this._config.systolic];
		const diastolic = this.hass.states[this._config.diastolic];
		const pulse = this._config.pulse ? this.hass.states[this._config.pulse] : undefined;

		if (!systolic || !diastolic) {
			return html`<ha-card><div class="card-content">Sensors not found</div></ha-card>`;
		}

		const lastSystolic = parseFloat(systolic.state);
		const lastDiastolic = parseFloat(diastolic.state);
		const lastPulse = pulse ? parseFloat(pulse.state) : undefined;

		return html`
			<ha-card>
				<div class="card-content">
					<div style="font-size: 32px; font-weight: 500;">
						${lastSystolic}/${lastDiastolic} <span style="font-size: 18px; color: var(--secondary-text-color);">mmHg</span>
					</div>
					${lastPulse ? html`<div style="margin-top: 4px; color: var(--secondary-text-color);">Pulse ${Math.round(lastPulse)} bpm</div>` : ""}
					<div style="margin-top: 12px; height: 200px; background: var(--surface-1); border-radius: 4px;">
						Chart (${this._config.chart_type || "bars"})
					</div>
				</div>
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
