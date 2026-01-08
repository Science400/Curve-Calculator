# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Curve Calculator** web application for Magnum Manufacturing that calculates railroad panel curves based on radius measurements. It's a single-page application built with vanilla HTML, CSS, and JavaScript (no build system or package manager).

The application calculates:
- Degree of curve from radius measurements
- Multiple radius points (R1-R6) for different panel layers
- Chord lengths for each radius
- Arc lengths and cut lengths
- Comparison between measured values and rounded degree specifications

## Running the Application

Since this is a static web application with no build process:

1. **Open directly in browser**: Open [index.html](index.html) in a web browser
2. **Use a local server** (recommended for development):
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000

   # Node.js (if http-server is installed)
   npx http-server -p 8000
   ```
   Then navigate to `http://localhost:8000`

## Architecture

### File Structure

- **[index.html](index.html)**: Main curve calculator page with dual-column layout (Measured vs Compare)
- **[radius2degree.html](radius2degree.html)**: Alternative calculator page with three-column layout (Rounded Down, Measured, Rounded Up)
- **[radius2degree.js](radius2degree.js)**: Core calculation engine (shared by both HTML pages)
- **[curveCalculator.css](curveCalculator.css)**: Styling using Flexoki color scheme with light/dark mode support

### Key Concepts

**Panel Configuration**:
- Panel types (e.g., "1301", "1310") with predefined dimensions stored in `panelDefaults` object
- Gage types: "standard" (50.50") or "pedestrian" (51.50")
- Rail sizes (#90, #100, #115, #119, #132, #133, #136, #140, #141) with corresponding head widths

**Radius Calculations**:
The application calculates 6 concentric radii (R1-R6) based on:
- Center radius (user input)
- Gage width (distance between rails)
- Rubber widths (field and gage)
- Rail head width
- Field width

Offset calculations:
- `offset1` = gageWidth / 2
- `offset2` = gageWidth / 2 + gageRubberWidth + railHeadWidth + fieldRubberWidth
- `offset3` = offset2 + fieldWidth

R6 (outermost) to R1 (innermost) are calculated as center ± offsets.

**Core Functions** (in [radius2degree.js](radius2degree.js)):
- `calculateAndUpdateFromCenterRadius()`: Central calculation function that updates all derived values from a center radius
- `degreeToRadius()` / `radiusToDegree()`: Conversion between degree of curve and radius
- `feetToArchitectural()`: Formats decimal feet as architectural strings (e.g., "5'-7 1/2\"")
- `inchesToFractional()`: Converts decimal inches to fractional representation
- `validateSpec()`: Compares measured vs compare values and highlights differences

**State Management**:
- Two parallel data structures: `measuredValues`/`measuredElements` and `compareValues`/`compareElements`
- Values objects store calculated data, elements objects store DOM references
- User inputs trigger recalculation via event listeners

### Important Implementation Details

1. **Units**: All internal calculations are in feet. Display formatting converts to architectural notation (feet-inches-fractions).

2. **Precision**: Chord length validation uses ±1/8" tolerance ([radius2degree.js:774](radius2degree.js#L774))

3. **Dynamic Updates**: When panel type or rail size changes, the label shows "(modified)" if user has customized default values

4. **Dual Input Modes**: User can enter any of high/center/low radius, or degree of curve - all other values calculate automatically

5. **Theme Support**: Color scheme persisted to localStorage, uses CSS `light-dark()` function with Flexoki colors

## Development Guidelines

### Making Changes to Calculations

When modifying calculation logic:
1. Update the core calculation in `calculateAndUpdateFromCenterRadius()`
2. Both measured and compare columns use the same calculation function with different value/element objects
3. Always maintain precision to at least 3 decimal places for intermediate calculations
4. Test with known panel configurations (defaults in `panelDefaults` object)

### Adding New Panel Types

Add entries to the `panelDefaults` object in [radius2degree.js](radius2degree.js#L295-323) with required fields:
- `gageType`: "standard" or "pedestrian"
- `panelLength`: in feet
- `gageWidth`: in feet
- `fieldWidth`: in feet
- `railSize`: string matching rail head widths keys
- `fieldRubberWidth`, `railHeadWidth`, `gageRubberWidth`: in feet

### Adding New Rail Sizes

Add entries to the `railHeadWidths` object in [radius2degree.js](radius2degree.js#L212-222) with rail number as key and width in feet as value.

### Styling Changes

The app uses the Flexoki color scheme via CSS custom properties. Color mode is controlled by the `color-scheme` CSS property and localStorage persistence. Modify [curveCalculator.css](curveCalculator.css) for theme adjustments.

## Dependencies

External dependencies loaded via CDN:
- Bootstrap 5.3.6 (UI components)
- jQuery 3.7.1 (DOM manipulation)
- Modern Normalize (CSS reset)
- Google Fonts: Fira Code and Fira Mono

No build tools or package managers are used.
