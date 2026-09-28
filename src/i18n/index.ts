// i18n: the card's own texts, one JSON file per language. Home Assistant
// translates the labels of its generic fields (name) itself.
//
// To add a language, copy en.json to <language code>.json, translate it and
// add it to TRANSLATIONS. The type check fails when a text is missing.

import type { HomeAssistant } from "../home-assistant";
import da from "./da.json";
import de from "./de.json";
import en from "./en.json";
import es from "./es.json";

type Translation = typeof en;

const TRANSLATIONS: Record<string, Translation> = { da, de, en, es };

// Every key of en.json, like "label.systolic" or "category.elevated".
type Keys<T> = { [K in keyof T & string]: T[K] extends string ? K : `${K}.${Keys<T[K]>}` }[keyof T & string];
export type TranslationKey = Keys<Translation>;

const find = (translation: Translation | undefined, key: string): string | undefined => {
	let found: unknown = translation;
	for (const part of key.split(".")) {
		found = (found as Record<string, unknown> | undefined)?.[part];
	}
	return typeof found === "string" ? found : undefined;
};

export const hasTranslation = (key: string): key is TranslationKey => find(en, key) !== undefined;

// A text in the language of the user profile. Regional variants like es-419
// use the texts of their language, other languages English. {name} in the
// text is replaced by values.name.
export const translate = (key: TranslationKey, language: string, values: Record<string, string | number> = {}): string =>
	(find(TRANSLATIONS[language.split("-")[0]], key) ?? find(en, key) ?? key).replace(/\{(\w+)\}/g, (text, name) =>
		name in values ? String(values[name]) : text,
	);

// The language of the user profile, which the texts follow. The editor has no
// locale of its own, but Home Assistant sets the page language.
export const languageOf = (hass?: Pick<HomeAssistant, "locale" | "language">): string =>
	hass?.locale.language ?? hass?.language ?? document.documentElement.lang;
