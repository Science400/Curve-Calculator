/**
 * calculations.js - Railroad Curve Calculations
 *
 * Pure mathematical functions for railroad curve geometry.
 * Converts between degree of curve and radius, calculates chord/arc lengths.
 *
 * @module calculations
 */

import {
    INCHES_PER_FOOT,
    RAILROAD_CURVE_CHORD_SQUARED,
    RAILROAD_CURVE_DIVISOR,
    RAILROAD_CURVE_CONSTANT,
    CUT_LENGTH_OFFSET_FEET,
    RADIUS_LAYERS
} from './constants.js';

/**
 * Converts degree of curve to center radius
 *
 * Uses the chord definition formula for railroad curves.
 * Formula: radius = (degree / 12 / 2) + ((62² / (8 * degree / 12))
 *
 * @param {number} degree - Degree of curve
 * @returns {number} Center radius in feet
 * @throws {Error} If degree is invalid (NaN, non-finite, or zero)
 *
 * @example
 * const radius = degreeToRadius(16);
 * console.log(radius); // 358.312...
 */
export function degreeToRadius(degree) {
    if (typeof degree !== 'number' || isNaN(degree) || !isFinite(degree)) {
        throw new Error(`Invalid degree: must be a finite number (got: ${degree})`);
    }

    if (degree === 0) {
        throw new Error('Invalid degree: cannot be zero (division by zero)');
    }

    const degreeInFeet = degree / INCHES_PER_FOOT;
    const radius = (degreeInFeet / 2) + (RAILROAD_CURVE_CHORD_SQUARED / (RAILROAD_CURVE_DIVISOR * degreeInFeet));

    return radius;
}

/**
 * Converts center radius to degree of curve
 *
 * Uses the chord definition formula for railroad curves.
 * Formula: degree = 12 * (radius - √(radius² - 961))
 *
 * @param {number} radius - Center radius in feet
 * @returns {number} Degree of curve
 * @throws {Error} If radius is invalid or too small (< √961 ≈ 31 feet)
 *
 * @example
 * const degree = radiusToDegree(358.312);
 * console.log(degree); // 16.0
 */
export function radiusToDegree(radius) {
    if (typeof radius !== 'number' || isNaN(radius) || !isFinite(radius)) {
        throw new Error(`Invalid radius: must be a finite number (got: ${radius})`);
    }

    const discriminant = radius * radius - RAILROAD_CURVE_CONSTANT;

    if (discriminant < 0) {
        const minRadius = Math.sqrt(RAILROAD_CURVE_CONSTANT);
        throw new Error(`Invalid radius: too small (must be >= ${minRadius.toFixed(1)} feet, got: ${radius})`);
    }

    const degree = INCHES_PER_FOOT * (radius - Math.sqrt(discriminant));

    return degree;
}

/**
 * Calculates chord length for a given radius and panel length
 *
 * Uses the geometric relationship: chord = 2 * radius * sin(θ)
 * where θ = arcsin(panelLength / (2 * centerRadius))
 *
 * @param {number} radius - Radius in feet
 * @param {number} theta - Angle in radians
 * @returns {number} Chord length in feet
 * @throws {Error} If inputs are invalid
 *
 * @example
 * const chord = calculateChordLength(358.312, 0.0113);
 * console.log(chord); // 8.125
 */
export function calculateChordLength(radius, theta) {
    if (typeof radius !== 'number' || isNaN(radius) || !isFinite(radius)) {
        throw new Error(`Invalid radius: must be a finite number (got: ${radius})`);
    }

    if (typeof theta !== 'number' || isNaN(theta) || !isFinite(theta)) {
        throw new Error(`Invalid theta: must be a finite number (got: ${theta})`);
    }

    return 2 * radius * Math.sin(theta);
}

/**
 * Calculates arc length for a given radius and angle
 *
 * Uses the formula: arcLength = 2 * radius * θ
 *
 * @param {number} radius - Radius in feet
 * @param {number} theta - Angle in radians
 * @returns {number} Arc length in feet
 * @throws {Error} If inputs are invalid
 *
 * @example
 * const arcLength = calculateArcLength(358.312, 0.0113);
 * console.log(arcLength); // 8.104
 */
export function calculateArcLength(radius, theta) {
    if (typeof radius !== 'number' || isNaN(radius) || !isFinite(radius)) {
        throw new Error(`Invalid radius: must be a finite number (got: ${radius})`);
    }

    if (typeof theta !== 'number' || isNaN(theta) || !isFinite(theta)) {
        throw new Error(`Invalid theta: must be a finite number (got: ${theta})`);
    }

    return 2 * radius * theta;
}

/**
 * Calculates cut length from arc length
 *
 * Cut length is arc length minus the standard 1" offset
 *
 * @param {number} arcLength - Arc length in feet
 * @returns {number} Cut length in feet (arcLength - 1")
 * @throws {Error} If arc length is invalid
 *
 * @example
 * const cutLength = calculateCutLength(8.104);
 * console.log(cutLength); // 8.021 (8.104 - 1/12)
 */
export function calculateCutLength(arcLength) {
    if (typeof arcLength !== 'number' || isNaN(arcLength) || !isFinite(arcLength)) {
        throw new Error(`Invalid arc length: must be a finite number (got: ${arcLength})`);
    }

    return arcLength - CUT_LENGTH_OFFSET_FEET;
}

