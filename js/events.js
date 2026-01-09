/**
 * events.js - Event Listeners Setup
 *
 * Registers all event listeners and handles user interactions.
 * Coordinates between settings, calculations, DOM updates, and validation.
 *
 * @module events
 */

import { degreeToRadius, radiusToDegree, calculateTheta, calculateRise, calculateAllRadii, calculateAllCurveData } from './calculations.js';
import { updateElementsFromValues, validateSpec, updateCompareColumnVisibility, clearInputFields, updateAutoIndicator } from './dom.js';
import { displayValidationError } from './validation.js';

/**
 * Calculates and updates all values from a center radius
 *
 * @param {number} centerRadius - The center radius in feet
 * @param {Object} valuesObj - Values object to update
 * @param {Object} elementsObj - Elements object to update
 * @param {Object} settingsManager - Settings manager instance
 */
export function calculateAndUpdateFromCenterRadius(centerRadius, valuesObj, elementsObj, settingsManager) {
    if (!centerRadius || isNaN(centerRadius)) return;

    try {
        // Get current panel configuration
        const panelLength = settingsManager.getPanelLength();
        const gageWidth = settingsManager.getGageWidth();
        const fieldWidth = settingsManager.getFieldWidth();
        const fieldRubberWidth = settingsManager.getFieldRubberWidth();
        const railHeadWidth = settingsManager.getRailHeadWidth();
        const gageRubberWidth = settingsManager.getGageRubberWidth();

        // Calculate degree and theta
        const degree = radiusToDegree(centerRadius);
        const theta = calculateTheta(panelLength, centerRadius);
        const rise = calculateRise(centerRadius, panelLength);

        // Calculate offsets
        const offset1 = gageWidth / 2;
        const offset2 = gageWidth / 2 + gageRubberWidth + railHeadWidth + fieldRubberWidth;
        const offset3 = offset2 + fieldWidth;

        // Calculate all radii
        const radii = calculateAllRadii(centerRadius, offset1, offset2, offset3);

        // Calculate curve data for all layers
        const curveData = calculateAllCurveData(radii, theta);

        // Update values object
        valuesObj.degree = degree;
        valuesObj.rise = rise;
        valuesObj.centerRadius = centerRadius;
        valuesObj.highRadius = radii.r4;
        valuesObj.lowRadius = radii.r3;

        // Copy curve data to values object
        ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'].forEach(layer => {
            valuesObj[layer] = curveData[layer];
        });

        // Update DOM
        updateElementsFromValues(valuesObj, elementsObj);

    } catch (error) {
        console.error('Calculation failed:', error);
        displayValidationError(`Unable to calculate: ${error.message}`);
    }
}

/**
 * Handles measured radius input and updates compare column if visible
 *
 * @param {number} centerRadius - The calculated center radius
 * @param {Object} measuredElements - Measured elements object
 * @param {Object} measuredValues - Measured values object
 * @param {Object} compareElements - Compare elements object
 * @param {Object} compareValues - Compare values object
 * @param {Array<string>} fieldsToClear - Array of field names to clear
 * @param {boolean} isCompareColumnVisible - Whether compare column is visible
 * @param {Object} settingsManager - Settings manager instance
 */
export function handleMeasuredRadiusChange(
    centerRadius,
    measuredElements,
    measuredValues,
    compareElements,
    compareValues,
    fieldsToClear,
    isCompareColumnVisible,
    settingsManager
) {
    try {
        calculateAndUpdateFromCenterRadius(centerRadius, measuredValues, measuredElements, settingsManager);

        // Update compare column if visible
        if (isCompareColumnVisible) {
            const roundedDegree = Math.round(radiusToDegree(centerRadius));
            const compareCenterRadius = degreeToRadius(roundedDegree);
            calculateAndUpdateFromCenterRadius(compareCenterRadius, compareValues, compareElements, settingsManager);
            validateSpec(measuredValues, compareValues, compareElements);
        }

        // Clear specified input fields
        clearInputFields(measuredElements, fieldsToClear);

    } catch (error) {
        console.error('Measured radius change handler failed:', error);
        displayValidationError(error.message);
    }
}

