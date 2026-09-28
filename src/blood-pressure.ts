/*
 * Blood pressure card for Home Assistant dashboards.
 *
 * Shows the latest reading of a systolic, a diastolic and a pulse sensor,
 * and a chart of the readings the recorder kept, colored by the categories
 * of a blood pressure guideline.
 */

import { BloodPressureCard, CARD_TAG } from "./blood-pressure-card";
import { BloodPressureEditor, EDITOR_TAG } from "./blood-pressure-editor";
import { languageOf, translate } from "./i18n";
import { sensorsFor } from "./sensors";

// Set by the build from package.json.
declare const __VERSION__: string;
const VERSION = __VERSION__;
const REPOSITORY = "https://github.com/mm98/ha-blood-pressure";

// Skips a tag that is already defined, for example when the card is loaded twice.
const defineOnce = (tag: string, element: CustomElementConstructor): void => {
	if (!customElements.get(tag)) {
		customElements.define(tag, element);
	}
};

defineOnce(EDITOR_TAG, BloodPressureEditor);
defineOnce(CARD_TAG, BloodPressureCard);

window.customCards ??= [];
if (!window.customCards.some((card) => card.type === CARD_TAG)) {
	window.customCards.push({
		type: CARD_TAG,
		// The product name, the same in every language.
		name: "Blood pressure",
		// Read when the card picker opens, so it follows the current language.
		get description() {
			return translate("card.description", languageOf());
		},
		preview: true,
		documentationURL: REPOSITORY,
		getEntitySuggestion: (hass, entityId) => {
			const sensors = sensorsFor(hass, entityId);
			return sensors ? { config: { type: `custom:${CARD_TAG}`, ...sensors } } : null;
		},
	});
}

// The one console call on purpose: the version in the browser console, to
// tell which build is loaded.
console.info(`blood-pressure ${VERSION}`);
