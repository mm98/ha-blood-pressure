// Everything the card takes from Home Assistant's frontend, as small copies
// under Home Assistant's own names. Each copy names its source file in the
// frontend repository, checked at tag 20260826.7, so it can be checked again
// on each release. Types only hold the members the card uses.

declare global {
	interface Window {
		// src/data/lovelace_custom_cards.ts (CustomCardsWindow)
		customCards?: CustomCardEntry[];
		// src/panels/lovelace/custom-card-helpers.ts
		loadCardHelpers(): Promise<CustomCardHelpers>;
	}

	// src/common/dom/fire_event.ts and src/types.ts
	interface HASSDomEvents {
		"value-changed": {
			value: unknown;
		};
	}
}

// home-assistant-js-websocket (HassEntity)
export interface HassEntity {
	entity_id: string;
	state: string;
	attributes: {
		friendly_name?: string;
		unit_of_measurement?: string;
		[key: string]: unknown;
	};
	last_changed: string;
	last_updated: string;
}

// src/data/translation.ts, with the enums written as their values.
export interface FrontendLocaleData {
	language: string;
	time_zone: "local" | "server";
}

// src/types.ts
export interface HomeAssistant {
	states: Record<string, HassEntity>;
	config: {
		time_zone: string;
		state: "NOT_RUNNING" | "STARTING" | "RUNNING" | "STOPPING" | "FINAL_WRITE";
	};
	locale: FrontendLocaleData;
	language: string;
	connected: boolean;
	themes: unknown;
	localize(key: string, values?: Record<string, unknown>): string;
	callWS<T>(message: { type: string; [key: string]: unknown }): Promise<T>;
}

// src/data/history.ts (EntityHistoryState), the compressed form the
// history/history_during_period command sends: s is the state, lu the last
// update and lc the last change, in seconds. lc is only there when it
// differs from lu.
export interface EntityHistoryState {
	s: string;
	lu: number;
	lc?: number;
}

// src/data/history.ts (HistoryStates)
export type HistoryStates = Record<string, EntityHistoryState[]>;

// src/data/lovelace/config/card.ts. The index signature is unknown instead of
// Home Assistant's any, so every other key is checked before it is used.
export interface LovelaceCardConfig {
	type: string;
	[key: string]: unknown;
}

// src/panels/lovelace/types.ts
export interface LovelaceGridOptions {
	columns?: number | "full";
	rows?: number | "auto";
	max_columns?: number;
	min_columns?: number;
	min_rows?: number;
	max_rows?: number;
}

// src/panels/lovelace/types.ts
export interface LovelaceCard extends HTMLElement {
	hass?: HomeAssistant;
	preview?: boolean;
	getCardSize(): number | Promise<number>;
	getGridOptions?(): LovelaceGridOptions;
	setConfig(config: LovelaceCardConfig): void;
}

// src/panels/lovelace/types.ts (LovelaceCardEditor and LovelaceGenericElementEditor)
export interface LovelaceCardEditor extends HTMLElement {
	hass?: HomeAssistant;
	setConfig(config: LovelaceCardConfig): void;
}

// src/data/lovelace_custom_cards.ts
export interface CustomCardSuggestion {
	label?: string;
	config: LovelaceCardConfig;
}

// src/data/lovelace_custom_cards.ts
export interface CustomCardEntry {
	type: string;
	name?: string;
	description?: string;
	preview?: boolean;
	documentationURL?: string;
	getEntitySuggestion?: (
		hass: HomeAssistant,
		entityId: string,
	) => CustomCardSuggestion | CustomCardSuggestion[] | null;
}

// src/panels/lovelace/custom-card-helpers.ts, what window.loadCardHelpers() returns.
export interface CustomCardHelpers {
	createCardElement(config: LovelaceCardConfig): HTMLElement;
}

// src/common/dom/fire_event.ts
export interface HASSDomEvent<T> extends Event {
	detail: T;
}

// src/types.ts
export interface ValueChangedEvent<T> extends CustomEvent {
	detail: {
		value: T;
	};
}

// src/common/color/compute-color.ts
const THEME_COLORS = new Set([
	"primary",
	"accent",
	"red",
	"pink",
	"purple",
	"deep-purple",
	"indigo",
	"blue",
	"light-blue",
	"cyan",
	"teal",
	"green",
	"light-green",
	"lime",
	"yellow",
	"amber",
	"orange",
	"deep-orange",
	"brown",
	"light-grey",
	"grey",
	"dark-grey",
	"blue-grey",
	"black",
	"white",
]);

