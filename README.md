# Curve Calculator

A web-based railroad panel curve calculator for Magnum Manufacturing that calculates radius, chord, arc length, and cut length values for curved railroad panels.

## Overview

This application helps calculate precise measurements for curved railroad panels by converting between degree of curve and radius measurements, and computing all necessary dimensions for six concentric panel layers (R1-R6).

## Features

- **Multiple Input Methods**: Enter measurements via high/center/low radius or degree of curve
- **Dual Column Display**: Compare measured values against rounded degree specifications
- **Panel Type Presets**: Quick configuration with predefined panel defaults (1301, 1310, etc.)
- **Auto/Manual Settings**: Toggle between automatic panel defaults and manual configuration
- **Real-time Validation**: Visual indicators showing whether measurements meet ±1/8" tolerance
- **Theme Support**: Light, dark, and system theme options
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or build process required

### Running the Application

Since this is a static web application, you can run it in several ways:

#### Option 1: Direct File Opening
Simply open `index.html` in your web browser.

#### Option 2: Local Development Server (Recommended)

**Using Python 3:**
```bash
python -m http.server 8000
```

**Using Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
npx http-server -p 8000
```

Then navigate to `http://localhost:8000` in your browser.

## Usage

### Basic Workflow

1. **Select Panel Type**: Choose your panel configuration (e.g., 1301, 1310)
2. **Enter Measurement**: Input one of the following:
   - Degree of curve
   - Center radius
   - High radius (gage side + gage rubber + half gage width)
   - Low radius (gage side - gage rubber - half gage width)
3. **View Results**: The calculator displays:
   - All six radii (R1-R6)
   - Chord lengths for each radius
   - Arc lengths
   - Cut lengths (arc length minus 1")
   - Rise measurement

### Compare Column

Toggle the "Show Compare Column" switch to compare your measured values against the nearest whole degree specification:

- **✓ (Green)**: Measured chord is within ±1/8" of spec
- **✗ (Red)**: Measured chord is outside tolerance

### Advanced Settings

Click "Show Advanced Settings" to manually adjust:

**Panel Size:**
- Gage Type (Standard: 50.50" / Pedestrian: 51.50")
- Panel Length
- Gage Width
- Field Width

**Panel Spacing:**
- Rail Size (#90, #115, #119, #132, #133, #136, #140, #141)
- Field Rubber Width
- Rail Head Width
- Gage Rubber Width

When you manually adjust any setting, it switches to "Manual" mode. Click the ↻ button to reset to panel defaults.

## File Structure

```
Curve Calculator/
├── index.html              # Main application page
├── radius2degree.html      # Alternative three-column layout
├── radius2degree.js        # Core calculation engine
├── curveCalculator.css     # Flexoki theme styling
├── 16deg1301.svg          # Panel diagram
├── Magnum Logo.png        # Company logo
├── favicon.png            # Site icon
├── CLAUDE.md              # Development instructions
└── README.md              # This file
```

## Technical Details

### Calculations

The application uses these core formulas:

**Degree to Radius:**
```javascript
radius = (degree / 12 / 2) + ((62 * 62) / (8 * degree / 12))
```

**Radius to Degree:**
```javascript
degree = 12 * (radius - √(radius² - 961))
```

**Chord Length:**
```javascript
chord = 2 * radius * sin(θ)
where θ = arcsin(panelLength / (2 * centerRadius))
```

**Arc Length:**
```javascript
arcLength = 2 * radius * θ
```

**Radius Offsets:**
- offset1 = gageWidth / 2
- offset2 = gageWidth / 2 + gageRubberWidth + railHeadWidth + fieldRubberWidth
- offset3 = offset2 + fieldWidth

### Data Structures

The application maintains parallel data structures for measured and compare values:

```javascript
{
  degree: number,
  rise: number,
  centerRadius: number,
  highRadius: number,
  lowRadius: number,
  r1-r6: {
    radius: number,
    chord: number,
    arcLength: number,
    cutLength: number
  }
}
```

### Panel Defaults

Pre-configured panel types include:

- **1301**: Standard gage, 8.125' length, #133 rail
- **1310**: Pedestrian gage, 10' length, #115 rail

Add new panel types by editing the `panelDefaults` object in `radius2degree.js`.

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

External libraries loaded via CDN:

- Bootstrap 5.3.6 (UI components)
- jQuery 3.7.1 (DOM manipulation)
- Modern Normalize (CSS reset)
- Google Fonts (Fira Code, Fira Mono)

## Development

### Code Organization

The codebase follows these principles:

- **Single Responsibility**: Each function handles one specific task
- **DRY (Don't Repeat Yourself)**: Helper functions consolidate repeated logic
- **JSDoc Comments**: All functions are documented with parameter and return types
- **Semantic Naming**: Variable and function names clearly describe their purpose

### Key Functions

- `calculateAndUpdateFromCenterRadius()`: Main calculation engine
- `degreeToRadius()` / `radiusToDegree()`: Unit conversions
- `feetToArchitectural()`: Format decimal feet as architectural strings
- `validateSpec()`: Compare measured vs spec with tolerance checking
- `setPanelTypeDefaults()`: Apply panel configuration presets

### Making Changes

1. Read the code comments and JSDoc documentation
2. Test changes with known panel configurations
3. Verify calculations maintain 3+ decimal place precision
4. Ensure both measured and compare columns update correctly

## Contributing

For bug reports or feature requests, contact the Magnum Manufacturing engineering team.

## License

© 2024-2026 Magnum Manufacturing. All Rights Reserved.

## Changelog

### Version 2.0 (2026-01-08)
- Refactored codebase for improved maintainability
- Added comprehensive JSDoc documentation
- Consolidated duplicate code into helper functions
- Removed unused functions
- Improved code organization and readability

### Version 1.0
- Initial release
- Dual-column measured vs compare layout
- Panel type presets
- Auto/manual configuration modes
