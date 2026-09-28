# Contributing

The card is written in TypeScript with [Lit](https://lit.dev/) and follows the conventions of the [Home Assistant frontend](https://github.com/home-assistant/frontend). One build step turns the source in `src/` into the file Home Assistant loads, `dist/blood-pressure.js`.

## Build

You need [Node.js](https://nodejs.org/) 20 or newer.

```bash
npm install
npm run check
npm run build
```

- `npm run check` runs the TypeScript type check.
- `npm run build` writes `dist/blood-pressure.js`. Commit it together with your change in `src/`: HACS installs that file, and a check on GitHub fails when it does not match the source.
- `npm run watch` builds again on every change.

To try a change, copy `dist/blood-pressure.js` into the `www` folder of a Home Assistant test setup, add it as a dashboard resource and reload the browser.

## Where things are

| Path | What it holds |
|---|---|
| `src/blood-pressure.ts` | The entry: defines the elements and adds the card to the card picker. |
| `src/blood-pressure-card.ts`, `-editor.ts` | The card and the visual editor, one file per element. |
| `src/config.ts`, `src/validators.ts` | The settings and their checks. |
| `src/readings.ts` | Reads the history of the sensors and puts it together into readings. |
| `src/guidelines.ts` | The categories of each guideline, and which category a reading gets. |
| `src/charts.ts` | The chart types. |
| `src/sensors.ts` | Finds the blood pressure and pulse sensors, for a new card and for card suggestions. |
| `src/home-assistant.ts` | Home Assistant types, and helpers copied from its frontend under their own names. |
| `src/i18n/` | The texts of the card, one JSON file per language. |

## Add a language

1. Copy `src/i18n/en.json` to a file named after the language code, for example `src/i18n/fr.json`, and translate the texts. Use the words Home Assistant uses in that language.
2. Import it in `src/i18n/index.ts` and add it to `TRANSLATIONS`.
3. Run `npm run check`. It fails when a text is missing.

Labels of fields Home Assistant already knows, like name, icon and state, come from Home Assistant's own translations.

## Add a guideline

Add its categories to `GUIDELINES` in `src/guidelines.ts`, its key to `GUIDELINE_IDS` in `src/config.ts`, and its name and any new category names to every file in `src/i18n/`.
