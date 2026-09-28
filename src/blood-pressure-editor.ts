// The visual editor. It uses Home Assistant's form (ha-form) and selectors,
// and is laid out like Home Assistant's own card editors: the sensors first,
// then a section that opens.

import { html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { CHART_TYPES, DEFAULTS, type EditorConfig, GUIDELINE_IDS, type GuidelineId, SHOW_KEYS, shows } from "./config";
import { categoriesOf } from "./guidelines";
import {
	fireEvent,
	type HomeAssistant,
	loadEditorElements,
	type LovelaceCardConfig,
	type LovelaceCardEditor,
	type ValueChangedEvent,
} from "./home-assistant";
import { hasTranslation, languageOf, translate, type TranslationKey } from "./i18n";
import { validateEditorConfig } from "./validators";

export const EDITOR_TAG = "blood-pressure-editor";

// An ha-form select selector with the card's texts for the options.
const selectSelector = (options: readonly string[], group: "chart_type" | "guideline", language: string) => ({
	select: {
		mode: "dropdown",
		options: options.map((value) => ({ value, label: translate(`${group}.${value}` as TranslationKey, language) })),
	},
});

const sensorSelector = (unit: string) => ({ entity: { filter: { domain: "sensor", unit_of_measurement: unit } } });

const buildSchema = (language: string, guideline: GuidelineId) => [
	{ name: "systolic", required: true, selector: sensorSelector("mmHg") },
	{ name: "diastolic", required: true, selector: sensorSelector("mmHg") },
	{ name: "pulse", selector: sensorSelector("bpm") },
	{
		name: "chart",
		type: "expandable",
		flatten: true,
		expanded: true,
		icon: "mdi:chart-bar",
		schema: [
			{ name: "title", selector: { text: {} } },
			{ name: "chart_type", selector: selectSelector(CHART_TYPES, "chart_type", language) },
			{
				name: "",
				type: "grid",
				schema: [
					{ name: "days_to_show", selector: { number: { mode: "box", min: 1, step: 1 } } },
					{ name: "guideline", selector: selectSelector(GUIDELINE_IDS, "guideline", language) },
				],
			},
		],
	},
	{
		name: "show",
		type: "expandable",
		flatten: true,
		icon: "mdi:eye-outline",
		// One list of check boxes, closer together than a toggle per part. The
		// saved YAML keeps a show_ setting per part.
		schema: [
			{
				name: "show_parts",
				selector: {
					select: {
						multiple: true,
						mode: "list",
						options: SHOW_KEYS.map((key) => ({ value: key, label: translate(`label.${key}`, language) })),
					},
				},
			},
		],
	},
	{
		// Not flattened: the colors go into their own map, colors: in the YAML.
		name: "colors",
		type: "expandable",
		icon: "mdi:palette-outline",
		schema: categoriesOf(guideline).map((category) => ({
			name: category.key,
			selector: { ui_color: { default_color: category.color } },
		})),
	},
];

export class BloodPressureEditor extends LitElement implements LovelaceCardEditor {
	@property({ attribute: false }) accessor hass: HomeAssistant | undefined;

	@state() private accessor _config: EditorConfig | undefined;

	// Home Assistant's form is loaded.
	@state() private accessor _ready = false;

	private _schemaKey?: string;
	private _schema?: ReturnType<typeof buildSchema>;

	setConfig(config: LovelaceCardConfig): void {
		// Settings the form cannot show make Home Assistant switch to YAML.
		validateEditorConfig(config);
		this._config = config;
	}

	override connectedCallback(): void {
		super.connectedCallback();
		loadEditorElements().then(
			() => {
				this._ready = true;
			},
			() => {
				// Nothing to show without Home Assistant's form. The next connect
				// tries again.
			},
		);
	}

	protected override render(): TemplateResult | typeof nothing {
		if (!this.hass || !this._config || !this._ready) {
			return nothing;
		}
		// The form only changes with the language and the guideline, whose
		// categories get a color each, so it keeps its state.
		const language = languageOf(this.hass);
		const guideline = this._config.guideline ?? "esc_2024";
		if (`${language} ${guideline}` !== this._schemaKey) {
			this._schemaKey = `${language} ${guideline}`;
			this._schema = buildSchema(language, guideline);
		}
		return html`
			<ha-form
				.hass=${this.hass}
				.data=${{
					...DEFAULTS,
					...this._config,
					show_parts: SHOW_KEYS.filter((key) => shows(this._config!, key)),
				}}
				.schema=${this._schema}
				.computeLabel=${this._computeLabel}
				.computeHelper=${this._computeHelper}
				@value-changed=${this._valueChanged}
			></ha-form>
		`;
	}

	// The card's own texts, else Home Assistant's labels for its generic
	// fields, like its form editor for cards does.
	private _computeLabel = (schema: { name: string }): string => {
		const language = languageOf(this.hass);
		for (const key of [`label.${schema.name}`, `category.${schema.name}`]) {
			if (hasTranslation(key)) {
				return translate(key, language);
			}
		}
		// ha-form only asks for labels after render, which needs hass.
		return this.hass!.localize(`ui.panel.lovelace.editor.card.generic.${schema.name}`);
	};

	private _computeHelper = (schema: { name: string }): string | undefined => {
		const key = `helper.${schema.name}`;
		return hasTranslation(key) ? translate(key, languageOf(this.hass)) : undefined;
	};

	// The form holds the defaults too. They are left out, so the saved YAML
	// only holds what differs from them.
	private _valueChanged(ev: ValueChangedEvent<EditorConfig & { show_parts?: string[] }>): void {
		ev.stopPropagation();
		const { show_parts: parts = [], ...value } = ev.detail.value;
		for (const key of SHOW_KEYS) {
			value[key] = parts.includes(key);
		}
		const config = Object.fromEntries(Object.entries(value).filter(([key, item]) => DEFAULTS[key] !== item)) as EditorConfig;
		// The same for the colors: only the ones that differ from a category's own.
		const own = Object.fromEntries(categoriesOf(config.guideline ?? "esc_2024").map((category) => [category.key, category.color]));
		const colors = Object.entries(config.colors ?? {}).filter(([key, color]) => color && own[key] !== color);
		if (colors.length) {
			config.colors = Object.fromEntries(colors);
		} else {
			delete config.colors;
		}
		fireEvent(this, "config-changed", { config });
	}
}

declare global {
	interface HASSDomEvents {
		"config-changed": { config: EditorConfig };
	}

	interface HTMLElementTagNameMap {
		"blood-pressure-editor": BloodPressureEditor;
	}
}