/**
 * Calculates rise (height of arc) for a panel
 *
 * Uses the formula: rise = centerRadius - √(centerRadius² - (panelLength/2)²)
 * Returns rise in inches
 *
 * @param {number} centerRadius - Center radius in feet
 * @param {number} panelLength - Panel length in feet
 * @returns {number} Rise in inches
 * @throws {Error} If inputs are invalid or panel too long for radius
 *
 * @example
 * const rise = calculateRise(358.312, 8.125);
 * console.log(rise); // 0.277 inches
 */
export function calculateRise(centerRadius, panelLength) {
    if (typeof centerRadius !== 'number' || isNaN(centerRadius) || !isFinite(centerRadius)) {
        throw new Error(`Invalid center radius: must be a finite number (got: ${centerRadius})`);
    }

    if (typeof panelLength !== 'number' || isNaN(panelLength) || !isFinite(panelLength)) {
        throw new Error(`Invalid panel length: must be a finite number (got: ${panelLength})`);
    }

    const halfPanel = panelLength / 2;
    const discriminant = centerRadius * centerRadius - halfPanel * halfPanel;

    if (discriminant < 0) {
        throw new Error(`Invalid geometry: panel too long for radius (panelLength: ${panelLength}, radius: ${centerRadius})`);
    }

    const riseInFeet = centerRadius - Math.sqrt(discriminant);
    return riseInFeet * INCHES_PER_FOOT;
}

/**
 * Calculates theta (angle in radians) for a given panel length and center radius
 *
 * Uses the formula: θ = arcsin(panelLength / (2 * centerRadius))
 *
 * @param {number} panelLength - Panel length in feet
 * @param {number} centerRadius - Center radius in feet
 * @returns {number} Theta in radians
 * @throws {Error} If inputs are invalid or panel too long for radius
 *
 * @example
 * const theta = calculateTheta(8.125, 358.312);
 * console.log(theta); // 0.0113 radians
 */
export function calculateTheta(panelLength, centerRadius) {
    if (typeof panelLength !== 'number' || isNaN(panelLength) || !isFinite(panelLength)) {
        throw new Error(`Invalid panel length: must be a finite number (got: ${panelLength})`);
    }

    if (typeof centerRadius !== 'number' || isNaN(centerRadius) || !isFinite(centerRadius)) {
        throw new Error(`Invalid center radius: must be a finite number (got: ${centerRadius})`);
    }

    const sinValue = panelLength / (2 * centerRadius);

    if (Math.abs(sinValue) > 1) {
        throw new Error(`Invalid geometry: panel too long for radius (sin value: ${sinValue})`);
    }

    return Math.asin(sinValue);
}

/**
 * Calculates all six radii (R1-R6) from center radius and offsets
 *
 * @param {number} centerRadius - Center radius in feet
 * @param {number} offset1 - Inner offset (gageWidth / 2)
 * @param {number} offset2 - Middle offset (offset1 + rubber + rail head)
 * @param {number} offset3 - Outer offset (offset2 + field width)
 * @returns {Object} Object containing all six radii {r1, r2, r3, r4, r5, r6}
 * @throws {Error} If inputs are invalid
 *
 * @example
 * const radii = calculateAllRadii(358.312, 2.104, 2.354, 4.604);
 * console.log(radii.r1); // 356.208 (centerRadius - offset1)
 * console.log(radii.r6); // 362.916 (centerRadius + offset3)
 */
export function calculateAllRadii(centerRadius, offset1, offset2, offset3) {
    // Validate inputs
    const inputs = { centerRadius, offset1, offset2, offset3 };
    for (const [name, value] of Object.entries(inputs)) {
        if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
            throw new Error(`Invalid ${name}: must be a finite number (got: ${value})`);
        }
    }

    return {
        r1: centerRadius - offset1,       // Innermost (gage side - half gage width)
        r2: centerRadius - offset2,       // Inner field side
        r3: centerRadius - offset3,       // Outermost field side (low side)
        r4: centerRadius + offset1,       // Outer gage side (high side)
        r5: centerRadius + offset2,       // Outer field side
        r6: centerRadius + offset3        // Outermost (field side + full width)
    };
}

/**
 * Calculates complete curve data for all six radii
 *
 * For each radius layer, calculates:
 * - Radius value
 * - Chord length
 * - Arc length
 * - Cut length
 *
 * @param {Object} radii - Object with r1-r6 radius values
 * @param {number} theta - Angle in radians
 * @returns {Object} Complete curve data for all layers
 * @throws {Error} If inputs are invalid
 *
 * @example
 * const radii = calculateAllRadii(358.312, 2.104, 2.354, 4.604);
 * const theta = calculateTheta(8.125, 358.312);
 * const curveData = calculateAllCurveData(radii, theta);
 * console.log(curveData.r1.chord); // 8.077
 * console.log(curveData.r1.arcLength); // 8.058
 * console.log(curveData.r1.cutLength); // 7.975 (arcLength - 1")
 */
export function calculateAllCurveData(radii, theta) {
    if (typeof theta !== 'number' || isNaN(theta) || !isFinite(theta)) {
        throw new Error(`Invalid theta: must be a finite number (got: ${theta})`);
    }

    const result = {};

    RADIUS_LAYERS.forEach(layer => {
        const radius = radii[layer];

        if (typeof radius !== 'number' || isNaN(radius) || !isFinite(radius)) {
            throw new Error(`Invalid radius for ${layer}: must be a finite number (got: ${radius})`);
        }

        const chord = calculateChordLength(radius, theta);
        const arcLength = calculateArcLength(radius, theta);
        const cutLength = calculateCutLength(arcLength);

        result[layer] = {
            radius,
            chord,
            arcLength,
            cutLength
        };
    });

    return result;
}
