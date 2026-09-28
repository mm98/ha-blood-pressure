# Blood Pressure Card

A Home Assistant dashboard card that shows blood pressure readings over time, colored by a clinical guideline.

## Features

- Pick your three sensors (systolic, diastolic, pulse) in the card config
- Shows readings colored by ESC 2024, ESC/ESH 2018 or ACC/AHA 2017 categories
- Five render options: bars, line chart, zone chart, calendar, or weekly averages
- Displays the 7-day average and category
- Reads the recorder history, no extra installation step

## Installation

1. Copy `custom_components/blood_pressure` to your Home Assistant `custom_components` folder.
2. Add the card to a dashboard with YAML or the visual editor.

## Example configuration

```yaml
type: custom:blood-pressure-card
systolic: sensor.withings_systolic_blood_pressure
diastolic: sensor.withings_diastolic_blood_pressure
pulse: sensor.withings_heart_pulse
guideline: esc_2024
chart_type: bars
hours_to_show: 720
```

## Options

- `systolic` (required): The systolic sensor
- `diastolic` (required): The diastolic sensor
- `pulse`: The pulse sensor (optional)
- `guideline`: `esc_2024` (default), `esc_esh_2018`, or `acc_aha_2017`
- `chart_type`: `bars` (default), `lines`, `zone`, `calendar`, or `weekly`
- `hours_to_show`: How far back (default 720 = 30 days)
- `pulse_low`, `pulse_high`: Your pulse range limits (default 60–100 bpm)

## Button card example

Your own targets can go in a label below the card.

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
