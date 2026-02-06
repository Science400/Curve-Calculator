/**
 * dom.js - DOM Manipulation Functions
 *
 * Handles all DOM updates, element visibility, and UI state changes.
 * Provides safe DOM manipulation with error handling.
 *
 * @module dom
 */

import { RADIUS_LAYERS, CHORD_TOLERANCE_FEET, DECIMAL_PRECISION_DISPLAY, DEBUG_MODE } from './constants.js';
import { feetToArchitectural, inchesToFractional } from './formatting.js';

/**
 * Updates DOM elements from a values object
 *
 * Updates all display elements (degree, rise, radii, chord/arc/cut lengths)
 * based on calculated values
 *
 * @param {Object} valuesObj - The values object containing calculated data
 * @param {Object} elementsObj - The elements object containing DOM references
 * @throws {Error} If DOM updates fail
 *
 * @example
 * updateElementsFromValues(measuredValues, measuredElements);
 */
export function updateElementsFromValues(valuesObj, elementsObj) {
    try {
        if (DEBUG_MODE) {
            console.log('Curve Values (decimal feet):', valuesObj);
        }

        // Update degree input
        if (elementsObj.degree && valuesObj.degree != null) {
            elementsObj.degree.value = parseFloat(valuesObj.degree.toFixed(DECIMAL_PRECISION_DISPLAY));
        }

        // Update rise display
        if (elementsObj.rise && valuesObj.rise != null) {
            elementsObj.rise.value = inchesToFractional(valuesObj.rise, 32);
        }

        // Update all radius layers (R1-R6)
        RADIUS_LAYERS.forEach(layer => {
            if (elementsObj[layer] && valuesObj[layer]) {
                const layerValues = valuesObj[layer];
                const layerElements = elementsObj[layer];

                if (layerElements.radius && layerValues.radius != null) {
                    layerElements.radius.textContent = feetToArchitectural(layerValues.radius);
                }

                if (layerElements.chord && layerValues.chord != null) {
                    layerElements.chord.textContent = feetToArchitectural(layerValues.chord);
                }

                if (layerElements.arcLength && layerValues.arcLength != null) {
                    layerElements.arcLength.textContent = feetToArchitectural(layerValues.arcLength);
                }

                if (layerElements.cutLength && layerValues.cutLength != null) {
                    layerElements.cutLength.textContent = feetToArchitectural(layerValues.cutLength);
                }
            }
        });
    } catch (error) {
        console.error('Failed to update DOM elements:', error);
        throw new Error(`DOM update failed: ${error.message}`);
    }
}

/**
 * Validates measured chord lengths against compare spec with ±1/8" tolerance
 *
 * Updates spec cells in compare column with pass/fail indicators:
 * - ✓ (green) if within tolerance
 * - ✗ (red) if outside tolerance
 *
 * @param {Object} measuredValues - Measured values object
 * @param {Object} compareValues - Compare values object
 * @param {Object} compareElements - Compare elements object (for spec cells)
 */
export function validateSpec(measuredValues, compareValues, compareElements) {
    try {
        RADIUS_LAYERS.forEach(layer => {
            const measuredChord = measuredValues[layer]?.chord;
            const compareChord = compareValues[layer]?.chord;
            const specCell = compareElements[layer]?.spec;

            if (!specCell || measuredChord == null || compareChord == null) {
                return;
            }

            const difference = Math.abs(measuredChord - compareChord);

            // Clear previous classes
            specCell.classList.remove('spec-pass', 'spec-fail');

            if (difference < CHORD_TOLERANCE_FEET) {
                specCell.classList.add('spec-pass');
                specCell.textContent = "✓";
            } else {
                specCell.classList.add('spec-fail');
                specCell.textContent = "✗";
            }
        });
    } catch (error) {
        console.error('Spec validation failed:', error);
    }
}

/**
 * Updates the visibility of the compare column
 *
 * @param {boolean} isVisible - Whether the compare column should be visible
 * @param {HTMLElement} compareColumn - The compare column element
 * @param {HTMLElement} calculationsRow - The calculations row container
 * @param {HTMLInputElement} compareColumnToggle - The toggle checkbox
 */
export function updateCompareColumnVisibility(isVisible, compareColumn, calculationsRow, compareColumnToggle) {
    try {
        if (isVisible) {
            compareColumn.classList.remove('d-none');
            calculationsRow.classList.remove('single-column');
            if (compareColumnToggle) {
                compareColumnToggle.checked = true;
            }
        } else {
            compareColumn.classList.add('d-none');
            calculationsRow.classList.add('single-column');
            if (compareColumnToggle) {
                compareColumnToggle.checked = false;
            }
        }
    } catch (error) {
        console.error('Failed to update compare column visibility:', error);
    }
}

/**
 * Updates an auto-managed field indicator badge and reset button
 *
 * Shows "Auto" badge (gray) if field is auto-managed,
 * or "Modified" badge (blue) with visible reset button if manually changed
 *
 * @param {string} fieldName - The field name (e.g., 'panelLength')
 * @param {boolean} isAuto - Whether the field is auto-managed
 * @param {HTMLElement} badgeElement - The badge element
 * @param {HTMLElement} [resetBtnElement] - The reset button element
 */
