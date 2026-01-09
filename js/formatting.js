/**
 * formatting.js - Display Formatting Functions
 *
 * Converts decimal feet to architectural notation and handles fractional representations.
 * All formatting follows standard architectural conventions.
 *
 * @module formatting
 */

import {
    INCHES_PER_FOOT,
    ARCHITECTURAL_FRACTION_DENOMINATOR
} from './constants.js';

/**
 * Converts a decimal feet value to architectural string format
 *
 * Format: X'-Y Z/W" where:
 * - X = whole feet
 * - Y = whole inches
 * - Z/W = fractional inches (reduced to lowest terms)
 *
 * Rounds to nearest 1/16 inch and automatically reduces fractions.
 *
 * @param {number} feet - The length in decimal feet
 * @returns {string} The formatted architectural string (e.g., "5'-7 1/2"")
 * @throws {Error} If feet is not a valid number
 *
 * @example
 * feetToArchitectural(5.625);  // "5'-7 1/2""
 * feetToArchitectural(8.125);  // "8'-1 1/2""
 * feetToArchitectural(10.0);   // "10'-0""
 */
export function feetToArchitectural(feet) {
    if (typeof feet !== 'number' || isNaN(feet) || !isFinite(feet)) {
        throw new Error(`Invalid feet value: must be a finite number (got: ${feet})`);
    }

    // Separate whole feet and decimal portion
    const wholeFeet = Math.floor(feet);
    const remainingInches = (feet - wholeFeet) * INCHES_PER_FOOT;
    const wholeInches = Math.floor(remainingInches);

    // Calculate fractional part
    const fractionalInches = remainingInches - wholeInches;
    let numerator = Math.round(fractionalInches * ARCHITECTURAL_FRACTION_DENOMINATOR);
    let denominator = ARCHITECTURAL_FRACTION_DENOMINATOR;

    // Reduce fraction to lowest terms
    while (numerator % 2 === 0 && numerator > 0 && denominator > 1) {
        numerator /= 2;
        denominator /= 2;
    }

    // Format output
    if (numerator === 0) {
        return `${wholeFeet}'-${wholeInches}"`;
    } else {
        return `${wholeFeet}'-${wholeInches} ${numerator}/${denominator}"`;
    }
}

/**
 * Converts decimal inches to fractional representation
 *
 * Format: X Y/Z" where:
 * - X = whole inches (omitted if zero)
 * - Y/Z = fractional inches with custom denominator
 *
 * @param {number} inches - The length in decimal inches
 * @param {number} denominator - The fractional denominator (e.g., 32 for 1/32")
 * @returns {string} The formatted fractional string (e.g., "5 3/16"")
 * @throws {Error} If inputs are invalid
 *
 * @example
 * inchesToFractional(0.277, 32);  // "9/32""
 * inchesToFractional(5.5, 16);    // "5 8/16""
 * inchesToFractional(0, 32);      // "0"
 */
export function inchesToFractional(inches, denominator) {
    if (typeof inches !== 'number' || isNaN(inches)) {
        throw new Error(`Invalid inches value: must be a number (got: ${inches})`);
    }

    if (typeof denominator !== 'number' || !Number.isInteger(denominator) || denominator <= 0) {
        throw new Error(`Invalid denominator: must be a positive integer (got: ${denominator})`);
    }

    // Handle negative or zero values
    if (inches < 0) {
        return "0";
    }

    if (inches === 0) {
        return "0";
    }

    // Separate whole inches and fractional part
    const wholeInches = Math.floor(inches);
    const fractionalPart = inches - wholeInches;
    const numerator = Math.round(fractionalPart * denominator);

    // Format based on whole and fractional parts
    if (numerator === 0 && wholeInches === 0) {
        return "0";
    } else if (numerator === 0) {
        return `${wholeInches}"`;
    } else if (wholeInches === 0) {
        return `${numerator}/${denominator}"`;
    } else {
        return `${wholeInches} ${numerator}/${denominator}"`;
    }
}

/**
 * Reduces a fraction to its lowest terms
 *
 * Uses the Euclidean algorithm to find the GCD, then divides both
 * numerator and denominator by it.
 *
 * @param {number} numerator - The fraction numerator
 * @param {number} denominator - The fraction denominator
 * @returns {Object} Object with reduced numerator and denominator
 * @throws {Error} If inputs are invalid
 *
 * @example
 * reduceFraction(8, 16);   // {numerator: 1, denominator: 2}
 * reduceFraction(12, 32);  // {numerator: 3, denominator: 8}
 */
export function reduceFraction(numerator, denominator) {
    if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) {
        throw new Error('Numerator and denominator must be integers');
    }

    if (denominator === 0) {
        throw new Error('Denominator cannot be zero');
    }

    if (numerator === 0) {
        return { numerator: 0, denominator: 1 };
    }

    // Find GCD using Euclidean algorithm
    const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);
    const divisor = gcd(numerator, denominator);

    return {
        numerator: numerator / divisor,
        denominator: denominator / divisor
    };
}

/**
 * Formats a decimal number to a fixed number of decimal places
 *
 * @param {number} value - The number to format
 * @param {number} [precision=3] - Number of decimal places
 * @returns {string} Formatted number string
 * @throws {Error} If inputs are invalid
 *
 * @example
 * formatDecimal(3.14159);      // "3.142"
 * formatDecimal(3.14159, 2);   // "3.14"
 */
export function formatDecimal(value, precision = 3) {
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
        throw new Error(`Invalid value: must be a finite number (got: ${value})`);
    }

    if (!Number.isInteger(precision) || precision < 0) {
        throw new Error(`Invalid precision: must be a non-negative integer (got: ${precision})`);
    }

    return value.toFixed(precision);
}
