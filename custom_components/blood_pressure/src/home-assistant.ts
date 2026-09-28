/*
 * Home Assistant types and helpers, copied from the frontend source at tag 20260826.7
 */

declare global {
	interface Window {
		customCards?: CustomCardEntry[];
	}

	interface HASSDomEvents {
		"value-changed": {
			value: unknown;
		};
	}
}

export interface HassEntity {
	entity_id: string;
	state: string;
	attributes: Record<string, any>;
	last_changed: string;
	last_updated: string;
}

export interface HomeAssistant {
	states: Record<string, HassEntity>;
	config: {
		time_zone: string;
		state: "NOT_RUNNING" | "STARTING" | "RUNNING" | "STOPPING" | "FINAL_WRITE";
	};
	locale: {
		language: string;
		time_format: "language" | "system" | "12" | "24";
		time_zone: "local" | "server";
		number_format: "language" | "system" | "comma_decimal" | "decimal_comma" | "quote_decimal" | "space_comma" | "none";
	};
	language: string;
	themes: unknown;
}

export interface LovelaceCardConfig {
	type: string;
	[key: string]: any;
}

export interface LovelaceCard extends HTMLElement {
	hass?: HomeAssistant;
	getCardSize(): number | Promise<number>;
	setConfig(config: LovelaceCardConfig): void;
}

export interface CustomCardEntry {
	type: string;
	name?: string;
	description?: string;
	preview?: boolean;
	documentationURL?: string;
}

export function isValidEntityId(entityId: string): boolean {
	return /^[\w]+\.[\w]+$/.test(entityId);
}