export function updateAutoIndicator(fieldName, isAuto, badgeElement, resetBtnElement) {
    try {
        if (!badgeElement) {
            console.warn(`Badge element not found for ${fieldName}`);
            return;
        }

        if (isAuto) {
            badgeElement.textContent = 'Auto';
            badgeElement.classList.remove('manual-mode');
            if (resetBtnElement) resetBtnElement.classList.remove('visible');
        } else {
            badgeElement.textContent = 'Manual';
            badgeElement.classList.add('manual-mode');
            if (resetBtnElement) resetBtnElement.classList.add('visible');
        }
    } catch (error) {
        console.error(`Failed to update auto indicator for ${fieldName}:`, error);
    }
}

/**
 * Updates all auto-managed field indicators based on state
 *
 * @param {Object} autoManagedFields - Object mapping field names to auto state
 * @param {Object} autoManagedElements - Object containing badge elements
 */
export function updateAllAutoIndicators(autoManagedFields, autoManagedElements) {
    const fields = [
        'panelType',
        'panelLength',
        'gageWidth',
        'fieldWidth',
        'railSize',
        'fieldRubberWidth',
        'railHeadWidth',
        'gageRubberWidth'
    ];

    fields.forEach(field => {
        const isAuto = autoManagedFields[field];
        const badgeElement = autoManagedElements[`${field}Badge`];
        const resetBtnElement = autoManagedElements[`${field}Reset`];
        updateAutoIndicator(field, isAuto, badgeElement, resetBtnElement);
    });
}

/**
 * Clears input field values
 *
 * @param {Object} elements - Elements object
 * @param {Array<string>} fieldsToClear - Array of field names to clear
 */
export function clearInputFields(elements, fieldsToClear) {
    try {
        fieldsToClear.forEach(field => {
            if (elements[field]) {
                elements[field].value = "";
            }
        });
    } catch (error) {
        console.error('Failed to clear input fields:', error);
    }
}

/**
 * Builds dropdown options from an object
 *
 * @param {Object} optionsObj - Object with keys as option values
 * @param {Function} [formatter] - Optional function to format display text
 * @returns {string} HTML string of option elements
 *
 * @example
 * const html = buildSelectOptions({90: true, 110: true}, (key) => `#${key}`);
 * // Returns: '<option value="90">#90</option><option value="110">#110</option>'
 */
export function buildSelectOptions(optionsObj, formatter = null) {
    return Object.keys(optionsObj).map(key => {
        const displayText = formatter ? formatter(key) : key;
        return `<option value="${key}">${displayText}</option>`;
    }).join('');
}

/**
 * Sets the innerHTML of a select element with options
 *
 * @param {HTMLSelectElement} selectElement - The select element
 * @param {string} optionsHTML - HTML string of option elements
 * @throws {Error} If select element is invalid
 */
export function populateSelectElement(selectElement, optionsHTML) {
    if (!selectElement || !(selectElement instanceof HTMLSelectElement)) {
        throw new Error('Invalid select element provided');
    }

    try {
        selectElement.innerHTML = optionsHTML;
    } catch (error) {
        console.error('Failed to populate select element:', error);
        throw new Error(`Failed to populate select: ${error.message}`);
    }
}

/**
 * Sets a select element's value if the option exists
 *
 * @param {HTMLSelectElement} selectElement - The select element
 * @param {string} value - The value to set
 * @returns {boolean} True if value was set, false if option doesn't exist
 */
export function setSelectValue(selectElement, value) {
    if (!selectElement || !(selectElement instanceof HTMLSelectElement)) {
        console.warn('Invalid select element provided');
        return false;
    }

    const optionExists = Array.from(selectElement.options).some(option => option.value === value);

    if (optionExists) {
        selectElement.value = value;
        return true;
    } else {
        console.warn(`Option value "${value}" does not exist in select element`);
        return false;
    }
}

/**
 * Sets a numeric input's value with formatting
 *
 * @param {HTMLInputElement} inputElement - The input element
 * @param {number} value - The value to set
 * @param {number} [precision=3] - Number of decimal places
 * @returns {boolean} True if successful
 */
export function setNumericInputValue(inputElement, value, precision = DECIMAL_PRECISION_DISPLAY) {
    if (!inputElement) {
        console.warn('Invalid input element provided');
        return false;
    }

    if (typeof value !== 'number' || isNaN(value)) {
        console.warn(`Invalid numeric value: ${value}`);
        return false;
    }

    try {
        inputElement.value = value.toFixed(precision);
        return true;
    } catch (error) {
        console.error('Failed to set input value:', error);
        return false;
    }
}

/**
 * Toggles advanced settings panel visibility
 *
 * @param {HTMLElement} advancedSettings - The advanced settings container
 * @param {HTMLElement} toggleText - The toggle button text element
 * @param {HTMLElement} toggleIcon - The toggle button icon element
 */
export function toggleAdvancedSettings(advancedSettings, toggleText, toggleIcon) {
    try {
        const isCurrentlyVisible = advancedSettings.classList.contains('show');

        if (isCurrentlyVisible) {
            advancedSettings.classList.remove('show');
            toggleText.textContent = "Show Advanced Settings";
            toggleIcon.textContent = "▼";
        } else {
            advancedSettings.classList.add('show');
            toggleText.textContent = "Hide Advanced Settings";
            toggleIcon.textContent = "▲";
        }
    } catch (error) {
        console.error('Failed to toggle advanced settings:', error);
    }
}

/**
 * Displays a validation error message in the console
 *
 * @param {string} message - The error message
 */
export function displayValidationError(message) {
    console.error('⚠️ Validation Error:', message);
}

/**
 * Displays multiple validation errors in the console
 *
 * @param {Array<string>} errors - Array of error messages
 */
export function displayValidationErrors(errors) {
    console.error('⚠️ Validation Errors:');
    errors.forEach(error => console.error('  -', error));
}
