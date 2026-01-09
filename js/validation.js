/**
 * validation.js - Input Validation
 *
 * Provides robust input validation with user-friendly error messages.
 * Validates numeric inputs, ranges, and data types.
 *
 * @module validation
 */

import {
    MIN_RADIUS_FEET,
    MAX_RADIUS_FEET,
    MIN_DEGREE,
    MAX_DEGREE,
    MIN_PANEL_LENGTH_FEET,
    MAX_PANEL_LENGTH_FEET,
    MIN_GAGE_WIDTH_FEET,
    MAX_GAGE_WIDTH_FEET
} from './constants.js';

/**
 * Validation result type
 *
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether the input is valid
 * @property {string|null} error - User-friendly error message if invalid
 * @property {number|null} value - Sanitized value if valid
 */

/**
 * Validates numeric input with range checking
 *
 * @param {*} value - The value to validate
 * @param {string} fieldName - Name of the field (for error messages)
 * @param {Object} options - Validation options
 * @param {number} [options.min=0] - Minimum allowed value
 * @param {number} [options.max=Infinity] - Maximum allowed value
 * @param {boolean} [options.required=true] - Whether the field is required
 * @returns {ValidationResult} Validation result object
 *
 * @example
 * const result = validateNumericInput(radius, 'Center Radius', {min: 10, max: 10000});
 * if (!result.isValid) {
 *     console.error(result.error);
 * }
 */
export function validateNumericInput(value, fieldName, options = {}) {
    const { min = 0, max = Infinity, required = true } = options;

    // Empty check
    if (value === null || value === undefined || value === '') {
        return {
            isValid: !required,
            error: required ? `${fieldName} is required` : null,
            value: null
        };
    }

    // Type check
    const numValue = Number(value);
    if (isNaN(numValue)) {
        return {
            isValid: false,
            error: `${fieldName} must be a valid number (got: "${value}")`,
            value: null
        };
    }

    // Finite check
    if (!isFinite(numValue)) {
        return {
            isValid: false,
            error: `${fieldName} must be a finite number`,
            value: null
        };
    }

    // Range checks
    if (numValue < min) {
        return {
            isValid: false,
            error: `${fieldName} must be at least ${min} (got: ${numValue})`,
            value: null
        };
    }

    if (numValue > max) {
        return {
            isValid: false,
            error: `${fieldName} must be no more than ${max} (got: ${numValue})`,
            value: null
        };
    }

    return {
        isValid: true,
        error: null,
        value: numValue
    };
}

/**
 * Validates a radius value
 *
 * @param {*} value - The radius value to validate
 * @param {string} [radiusType='radius'] - Type of radius (for error messages)
 * @returns {ValidationResult} Validation result
 */
export function validateRadius(value, radiusType = 'radius') {
    return validateNumericInput(value, `${radiusType}`, {
        min: MIN_RADIUS_FEET,
        max: MAX_RADIUS_FEET,
        required: true
    });
}

/**
 * Validates a degree of curve value
 *
 * @param {*} value - The degree value to validate
 * @returns {ValidationResult} Validation result
 */
export function validateDegree(value) {
    return validateNumericInput(value, 'Degree of Curve', {
        min: MIN_DEGREE,
        max: MAX_DEGREE,
        required: true
    });
}

/**
 * Validates a panel length value
 *
 * @param {*} value - The panel length to validate
 * @returns {ValidationResult} Validation result
 */
export function validatePanelLength(value) {
    return validateNumericInput(value, 'Panel Length', {
        min: MIN_PANEL_LENGTH_FEET,
        max: MAX_PANEL_LENGTH_FEET,
        required: true
    });
}

/**
 * Validates a gage width value
 *
 * @param {*} value - The gage width to validate
 * @returns {ValidationResult} Validation result
 */
export function validateGageWidth(value) {
    return validateNumericInput(value, 'Gage Width', {
        min: MIN_GAGE_WIDTH_FEET,
        max: MAX_GAGE_WIDTH_FEET,
        required: true
    });
}

/**
 * Validates a width value (generic, for field/rubber widths)
 *
 * @param {*} value - The width value to validate
 * @param {string} widthName - Name of the width field
 * @returns {ValidationResult} Validation result
 */
export function validateWidth(value, widthName) {
    return validateNumericInput(value, widthName, {
        min: 0,
        max: 10,
        required: false
    });
}

/**
 * Validates panel configuration object
 *
 * @param {Object} config - The panel configuration to validate
 * @returns {Object} Validation result with errors array and sanitized config
 * @returns {boolean} result.isValid - Whether all fields are valid
 * @returns {Array<string>} result.errors - Array of error messages
 * @returns {Object|null} result.sanitizedConfig - Sanitized config if valid
 */
export function validatePanelConfig(config) {
    const errors = [];

    // Validate panel length
    const panelLength = validatePanelLength(config.panelLength);
    if (!panelLength.isValid) errors.push(panelLength.error);

    // Validate gage width
    const gageWidth = validateGageWidth(config.gageWidth);
    if (!gageWidth.isValid) errors.push(gageWidth.error);

    // Validate field width
    const fieldWidth = validateWidth(config.fieldWidth, 'Field Width');
    if (!fieldWidth.isValid) errors.push(fieldWidth.error);

    // Validate rubber widths
    const fieldRubberWidth = validateWidth(config.fieldRubberWidth, 'Field Rubber Width');
    if (!fieldRubberWidth.isValid) errors.push(fieldRubberWidth.error);

    const gageRubberWidth = validateWidth(config.gageRubberWidth, 'Gage Rubber Width');
    if (!gageRubberWidth.isValid) errors.push(gageRubberWidth.error);

    const railHeadWidth = validateWidth(config.railHeadWidth, 'Rail Head Width');
    if (!railHeadWidth.isValid) errors.push(railHeadWidth.error);

    return {
        isValid: errors.length === 0,
        errors,
        sanitizedConfig: errors.length === 0 ? {
            panelLength: panelLength.value,
            gageWidth: gageWidth.value,
            fieldWidth: fieldWidth.value,
            fieldRubberWidth: fieldRubberWidth.value,
            gageRubberWidth: gageRubberWidth.value,
            railHeadWidth: railHeadWidth.value
        } : null
    };
}

/**
 * Displays validation error in console
 *
 * @param {string} error - The error message to display
 */
export function displayValidationError(error) {
    console.error('⚠️ Validation Error:', error);
}

/**
 * Displays multiple validation errors in console
 *
 * @param {Array<string>} errors - Array of error messages
 */
export function displayValidationErrors(errors) {
    console.error('⚠️ Validation Errors:');
    errors.forEach(error => console.error('  -', error));
}