// src/common/color/compute-color.ts
const YAML_ONLY_THEMES_COLORS = new Set(["primary-text", "secondary-text", "disabled"]);

// src/common/color/compute-color.ts
export const computeCssVariableName = (color: string): string =>
	THEME_COLORS.has(color) || YAML_ONLY_THEMES_COLORS.has(color) ? `--${color}-color` : color;

// src/common/color/compute-color.ts
export const computeCssColor = (color: string): string => {
	const cssVarName = computeCssVariableName(color);
	return cssVarName !== color ? `var(${cssVarName})` : color;
};

// src/common/dom/fire_event.ts
export const fireEvent = <HassEvent extends keyof HASSDomEvents>(
	node: HTMLElement | Window,
	type: HassEvent,
	detail?: HASSDomEvents[HassEvent],
	options?: {
		bubbles?: boolean;
		cancelable?: boolean;
		composed?: boolean;
	},
): Event => {
	options = options || {};
	const event = new Event(type, {
		bubbles: options.bubbles === undefined ? true : options.bubbles,
		cancelable: Boolean(options.cancelable),
		composed: options.composed === undefined ? true : options.composed,
	});
	(event as HASSDomEvent<unknown>).detail = detail === null || detail === undefined ? {} : detail;
	node.dispatchEvent(event);
	return event;
};

// The hass keys that change what the card shows. The list of
// src/panels/lovelace/common/has-changed.ts.
const DISPLAY_KEYS = ["connected", "themes", "locale", "localize"] as const;

// Like src/panels/lovelace/common/has-changed.ts: only redraw when one of the
// entities or the way things are shown changed.
export const hasHassChanged = (old: HomeAssistant | undefined, hass: HomeAssistant, entityIds: string[]): boolean =>
	!old ||
	DISPLAY_KEYS.some((key) => old[key] !== hass[key]) ||
	old.config.state !== hass.config.state ||
	old.config.time_zone !== hass.config.time_zone ||
	entityIds.some((entityId) => old.states[entityId] !== hass.states[entityId]);

// Like createEntityNotFoundWarning in src/panels/lovelace/components/hui-warning.ts,
// but with Home Assistant's text that names the entity, as the card has three.
export const createEntityNotFoundWarning = (
	hass: Pick<HomeAssistant, "config" | "localize">,
	entityId: string,
): string =>
	hass.config.state !== "NOT_RUNNING"
		? hass.localize("ui.panel.lovelace.warning.entity_not_found", { entity: entityId })
		: hass.localize("ui.panel.lovelace.warning.starting");

// Home Assistant loads its elements only when a dashboard needs them.
// Creating an element that is never shown makes it load them.
const loading = new Map<string, Promise<void>>();

// A failed load is forgotten, so the next element that connects tries again.
const loadOnce = (key: string, tags: string[], load: () => Promise<unknown>): Promise<void> => {
	let promise = loading.get(key);
	if (!promise) {
		promise = (async () => {
			if (!tags.every((tag) => customElements.get(tag))) {
				await load();
				await Promise.all(tags.map((tag) => customElements.whenDefined(tag)));
			}
		})();
		promise.catch(() => loading.delete(key));
		loading.set(key, promise);
	}
	return promise;
};

// The warning of Home Assistant's cards, through its entity card.
export const loadCardElements = (): Promise<void> =>
	loadOnce("card", ["hui-warning"], async () => {
		(await window.loadCardHelpers()).createCardElement({ type: "entity", entity: "sun.sun" });
	});

// Home Assistant's gauge, through its gauge card.
export const loadGaugeElements = (): Promise<void> =>
	loadOnce("gauge", ["ha-gauge"], async () => {
		(await window.loadCardHelpers()).createCardElement({ type: "gauge", entity: "sun.sun" });
	});

// src/components/ha-gauge.ts (LevelDefinition)
export interface LevelDefinition {
	level: number;
	stroke: string;
	label?: string;
}

// The form of the visual editor, through the entities card's editor.
export const loadEditorElements = (): Promise<void> =>
	loadOnce("editor", ["ha-form"], async () => {
		(await window.loadCardHelpers()).createCardElement({ type: "entities", entities: [] });
		await customElements.whenDefined("hui-entities-card");
		const card = customElements.get("hui-entities-card") as unknown as { getConfigElement(): Promise<unknown> };
		await card.getConfigElement();
	});
