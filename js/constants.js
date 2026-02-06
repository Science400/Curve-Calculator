/**
 * constants.js - Application Constants
 *
 * Centralized location for all magic numbers and configuration constants.
 * Eliminates hardcoded values throughout the codebase for better maintainability.
 *
 * @module constants
 */

// ===== Unit Conversions =====

/**
 * Number of inches in one foot
 * @constant {number}
 */
export const INCHES_PER_FOOT = 12;

/**
 * Number of feet in one inch
 * @constant {number}
 */
export const FEET_PER_INCH = 1 / 12;

// ===== Gage Width Standards =====

/**
 * Standard gage width in inches (North American railroad standard)
 * @constant {number}
 */
export const STANDARD_GAGE_WIDTH_INCHES = 50.50;

/**
 * Pedestrian gage width in inches (wider for pedestrian use)
 * @constant {number}
 */
export const PEDESTRIAN_GAGE_WIDTH_INCHES = 51.50;

/**
 * Standard gage width converted to feet
 * @constant {number}
 */
export const STANDARD_GAGE_WIDTH_FEET = STANDARD_GAGE_WIDTH_INCHES / INCHES_PER_FOOT;

/**
 * Pedestrian gage width converted to feet
 * @constant {number}
 */
export const PEDESTRIAN_GAGE_WIDTH_FEET = PEDESTRIAN_GAGE_WIDTH_INCHES / INCHES_PER_FOOT;

/**
 * Standard gage rubber width in feet (3 inches)
 * @constant {number}
 */
export const STANDARD_GAGE_RUBBER_WIDTH_FEET = 3 / INCHES_PER_FOOT;

/**
 * Pedestrian gage rubber width in feet (2.5 inches)
 * @constant {number}
 */
export const PEDESTRIAN_GAGE_RUBBER_WIDTH_FEET = 2.5 / INCHES_PER_FOOT;

// ===== Railroad Curve Constants =====

/**
 * Standard railroad chord length in feet (100-foot chord standard)
 * Used in degree of curve calculations
 * @constant {number}
 */
export const RAILROAD_CURVE_CHORD_LENGTH_FEET = 62;

/**
 * Square of the railroad chord length (62² = 3844)
 * Pre-calculated for performance in degree/radius conversions
 * @constant {number}
 */
export const RAILROAD_CURVE_CHORD_SQUARED = RAILROAD_CURVE_CHORD_LENGTH_FEET ** 2;

/**
 * Divisor used in railroad curve calculations
 * @constant {number}
 */
export const RAILROAD_CURVE_DIVISOR = 8;

/**
 * Alternative constant: 961 = (62² / 4) used in some radius formulas
 * @constant {number}
 */
export const RAILROAD_CURVE_CONSTANT = 961;

// ===== Tolerances and Precision =====

/**
 * Chord length tolerance in inches (±1/8 inch acceptable variance)
 * @constant {number}
 */
export const CHORD_TOLERANCE_INCHES = 1/8;

/**
 * Chord length tolerance converted to feet
 * @constant {number}
 */
export const CHORD_TOLERANCE_FEET = CHORD_TOLERANCE_INCHES / INCHES_PER_FOOT;

/**
 * Floating point comparison epsilon for equality checks
 * @constant {number}
 */
export const FLOAT_COMPARISON_EPSILON = 0.0001;

/**
 * Number of decimal places for display precision
 * @constant {number}
 */
export const DECIMAL_PRECISION_DISPLAY = 3;

// ===== Cut Length Offset =====

/**
 * Cut length offset in inches (1 inch removed from arc length)
 * @constant {number}
 */
export const CUT_LENGTH_OFFSET_INCHES = 1;

/**
 * Cut length offset converted to feet
 * @constant {number}
 */
export const CUT_LENGTH_OFFSET_FEET = CUT_LENGTH_OFFSET_INCHES / INCHES_PER_FOOT;

// ===== Fraction Denominators =====

/**
 * Denominator for architectural fraction display (1/16 inch precision)
 * Used in feetToArchitectural() formatting
 * @constant {number}
 */
export const ARCHITECTURAL_FRACTION_DENOMINATOR = 16;

/**
 * Denominator for rise measurement fractions (1/32 inch precision)
 * Used for more precise rise calculations
 * @constant {number}
 */
export const RISE_FRACTION_DENOMINATOR = 32;

// ===== Gage Type Identifiers =====

/**
 * Identifier for standard gage type
 * @constant {string}
 */
export const GAGE_TYPE_STANDARD = 'standard';

/**
 * Identifier for pedestrian gage type
 * @constant {string}
 */
export const GAGE_TYPE_PEDESTRIAN = 'pedestrian';

// ===== Radius Layer Names =====

/**
 * Array of radius layer identifiers (innermost to outermost)
 * @constant {Array<string>}
 */
export const RADIUS_LAYERS = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'];

// ===== localStorage Keys =====

/**
 * localStorage key for color scheme preference
 * @constant {string}
 */
export const STORAGE_KEY_COLOR_SCHEME = 'color-scheme';

/**
 * localStorage key for compare column visibility state
 * @constant {string}
 */
export const STORAGE_KEY_COMPARE_COLUMN = 'compare-column-visible';

/**
 * Default color scheme ('light dark' = system preference)
 * @constant {string}
 */
export const DEFAULT_COLOR_SCHEME = 'light dark';

// ===== Validation Ranges =====

/**
 * Minimum valid radius value in feet
 * @constant {number}
 */
export const MIN_RADIUS_FEET = 10;

/**
 * Maximum valid radius value in feet
 * @constant {number}
 */
export const MAX_RADIUS_FEET = 10000;

/**
 * Minimum valid degree of curve
 * @constant {number}
 */
export const MIN_DEGREE = 0.1;

/**
 * Maximum valid degree of curve
 * @constant {number}
 */
export const MAX_DEGREE = 90;

/**
 * Minimum valid panel length in feet
 * @constant {number}
 */
export const MIN_PANEL_LENGTH_FEET = 0.1;

/**
 * Maximum valid panel length in feet
 * @constant {number}
 */
export const MAX_PANEL_LENGTH_FEET = 50;

/**
 * Minimum valid gage width in feet
 * @constant {number}
 */
export const MIN_GAGE_WIDTH_FEET = 3;

/**
 * Maximum valid gage width in feet
 * @constant {number}
 */
export const MAX_GAGE_WIDTH_FEET = 6;

// ===== Debug Configuration =====

/**
 * Enable debug mode to log calculated values in decimal feet to console
 * Set to false for production
 * @constant {boolean}
 */
export const DEBUG_MODE = true;
