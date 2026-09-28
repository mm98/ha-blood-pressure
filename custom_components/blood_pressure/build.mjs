import * as esbuild from "esbuild";
import { readFile } from "node:fs/promises";

const pkg = JSON.parse(await readFile(new URL("./package.json", import.meta.url), "utf8"));

const options = {
	entryPoints: ["src/blood-pressure-card.ts"],
	outfile: "dist/blood-pressure-card.js",
	bundle: true,
	format: "iife",
	target: "es2022",
	charset: "utf8",
	define: { __VERSION__: JSON.stringify(pkg.version) },
	banner: { js: `/* Blood Pressure Card ${pkg.version}, ${pkg.homepage} */` },
	logLevel: "info",
};

if (process.argv.includes("--watch")) {
	await (await esbuild.context(options)).watch();
} else {
	await esbuild.build(options);
}