/**
 * Handles compare radius input
 *
 * @param {number} centerRadius - The calculated center radius
 * @param {Object} compareElements - Compare elements object
 * @param {Object} compareValues - Compare values object
 * @param {Array<string>} fieldsToClear - Array of field names to clear
 * @param {Object} settingsManager - Settings manager instance
 */
export function handleCompareRadiusChange(centerRadius, compareElements, compareValues, fieldsToClear, settingsManager) {
    try {
        calculateAndUpdateFromCenterRadius(centerRadius, compareValues, compareElements, settingsManager);
        clearInputFields(compareElements, fieldsToClear);
    } catch (error) {
        console.error('Compare radius change handler failed:', error);
        displayValidationError(error.message);
    }
}

/**
 * Sets up all event listeners for the application
 *
 * @param {Object} state - Application state object
 * @param {Object} settingsManager - Settings manager instance
 */
export function setupEventListeners(state, settingsManager) {
    const {
        inputElements,
        autoManagedElements,
        measuredElements,
        measuredValues,
        compareElements,
        compareValues
    } = state;

    // Helper to recalculate if center radius exists
    const recalculateIfNeeded = () => {
        if (measuredValues.centerRadius) {
            calculateAndUpdateFromCenterRadius(
                measuredValues.centerRadius,
                measuredValues,
                measuredElements,
                settingsManager
            );
        }
    };

    // ===== Panel Type Change =====
    inputElements.panelTypeSelect.addEventListener("change", function () {
        try {
            const newPanelType = this.value;
            settingsManager.setPanelType(newPanelType);

            // Apply new panel defaults
            settingsManager.applyPanelTypeDefaults(newPanelType);

            // Check if any fields are in manual mode
            const anyFieldManual = Object.keys(settingsManager.autoManagedFields).some(key =>
                key !== 'panelType' && !settingsManager.autoManagedFields[key]
            );

            if (anyFieldManual) {
                settingsManager.autoManagedFields.panelType = false;
            }

            // Update all auto indicators
            updateAutoIndicator('panelType', settingsManager.isFieldAutoManaged('panelType'), autoManagedElements.panelTypeBadge);
            recalculateIfNeeded();

        } catch (error) {
            console.error('Panel type change failed:', error);
        }
    });

    // ===== Panel Length Change =====
    inputElements.panelLengthInput.addEventListener("change", function () {
        try {
            const currentValue = parseFloat(this.value);

            if (settingsManager.isFieldAutoManaged('panelLength') &&
                settingsManager.isValueModifiedFromDefault('panelLength', currentValue)) {
                settingsManager.setFieldManualMode('panelLength');
                updateAutoIndicator('panelLength', false, autoManagedElements.panelLengthBadge);
                updateAutoIndicator('panelType', settingsManager.isFieldAutoManaged('panelType'), autoManagedElements.panelTypeBadge);
            }

            recalculateIfNeeded();
        } catch (error) {
            console.error('Panel length change failed:', error);
        }
    });

    // ===== Gage Type Change =====
    const radio_objects = document.querySelectorAll("input[type='radio'][name=gageType]");

    radio_objects.forEach(function (radio) {
        radio.addEventListener("change", function () {
            try {
                settingsManager.setGageType(this.value);

                if (settingsManager.isFieldAutoManaged('gageType') &&
                    settingsManager.currentPanelDefaults.gageType &&
                    this.value !== settingsManager.currentPanelDefaults.gageType) {
                    settingsManager.setFieldManualMode('gageType');
                    settingsManager.setFieldManualMode('gageWidth');
                    updateAutoIndicator('gageWidth', false, autoManagedElements.gageWidthBadge);
                    updateAutoIndicator('panelType', settingsManager.isFieldAutoManaged('panelType'), autoManagedElements.panelTypeBadge);
                }

                recalculateIfNeeded();
            } catch (error) {
                console.error('Gage type change failed:', error);
            }
        });
    });

    // ===== Gage Width Change =====
    inputElements.gageWidthInput.addEventListener("change", function () {
        try {
            const currentValue = parseFloat(this.value);

            if (settingsManager.isFieldAutoManaged('gageWidth') &&
                settingsManager.isValueModifiedFromDefault('gageWidth', currentValue)) {
                settingsManager.setFieldManualMode('gageWidth');
                updateAutoIndicator('gageWidth', false, autoManagedElements.gageWidthBadge);
                updateAutoIndicator('panelType', settingsManager.isFieldAutoManaged('panelType'), autoManagedElements.panelTypeBadge);
            }

            recalculateIfNeeded();
        } catch (error) {
            console.error('Gage width change failed:', error);
        }
    });

    // ===== Field Width Change =====
    inputElements.fieldWidthInput.addEventListener("change", function () {
        try {
            const currentValue = parseFloat(this.value);

            if (settingsManager.isFieldAutoManaged('fieldWidth') &&
                settingsManager.isValueModifiedFromDefault('fieldWidth', currentValue)) {
                settingsManager.setFieldManualMode('fieldWidth');
                updateAutoIndicator('fieldWidth', false, autoManagedElements.fieldWidthBadge);
                updateAutoIndicator('panelType', settingsManager.isFieldAutoManaged('panelType'), autoManagedElements.panelTypeBadge);
            }

            recalculateIfNeeded();
        } catch (error) {
            console.error('Field width change failed:', error);
        }
    });

    // ===== Field Rubber Width Change =====
    inputElements.fieldRubberWidthInput.addEventListener("change", function () {
        try {
            const currentValue = parseFloat(this.value);

            if (settingsManager.isFieldAutoManaged('fieldRubberWidth') &&
                settingsManager.isValueModifiedFromDefault('fieldRubberWidth', currentValue)) {
                settingsManager.setFieldManualMode('fieldRubberWidth');
                updateAutoIndicator('fieldRubberWidth', false, autoManagedElements.fieldRubberWidthBadge);
                updateAutoIndicator('panelType', settingsManager.isFieldAutoManaged('panelType'), autoManagedElements.panelTypeBadge);
            }

            recalculateIfNeeded();
        } catch (error) {
            console.error('Field rubber width change failed:', error);
        }
    });

    // ===== Gage Rubber Width Change =====
    inputElements.gageRubberWidthInput.addEventListener("change", function () {
        try {
            const currentValue = parseFloat(this.value);

            if (settingsManager.isFieldAutoManaged('gageRubberWidth') &&
                settingsManager.isValueModifiedFromDefault('gageRubberWidth', currentValue)) {
                settingsManager.setFieldManualMode('gageRubberWidth');
                updateAutoIndicator('gageRubberWidth', false, autoManagedElements.gageRubberWidthBadge);
                updateAutoIndicator('panelType', settingsManager.isFieldAutoManaged('panelType'), autoManagedElements.panelTypeBadge);
            }

            recalculateIfNeeded();
        } catch (error) {
            console.error('Gage rubber width change failed:', error);
        }
    });

    // ===== Rail Size Change =====
    inputElements.railSizeSelect.addEventListener("change", function () {
        try {
            const newRailSize = this.value;

            if (settingsManager.isFieldAutoManaged('railSize') &&
                settingsManager.currentPanelDefaults.railSize &&
                newRailSize !== settingsManager.currentPanelDefaults.railSize) {
                settingsManager.setFieldManualMode('railSize');
                updateAutoIndicator('railSize', false, autoManagedElements.railSizeBadge);
                updateAutoIndicator('panelType', settingsManager.isFieldAutoManaged('panelType'), autoManagedElements.panelTypeBadge);
            }

            settingsManager.setRailSize(newRailSize);

            recalculateIfNeeded();
        } catch (error) {
            console.error('Rail size change failed:', error);
        }
    });

    // ===== Rail Head Width Change =====
    inputElements.railHeadWidthInput.addEventListener("change", function () {
        try {
            const currentValue = parseFloat(this.value);

            if (settingsManager.isFieldAutoManaged('railHeadWidth') &&
                settingsManager.isValueModifiedFromDefault('railHeadWidth', currentValue)) {
                settingsManager.setFieldManualMode('railHeadWidth');
                updateAutoIndicator('railHeadWidth', false, autoManagedElements.railHeadWidthBadge);
                updateAutoIndicator('panelType', settingsManager.isFieldAutoManaged('panelType'), autoManagedElements.panelTypeBadge);
            }

            recalculateIfNeeded();
        } catch (error) {
            console.error('Rail head width change failed:', error);
        }
    });

    // ===== Reset Button Listeners =====
    autoManagedElements.panelTypeReset.addEventListener("click", function () {
        try {
            settingsManager.resetFieldToAuto('panelType');
            updateAutoIndicator('panelType', true, autoManagedElements.panelTypeBadge);
            recalculateIfNeeded();
        } catch (error) {
            console.error('Panel type reset failed:', error);
        }
    });

    autoManagedElements.panelLengthReset.addEventListener("click", function () {
        try {
            settingsManager.resetFieldToAuto('panelLength');
            updateAutoIndicator('panelLength', true, autoManagedElements.panelLengthBadge);
            updateAutoIndicator('panelType', settingsManager.isFieldAutoManaged('panelType'), autoManagedElements.panelTypeBadge);
            recalculateIfNeeded();
        } catch (error) {
            console.error('Panel length reset failed:', error);
        }
    });

    autoManagedElements.gageWidthReset.addEventListener("click", function () {
        try {
            settingsManager.resetFieldToAuto('gageWidth');
            updateAutoIndicator('gageWidth', true, autoManagedElements.gageWidthBadge);
            updateAutoIndicator('panelType', settingsManager.isFieldAutoManaged('panelType'), autoManagedElements.panelTypeBadge);
            recalculateIfNeeded();
        } catch (error) {
            console.error('Gage width reset failed:', error);
        }
    });

    autoManagedElements.fieldWidthReset.addEventListener("click", function () {
        try {
            settingsManager.resetFieldToAuto('fieldWidth');
            updateAutoIndicator('fieldWidth', true, autoManagedElements.fieldWidthBadge);
            updateAutoIndicator('panelType', settingsManager.isFieldAutoManaged('panelType'), autoManagedElements.panelTypeBadge);
            recalculateIfNeeded();
        } catch (error) {
            console.error('Field width reset failed:', error);
        }
    });

    autoManagedElements.railSizeReset.addEventListener("click", function () {
        try {
            settingsManager.resetFieldToAuto('railSize');
            updateAutoIndicator('railSize', true, autoManagedElements.railSizeBadge);
            updateAutoIndicator('panelType', settingsManager.isFieldAutoManaged('panelType'), autoManagedElements.panelTypeBadge);
            recalculateIfNeeded();
        } catch (error) {
            console.error('Rail size reset failed:', error);
        }
    });

    autoManagedElements.fieldRubberWidthReset.addEventListener("click", function () {
        try {
            settingsManager.resetFieldToAuto('fieldRubberWidth');
            updateAutoIndicator('fieldRubberWidth', true, autoManagedElements.fieldRubberWidthBadge);
            updateAutoIndicator('panelType', settingsManager.isFieldAutoManaged('panelType'), autoManagedElements.panelTypeBadge);
            recalculateIfNeeded();
        } catch (error) {
            console.error('Field rubber width reset failed:', error);
        }
    });

    autoManagedElements.railHeadWidthReset.addEventListener("click", function () {
        try {
            settingsManager.resetFieldToAuto('railHeadWidth');
            updateAutoIndicator('railHeadWidth', true, autoManagedElements.railHeadWidthBadge);
            updateAutoIndicator('panelType', settingsManager.isFieldAutoManaged('panelType'), autoManagedElements.panelTypeBadge);
            recalculateIfNeeded();
        } catch (error) {
            console.error('Rail head width reset failed:', error);
        }
    });

    autoManagedElements.gageRubberWidthReset.addEventListener("click", function () {
        try {
            settingsManager.resetFieldToAuto('gageRubberWidth');
            updateAutoIndicator('gageRubberWidth', true, autoManagedElements.gageRubberWidthBadge);
            updateAutoIndicator('panelType', settingsManager.isFieldAutoManaged('panelType'), autoManagedElements.panelTypeBadge);
            recalculateIfNeeded();
        } catch (error) {
            console.error('Gage rubber width reset failed:', error);
        }
    });

    // ===== Measured Radius Inputs =====
    measuredElements.centerRadius.addEventListener("change", function () {
        try {
            const centerRadius = parseFloat(this.value);
            if (!isNaN(centerRadius)) {
                handleMeasuredRadiusChange(
                    centerRadius,
                    measuredElements,
                    measuredValues,
                    compareElements,
                    compareValues,
                    ['highRadius', 'lowRadius'],
                    state.isCompareColumnVisible,
                    settingsManager
                );
            }
        } catch (error) {
            console.error('Center radius change failed:', error);
            displayValidationError(error.message);
        }
    });

    measuredElements.highRadius.addEventListener("change", function () {
        try {
            const highRadius = parseFloat(this.value);
            if (!isNaN(highRadius)) {
                const centerRadius = highRadius - settingsManager.getRadiusOffset();
                handleMeasuredRadiusChange(
                    centerRadius,
                    measuredElements,
                    measuredValues,
                    compareElements,
                    compareValues,
                    ['centerRadius', 'lowRadius'],
                    state.isCompareColumnVisible,
                    settingsManager
                );
            }
        } catch (error) {
            console.error('High radius change failed:', error);
            displayValidationError(error.message);
        }
    });

    measuredElements.lowRadius.addEventListener("change", function () {
        try {
            const lowRadius = parseFloat(this.value);
            if (!isNaN(lowRadius)) {
                const centerRadius = lowRadius + settingsManager.getRadiusOffset();
                handleMeasuredRadiusChange(
                    centerRadius,
                    measuredElements,
                    measuredValues,
                    compareElements,
                    compareValues,
                    ['centerRadius', 'highRadius'],
                    state.isCompareColumnVisible,
                    settingsManager
                );
            }
        } catch (error) {
            console.error('Low radius change failed:', error);
            displayValidationError(error.message);
        }
    });

    // ===== Measured Degree Input =====
    measuredElements.degree.addEventListener("change", function () {
        try {
            const degree = parseFloat(this.value);
            if (!isNaN(degree)) {
                const centerRadius = degreeToRadius(degree);
                calculateAndUpdateFromCenterRadius(centerRadius, measuredValues, measuredElements, settingsManager);

                // Update compare column if visible
                if (state.isCompareColumnVisible) {
                    const roundedDegree = Math.round(degree);
                    const compareCenterRadius = degreeToRadius(roundedDegree);
                    calculateAndUpdateFromCenterRadius(compareCenterRadius, compareValues, compareElements, settingsManager);
                    validateSpec(measuredValues, compareValues, compareElements);
                }
            }

            // Clear the radius inputs
            clearInputFields(measuredElements, ['highRadius', 'centerRadius', 'lowRadius']);

        } catch (error) {
            console.error('Degree change failed:', error);
            displayValidationError(error.message);
        }
    });

    // ===== Compare Radius Inputs =====
    compareElements.centerRadius.addEventListener("change", function () {
        try {
            const centerRadius = parseFloat(this.value);
            if (!isNaN(centerRadius)) {
                handleCompareRadiusChange(centerRadius, compareElements, compareValues, ['highRadius', 'lowRadius'], settingsManager);
            }
        } catch (error) {
            console.error('Compare center radius change failed:', error);
            displayValidationError(error.message);
        }
    });

    compareElements.highRadius.addEventListener("change", function () {
        try {
            const highRadius = parseFloat(this.value);
            if (!isNaN(highRadius)) {
                const centerRadius = highRadius - settingsManager.getRadiusOffset();
                handleCompareRadiusChange(centerRadius, compareElements, compareValues, ['centerRadius', 'lowRadius'], settingsManager);
            }
        } catch (error) {
            console.error('Compare high radius change failed:', error);
            displayValidationError(error.message);
        }
    });

    compareElements.lowRadius.addEventListener("change", function () {
        try {
            const lowRadius = parseFloat(this.value);
            if (!isNaN(lowRadius)) {
                const centerRadius = lowRadius + settingsManager.getRadiusOffset();
                handleCompareRadiusChange(centerRadius, compareElements, compareValues, ['centerRadius', 'highRadius'], settingsManager);
            }
        } catch (error) {
            console.error('Compare low radius change failed:', error);
            displayValidationError(error.message);
        }
    });

    // ===== Compare Degree Input =====
    compareElements.degree.addEventListener("change", function () {
        try {
            const degree = parseFloat(this.value);
            if (!isNaN(degree)) {
                const centerRadius = degreeToRadius(degree);
                calculateAndUpdateFromCenterRadius(centerRadius, compareValues, compareElements, settingsManager);
            }

            // Clear the radius inputs
            clearInputFields(compareElements, ['highRadius', 'centerRadius', 'lowRadius']);

        } catch (error) {
            console.error('Compare degree change failed:', error);
            displayValidationError(error.message);
        }
    });

    // ===== Compare Column Toggle =====
    inputElements.compareColumnToggle.addEventListener('change', function () {
        try {
            state.isCompareColumnVisible = this.checked;
            updateCompareColumnVisibility(
                state.isCompareColumnVisible,
                inputElements.compareColumn,
                inputElements.calculationsRow,
                inputElements.compareColumnToggle
            );

            // Save to storage
            import('./storage.js').then(({ storage }) => {
                storage.setItem('compare-column-visible', state.isCompareColumnVisible);
            });

        } catch (error) {
            console.error('Compare column toggle failed:', error);
        }
    });

    // ===== Advanced Settings Toggle =====
    const advancedSettings = document.getElementById("advancedSettings");
    const advancedSettingsToggleText = document.getElementById("advancedSettingsToggleText");
    const advancedSettingsToggleIcon = document.getElementById("advancedSettingsToggleIcon");

    if (inputElements.advancedSettingsToggle && advancedSettings) {
        inputElements.advancedSettingsToggle.addEventListener('click', function () {
            try {
                const isExpanded = advancedSettings.classList.contains('show');

                if (isExpanded) {
                    advancedSettings.classList.remove('show');
                    if (advancedSettingsToggleText) advancedSettingsToggleText.textContent = "Show Advanced Settings";
                    if (advancedSettingsToggleIcon) advancedSettingsToggleIcon.textContent = "▼";
                } else {
                    advancedSettings.classList.add('show');
                    if (advancedSettingsToggleText) advancedSettingsToggleText.textContent = "Hide Advanced Settings";
                    if (advancedSettingsToggleIcon) advancedSettingsToggleIcon.textContent = "▲";
                }
            } catch (error) {
                console.error('Advanced settings toggle failed:', error);
            }
        });
    }

    // ===== Radio Button State Tracking =====
    // Source: https://stackoverflow.com/a/79490464
    radio_objects.forEach(radio => {
        radio.addEventListener('click', function () {
            document.getElementById(this.name).dataset.value = this.value;
        });
    });
}
