// The card: the latest reading at the top like Home Assistant's entity card,
// the chart of the readings the recorder kept below it.

import { css, html, LitElement, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { CHARTS, type ChartInput, sharesOf } from "./charts";
import { type BloodPressureConfig, DEFAULT_DAYS, shows } from "./config";
import { EDITOR_TAG } from "./blood-pressure-editor";
import { classify, positionOf, SCALE_LIMITS, scaleOf, type Scheme, schemeOf } from "./guidelines";
import {
	createEntityNotFoundWarning,
	hasHassChanged,
	type HassEntity,
	type HomeAssistant,
	type LevelDefinition,
	loadCardElements,
	loadGaugeElements,
	type LovelaceCard,
	type LovelaceCardConfig,
	type LovelaceCardEditor,
	type LovelaceGridOptions,
} from "./home-assistant";
import { languageOf, translate } from "./i18n";
import { averageOf, fetchReadings, type Reading } from "./readings";
import { stubConfig } from "./sensors";
import { validateConfig } from "./validators";

export const CARD_TAG = "blood-pressure";

const DAY_MS = 24 * 3600 * 1000;

// The card's left and right padding, around the chart.
const PADDING = 32;
// The width of the chart until the card has measured itself.
const CHART_WIDTH = 418;

const numberOf = (stateObj: HassEntity): number | undefined => {
	const value = stateObj.state === "" ? NaN : Number(stateObj.state);
	return Number.isFinite(value) ? value : undefined;
};

export class BloodPressureCard extends LitElement implements LovelaceCard {
	// The header copies Home Assistant's entity card
	// (src/panels/lovelace/cards/hui-entity-card.ts). The additions are marked.
	static override styles = css`
		/* Added: a block, so the card can measure its width for the chart. */
		:host {
			display: block;
		}
		ha-card {
			height: 100%;
			display: flex;
			flex-direction: column;
		}
		.header {
			display: flex;
			padding: 8px 16px 0;
			justify-content: space-between;
		}
		.name {
			color: var(--secondary-text-color);
			line-height: 40px;
			font-size: var(--ha-font-size-l);
			font-weight: var(--ha-font-weight-medium);
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.icon {
			color: var(--state-icon-color);
			line-height: 40px;
		}
		.info {
			display: flex;
			align-items: baseline;
			padding: 0px 16px 16px;
			margin-top: -4px;
			line-height: var(--ha-line-height-condensed);
		}
		.info > * {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.value {
			font-size: var(--ha-font-size-3xl);
			margin-right: 4px;
			margin-inline-end: 4px;
			margin-inline-start: initial;
		}
		.measurement {
			font-size: var(--ha-font-size-l);
			color: var(--secondary-text-color);
		}
		/* Added: the category of the latest reading at the end of the line. */
		.category {
			margin-inline-start: auto;
			align-self: center;
			flex-shrink: 0;
			padding: 2px 10px;
			border-radius: 12px;
			font-size: var(--ha-font-size-s);
			font-weight: var(--ha-font-weight-medium);
			background-color: color-mix(in srgb, var(--category-color) 30%, transparent);
		}
		/* Added: the pulse and the average below the value, the chart and its legend. */
		.details {
			padding: 0 16px 8px;
			font-size: var(--ha-font-size-s);
			color: var(--secondary-text-color);
		}
		.info + .details {
			margin-top: -12px;
		}
		/* Added: the first part keeps the card's top padding when the parts
		   above it are turned off. */
		.details:first-child,
		.scales:first-child,
		svg:first-child {
			margin-top: 16px;
		}
		.range-text {
			min-width: 52px;
			text-align: end;
			font-variant-numeric: tabular-nums;
		}
		.scales {
			display: grid;
			grid-template-columns: auto minmax(0, 1fr) auto;
			align-items: center;
			gap: 10px 12px;
			padding: 4px 16px 12px;
			font-size: var(--ha-font-size-s);
			color: var(--secondary-text-color);
		}
		.scale {
			position: relative;
			display: flex;
			gap: 2px;
			height: 8px;
		}
		.scale i {
			background-color: var(--category-color);
		}
		.scale i:first-child {
			border-radius: 4px 0 0 4px;
		}
		.scale i:last-of-type {
			border-radius: 0 4px 4px 0;
		}
		.scale b {
			position: absolute;
			top: -4px;
			width: 3px;
			height: 16px;
			margin-inline-start: -1.5px;
			border-radius: 2px;
			background-color: var(--primary-text-color);
		}
		/* The chart is drawn at the size it shows, so text and dots keep their size. */
		svg {
			display: block;
			margin: 0 16px;
		}
		.grid {
			stroke: var(--divider-color);
			stroke-dasharray: 3 3;
		}
		.axis {
			fill: var(--secondary-text-color);
			font-size: 11px;
		}
		.normal {
			opacity: 0.12;
		}
		.line {
			fill: none;
			stroke: var(--secondary-text-color);
			stroke-opacity: 0.5;
			stroke-width: 1.5;
			stroke-linejoin: round;
		}
		.day.empty {
			fill: var(--divider-color);
		}
		.date {
			fill: var(--primary-text-color);
			font-size: 12px;
		}
		.range {
			stroke: var(--secondary-text-color);
			stroke-opacity: 0.35;
			stroke-width: 6;
			stroke-linecap: round;
		}
		/* The lowest to the highest measurement at the ends of a bar. */
		.whisker {
			stroke: var(--primary-text-color);
			stroke-opacity: 0.55;
			stroke-width: 2;
			stroke-linecap: round;
		}
		.limit {
			stroke: var(--secondary-text-color);
			stroke-opacity: 0.6;
			stroke-dasharray: 3 3;
		}
		.pulse {
			fill: var(--secondary-text-color);
		}
		.slice {
			fill: none;
			stroke-width: 28;
		}
		.total {
			fill: var(--primary-text-color);
			font-size: 28px;
		}
		.message {
			padding: 0 16px 16px;
			color: var(--secondary-text-color);
		}
		/* Added: the gauges side by side. The rules of the gauge and its title
		   copy Home Assistant's gauge card (src/panels/lovelace/cards/hui-gauge-card.ts). */
		.gauges {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
			gap: 8px;
			padding: 8px 16px 0;
		}
		.gauge {
			display: flex;
			flex-direction: column;
			align-items: center;
			min-width: 0;
		}
		ha-gauge {
			width: 100%;
			max-width: 250px;
		}
		.gauge .title {
			width: 100%;
			font-size: var(--ha-font-size-m);
			line-height: var(--ha-line-height-expanded);
			margin: 0;
			text-align: center;
			box-sizing: border-box;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			flex: none;
			color: var(--primary-text-color);
		}
		/* Added: the bottom padding of the card when there is no legend. */
		.end {
			height: 16px;
		}
		.legend {
			display: flex;
			flex-wrap: wrap;
			gap: 4px 12px;
			padding: 8px 16px 16px;
			font-size: var(--ha-font-size-s);
			color: var(--secondary-text-color);
		}
		.legend span {
			display: flex;
			align-items: center;
			gap: 6px;
		}
		.legend i {
			width: 10px;
			height: 10px;
			border-radius: 2px;
			background-color: var(--category-color);
		}
	`;

	@property({ attribute: false }) accessor hass: HomeAssistant | undefined;

	@state() private accessor _config: BloodPressureConfig | undefined;

	// Home Assistant's warning and gauge are loaded.
	@state() private accessor _ready = false;

	// Undefined while the history is read.
	@state() private accessor _readings: Reading[] | undefined;

	@state() private accessor _failed = false;

	private _drawnHass?: HomeAssistant;
	// What the readings belong to: the settings and the last changes of the
	// sensors. The history is read again when it changes.
	private _loadedFor?: string;
	// Counts the reads, so only the newest one is shown.
	private _readCount = 0;

	// The width the chart can use, measured, and the observer that measures it.
	@state() private accessor _width = CHART_WIDTH;
	private _resizeObserver?: ResizeObserver;

	static getConfigElement(): LovelaceCardEditor {
		return document.createElement(EDITOR_TAG);
	}

	static getStubConfig(hass: HomeAssistant) {
		return stubConfig(hass);
	}

	setConfig(config: LovelaceCardConfig): void {
		validateConfig(config);
		this._config = config;
	}

	getCardSize(): number {
		return 6;
	}

	getGridOptions(): LovelaceGridOptions {
		return { columns: 12, min_columns: 6 };
	}

	override connectedCallback(): void {
		super.connectedCallback();
		Promise.all([loadCardElements(), loadGaugeElements()]).then(
			() => {
				this._ready = true;
			},
			() => {
				// The warning then shows as plain text. The next connect tries again.
			},
		);
		// The chart is drawn at the width of the card, so it is drawn again
		// when the card gets wider or narrower.
		this._resizeObserver ??= new ResizeObserver(() => {
			if (this.clientWidth) {
				this._width = Math.round(this.clientWidth - PADDING);
			}
		});
		this._resizeObserver.observe(this);
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback();
		this._resizeObserver?.disconnect();
	}

	private get _entityIds(): string[] {
		const { systolic, diastolic, pulse } = this._config!;
		return pulse ? [systolic, diastolic, pulse] : [systolic, diastolic];
	}

	protected override shouldUpdate(changed: PropertyValues): boolean {
		if (!this._config || !this.hass) {
			return false;
		}
		return (
			["_config", "_ready", "_readings", "_failed", "_width"].some((key) => changed.has(key)) ||
			hasHassChanged(this._drawnHass, this.hass, this._entityIds)
		);
	}

	// shouldUpdate only lets an update through with _config and hass set, so
	// the ! below in willUpdate, render and updated are safe.
	protected override willUpdate(): void {
		this._drawnHass = this.hass;
		// Also measured here, as resize notifications wait for the page to be shown.
		if (this.clientWidth) {
			this._width = Math.round(this.clientWidth - PADDING);
		}
	}

	protected override updated(): void {
		const config = this._config!;
		const hass = this.hass!;
		const key = JSON.stringify([
			this._entityIds,
			config.days_to_show,
			this._entityIds.map((entityId) => hass.states[entityId]?.last_changed),
		]);
		if (key !== this._loadedFor) {
			this._loadedFor = key;
			void this._read(hass, config);
		}
	}

	private async _read(hass: HomeAssistant, config: BloodPressureConfig): Promise<void> {
		const read = ++this._readCount;
		try {
			const readings = await fetchReadings(hass, config, config.days_to_show ?? DEFAULT_DAYS);
			if (read === this._readCount) {
				this._readings = readings;
				this._failed = false;
			}
		} catch {
			if (read === this._readCount) {
				this._failed = true;
			}
		}
	}

	protected override render(): TemplateResult {
		const config = this._config!;
		const hass = this.hass!;
		const language = languageOf(hass);
		const missing = this._entityIds.find((entityId) => !hass.states[entityId]);
		if (missing) {
			return html`<hui-warning .hass=${hass}>${createEntityNotFoundWarning(hass, missing)}</hui-warning>`;
		}
		const scheme = schemeOf(config.guideline ?? "esc_2024", config.colors);
		const systolicState = hass.states[config.systolic];
		const systolic = numberOf(systolicState);
		const diastolic = numberOf(hass.states[config.diastolic]);
		const pulseState = config.pulse ? hass.states[config.pulse] : undefined;
		const pulse = pulseState ? numberOf(pulseState) : undefined;
		const category = systolic !== undefined && diastolic !== undefined ? classify(scheme, systolic, diastolic) : undefined;
		const readings = this._readings ?? [];
		const average = averageOf(readings);
		// The lowest and the highest value of the period, like 104-142.
		const range = (axis: "systolic" | "diastolic") => {
			const values = readings.flatMap((reading) => reading.measurements.map((measurement) => measurement[axis]));
			return values.length ? `${Math.round(Math.min(...values))}-${Math.round(Math.max(...values))}` : "";
		};
		const scales = shows(config, "show_scales") && systolic !== undefined && diastolic !== undefined;
		const showAverage = shows(config, "show_average") && average !== undefined;
		const details = [
			shows(config, "show_pulse") && pulse !== undefined
				? translate("text.pulse", language, {
						pulse: `${Math.round(pulse)} ${pulseState!.attributes.unit_of_measurement ?? "bpm"}`,
					})
				: "",
			showAverage
				? translate(average!.readings === 1 ? "text.average_one" : "text.average", language, {
						systolic: Math.round(average!.systolic),
						diastolic: Math.round(average!.diastolic),
						count: average!.readings,
					})
				: "",
		]
			.filter(Boolean)
			.join(", ");
		// The ranges show at the end of the scales, without them on a line of their own.
		const ranges =
			showAverage && !scales
				? translate("text.ranges", language, { systolic: range("systolic"), diastolic: range("diastolic") })
				: "";
		const header = shows(config, "show_title") || shows(config, "show_icon");
		const categoryShown = shows(config, "show_category") && category;
		return html`
			<ha-card>
				${header
					? html`<div class="header">
							<div class="name">${shows(config, "show_title") ? config.title || translate("text.title", language) : nothing}</div>
							${shows(config, "show_icon") ? html`<div class="icon"><ha-icon icon="mdi:heart-pulse"></ha-icon></div>` : nothing}
						</div>`
					: nothing}
				${shows(config, "show_state") || categoryShown
					? html`<div class="info">
							${shows(config, "show_state")
								? html`<span class="value">
											${systolic !== undefined && diastolic !== undefined
												? `${Math.round(systolic)}/${Math.round(diastolic)}`
												: hass.localize("state.default.unavailable")}
										</span>
										<span class="measurement">${systolicState.attributes.unit_of_measurement ?? "mmHg"}</span>`
								: nothing}
							${categoryShown
								? html`<span class="category" style=${`--category-color: ${category.color}`}>
										${translate(`category.${category.key}`, language)}
									</span>`
								: nothing}
						</div>`
					: nothing}
				${details || ranges
					? html`<div class="details">
							${[details, ranges]
								.filter(Boolean)
								.map((line) => html`<div>${line.charAt(0).toUpperCase()}${line.slice(1)}</div>`)}
						</div>`
					: nothing}
				${scales
					? html`<div class="scales">
							${this._renderScale(scheme, "systolic", systolic!, range("systolic"), language)}
							${this._renderScale(scheme, "diastolic", diastolic!, range("diastolic"), language)}
						</div>`
					: nothing}
				${this._renderChart(hass, config, scheme, language)}
			</ha-card>
		`;
	}

	// A bar with the categories one value can reach, a mark at the value, and
	// the lowest and the highest value of the period after it.
	private _renderScale(
		scheme: Scheme,
		axis: "systolic" | "diastolic",
		value: number,
		range: string,
		language: string,
	): TemplateResult {
		const [min, max] = SCALE_LIMITS[axis];
		const steps = scaleOf(scheme, axis);
		const at = (limit: number) => Math.min(Math.max(limit, min), max);
		return html`
			<span>${translate(`text.${axis}`, language)}</span>
			<div class="scale">
				${steps.map(
					({ from, category }, index) =>
						html`<i style=${`flex: ${at(steps[index + 1]?.from ?? max) - at(from)}; --category-color: ${category.color}`}></i>`,
				)}
				<b style=${`left: ${((at(value) - min) / (max - min)) * 100}%`}></b>
			</div>
			<span class="range-text">${shows(this._config!, "show_average") ? range : nothing}</span>
		`;
	}

	// Home Assistant's gauge with one segment per category and the needle at the
	// category of the latest reading, like its gauge card in needle mode. The
	// gauge names the category the needle points at, the reading shows below.
	private _renderGauge(
		hass: HomeAssistant,
		config: BloodPressureConfig,
		scheme: Scheme,
		language: string,
		showChart: boolean,
	): TemplateResult {
		const systolic = numberOf(hass.states[config.systolic]);
		const diastolic = numberOf(hass.states[config.diastolic]);
		const known = systolic !== undefined && diastolic !== undefined;
		const all = [scheme.low, ...scheme.categories];
		const levels: LevelDefinition[] = all.map((category, index) => ({
			level: index,
			stroke: category.color,
			// Without a reading the gauge names no category.
			label: known ? translate(`category.${category.key}`, language) : undefined,
		}));
		const unit = hass.states[config.systolic].attributes.unit_of_measurement ?? "mmHg";
		return html`
			${showChart
				? html`<div class="gauges">
						<div class="gauge">
							<ha-gauge
								.min=${0}
								.max=${all.length}
								.value=${known ? positionOf(scheme, systolic, diastolic) : 0}
								.valueText=${known ? "" : "-"}
								.locale=${hass.locale}
								.needle=${true}
								.levels=${levels}
								style=${config.height ? `max-width: ${config.height * 2}px` : nothing}
							></ha-gauge>
							<p class="title">
								${known
									? `${Math.round(systolic)}/${Math.round(diastolic)} ${unit}`
									: hass.localize("state.default.unavailable")}
							</p>
						</div>
					</div>`
				: nothing}
			${shows(config, "show_legend")
				? html`<div class="legend">
						${[scheme.low, ...scheme.categories].map(
							(category) => html`<span style=${`--category-color: ${category.color}`}>
								<i></i>${translate(`category.${category.key}`, language)}
							</span>`,
						)}
					</div>`
				: html`<div class="end"></div>`}
		`;
	}

	private _renderChart(
		hass: HomeAssistant,
		config: BloodPressureConfig,
		scheme: Scheme,
		language: string,
	): TemplateResult | typeof nothing {
		const days = config.days_to_show ?? DEFAULT_DAYS;
		const showChart = shows(config, "show_chart");
		// The gauge shows the latest reading, so it needs no history.
		if ((config.chart_type ?? "bars") === "gauge") {
			return this._renderGauge(hass, config, scheme, language, showChart);
		}
		if (this._failed) {
			return showChart ? html`<div class="message">${translate("text.no_history", language)}</div>` : html`<div class="end"></div>`;
		}
		if (!this._readings) {
			return nothing;
		}
		if (!this._readings.length) {
			return showChart
				? html`<div class="message">${translate("text.no_readings", language, { days })}</div>`
				: html`<div class="end"></div>`;
		}
		const end = Date.now();
		const type = config.chart_type === undefined || config.chart_type === "gauge" ? "bars" : config.chart_type;
		const chart = CHARTS[type];
		const base: Omit<ChartInput, "height"> = {
			width: this._width,
			readings: this._readings,
			scheme,
			start: end - days * DAY_MS,
			end,
			pulse:
				Boolean(config.pulse) && shows(config, "show_pulse") && this._readings.some((reading) => reading.pulse !== undefined),
			language,
			timeZone: hass.locale.time_zone === "server" ? hass.config.time_zone : undefined,
		};
		const input: ChartInput = { ...base, height: config.height ?? chart.height(base) };
		const shares = sharesOf(this._readings, scheme);
		return html`
			${showChart
				? html`<svg width=${input.width} height=${input.height} viewBox=${`0 0 ${input.width} ${input.height}`}>
						${chart.draw(input)}
					</svg>`
				: nothing}
			${shows(config, "show_legend")
				? html`<div class="legend">
						${shares.map(
							({ category, count }) => html`<span style=${`--category-color: ${category.color}`}>
								<i></i>${translate(`category.${category.key}`, language)}${type === "pie"
									? ` ${Math.round((count / this._readings!.length) * 100)}%`
									: ""}
							</span>`,
						)}
					</div>`
				: html`<div class="end"></div>`}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"blood-pressure": BloodPressureCard;
	}
}
