/*
 * Chart renderers for different viewing modes.
 * Each takes readings and a guideline, returns SVG.
 */

import type { Reading } from "./models";
import type { Guideline } from "./guidelines";
import { getColor } from "./guidelines";

const WIDTH = 600;
const HEIGHT = 300;
const PADDING = 40;

export function renderLinesChart(readings: Reading[], _guideline: Guideline): string {
	if (!readings.length) return "";
	const times = readings.map((r) => r.time);
	const minTime = Math.min(...times);
	const maxTime = Math.max(...times);
	const maxSys = Math.max(...readings.map((r) => r.systolic), 160);

	const xScale = (time: number) => PADDING + ((time - minTime) / (maxTime - minTime)) * (WIDTH - 2 * PADDING);
	const ySysScale = (value: number) => HEIGHT - PADDING - ((value - 60) / (maxSys - 60)) * (HEIGHT - 2 * PADDING);
	const yDiaScale = (value: number) => HEIGHT - PADDING - ((value - 40) / (maxSys - 40)) * (HEIGHT - 2 * PADDING);

	const sysPoints = readings.map((r) => [xScale(r.time), ySysScale(r.systolic)] as const);
	const diaPoints = readings.map((r) => [xScale(r.time), yDiaScale(r.diastolic)] as const);

	const sysPath = "M" + sysPoints.map((p) => `${p[0]},${p[1]}`).join("L");
	const diaPath = "M" + diaPoints.map((p) => `${p[0]},${p[1]}`).join("L");

	return `
		<svg width="100%" height="100%" viewBox="0 0 ${WIDTH} ${HEIGHT}">
			<defs>
				<linearGradient id="sysFill" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" style="stop-color:#ccc;stop-opacity:0.3" />
					<stop offset="100%" style="stop-color:#ccc;stop-opacity:0" />
				</linearGradient>
			</defs>
			<!-- Grid lines -->
			<line x1="${PADDING}" y1="${ySysScale(140)}" x2="${WIDTH - PADDING}" y2="${ySysScale(140)}" stroke="#ddd" stroke-dasharray="4"/>
			<line x1="${PADDING}" y1="${yDiaScale(90)}" x2="${WIDTH - PADDING}" y2="${yDiaScale(90)}" stroke="#ddd" stroke-dasharray="4"/>
			<!-- Systolic line -->
			<path d="${sysPath}" fill="none" stroke="#0066cc" stroke-width="2" stroke-linejoin="round"/>
			<!-- Diastolic line -->
			<path d="${diaPath}" fill="none" stroke="#009933" stroke-width="2" stroke-linejoin="round"/>
			<!-- Points -->
			${readings.map((_r, i) => `<circle cx="${sysPoints[i][0]}" cy="${sysPoints[i][1]}" r="3" fill="#0066cc"/>`).join("")}
			${readings.map((_r, i) => `<circle cx="${diaPoints[i][0]}" cy="${diaPoints[i][1]}" r="3" fill="#009933"/>`).join("")}
		</svg>
	`;
}

export function renderBarsChart(readings: Reading[], guideline: Guideline): string {
	if (!readings.length) return "";
	const times = readings.map((r) => r.time);
	const minTime = Math.min(...times);
	const maxTime = Math.max(...times);
	const barWidth = (WIDTH - 2 * PADDING) / readings.length * 0.8;
	const spacing = (WIDTH - 2 * PADDING) / readings.length;

	return `
		<svg width="100%" height="100%" viewBox="0 0 ${WIDTH} ${HEIGHT}">
			<!-- Guide lines -->
			<line x1="${PADDING}" y1="${HEIGHT - PADDING - 80}" x2="${WIDTH - PADDING}" y2="${HEIGHT - PADDING - 80}" stroke="#ddd" stroke-dasharray="4"/>
			<!-- Bars -->
			${readings
				.map((r, i) => {
					const x = PADDING + i * spacing + spacing / 2 - barWidth / 2;
					const sysY = HEIGHT - PADDING - ((r.systolic - 60) / 120) * (HEIGHT - 2 * PADDING);
					const diaY = HEIGHT - PADDING - ((r.diastolic - 40) / 80) * (HEIGHT - 2 * PADDING);
					const color = getColor(guideline, r.systolic, r.diastolic);
					return `<rect x="${x}" y="${Math.min(sysY, diaY)}" width="${barWidth}" height="${Math.abs(sysY - diaY)}" fill="${color}" opacity="0.7"/>`;
				})
				.join("")}
		</svg>
	`;
}

export function renderCalendarChart(readings: Reading[], guideline: Guideline): string {
	const byDay: Record<string, Reading[]> = {};
	readings.forEach((r) => {
		const date = new Date(r.time);
		const key = date.toISOString().slice(0, 10);
		if (!byDay[key]) byDay[key] = [];
		byDay[key].push(r);
	});

	const days = Object.entries(byDay)
		.sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
		.slice(-35); // Last 5 weeks
	const _minTime = Math.min(...days.map((d) => new Date(d[0]).getTime()));
	const _maxTime = Math.max(...days.map((d) => new Date(d[0]).getTime()));

	const cellSize = 20;
	const cols = 7;
	const spacing = cellSize + 4;

	return `
		<svg width="100%" height="100%" viewBox="0 0 ${cols * spacing + 20} ${Math.ceil(days.length / cols) * spacing + 40}">
			${days
				.map((entry, idx) => {
					const [_dateStr, dayReadings] = entry;
					const col = idx % cols;
					const row = Math.floor(idx / cols);
					const x = 10 + col * spacing;
					const y = 30 + row * spacing;
					const firstReading = dayReadings[0];
					const color = getColor(guideline, firstReading.systolic, firstReading.diastolic);
					return `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${color}" opacity="0.7" rx="2"/>`;
				})
				.join("")}
		</svg>
	`;
}

export function renderPieChart(readings: Reading[], guideline: Guideline): string {
	const categories: Record<string, number> = {};
	readings.forEach((r) => {
		const cat = getColor(guideline, r.systolic, r.diastolic);
		categories[cat] = (categories[cat] || 0) + 1;
	});

	const total = readings.length;
	let angle = 0;
	const slices = Object.entries(categories).map(([color, count]) => {
		const sliceAngle = (count / total) * 360;
		const startAngle = angle;
		const endAngle = angle + sliceAngle;
		angle += sliceAngle;

		const startRad = (startAngle * Math.PI) / 180;
		const endRad = (endAngle * Math.PI) / 180;
		const x1 = 100 + 80 * Math.cos(startRad);
		const y1 = 100 + 80 * Math.sin(startRad);
		const x2 = 100 + 80 * Math.cos(endRad);
		const y2 = 100 + 80 * Math.sin(endRad);

		const largeArc = sliceAngle > 180 ? 1 : 0;
		const path = `M100,100 L${x1},${y1} A80,80 0 ${largeArc},1 ${x2},${y2} Z`;
		return `<path d="${path}" fill="${color}" opacity="0.7"/>`;
	});

	return `
		<svg width="100%" height="100%" viewBox="0 0 200 200">
			${slices.join("")}
		</svg>
	`;
}
