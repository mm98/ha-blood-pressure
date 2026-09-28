// Bundles the card into the one file Home Assistant loads: dist/blood-pressure.js.
// "node build.mjs --watch" rebuilds on every change.

import * as esbuild from "esbuild";
import { readFile } from "node:fs/promises";

const pkg = JSON.parse(await readFile(new URL("./package.json", import.meta.url), "utf8"));

const options = {
	entryPoints: ["src/blood-pressure.ts"],
	outfile: "dist/blood-pressure.js",
	bundle: true,
	// A plain script works both as a dashboard resource and when pasted into a page.
	format: "iife",
	target: "es2022",
	charset: "utf8",
	define: { __VERSION__: JSON.stringify(pkg.version) },
	banner: { js: `/* Blood pressure ${pkg.version}, ${pkg.homepage} */` },
	logLevel: "info",
};

if (process.argv.includes("--watch")) {
	await (await esbuild.context(options)).watch();
} else {
	await esbuild.build(options);
}
