/**
 * settings.js - Settings Management
 *
 * Manages panel configuration settings, auto/manual modes, and panel type defaults.
 * Handles all getter/setter logic for panel dimensions and rail specifications.
 *
 * @module settings
 */

import {
    STANDARD_GAGE_WIDTH_FEET,
    PEDESTRIAN_GAGE_WIDTH_FEET,
    STANDARD_GAGE_RUBBER_WIDTH_FEET,
    PEDESTRIAN_GAGE_RUBBER_WIDTH_FEET,
    GAGE_TYPE_STANDARD,
    GAGE_TYPE_PEDESTRIAN,
    FLOAT_COMPARISON_EPSILON
} from './constants.js';
import { getPanelDefaultConfig, getRailHeadWidthForSize, getAllPanelTypes, getAllRailSizes } from './config.js';
import { setNumericInputValue, setSelectValue, buildSelectOptions, populateSelectElement } from './dom.js';

/**
 * Settings Manager Class
 *
 * Centralizes all panel settings management including getters/setters,
 * auto/manual mode tracking, and panel defaults application.
 */
export class SettingsManager {
    constructor(inputElements, autoManagedElements) {
        this.inputElements = inputElements;
        this.autoManagedElements = autoManagedElements;
        this.autoManagedFields = this.createAutoManagedFieldsState();
        this.currentPanelDefaults = this.createPanelDefaultsState();
    }

    /**
     * Creates initial auto-managed fields state
     */
    createAutoManagedFieldsState() {
        return {
            panelType: true,
            gageType: true,
            panelLength: true,
            gageWidth: true,
            fieldWidth: true,
            railSize: true,
            fieldRubberWidth: true,
            railHeadWidth: true,
            gageRubberWidth: true
        };
    }

    /**
     * Creates initial panel defaults state
     */
    createPanelDefaultsState() {
        return {
            gageType: null,
            panelLength: null,
            gageWidth: null,
            fieldWidth: null,
            railSize: null,
            fieldRubberWidth: null,
            railHeadWidth: null,
            gageRubberWidth: null
        };
    }

    // ===== Panel Type =====

    /**
     * Gets the currently selected panel type
     */
    getPanelType() {
        return this.inputElements.panelTypeSelect.value;
    }

    /**
     * Sets the panel type
     */
    setPanelType(panelType) {
        return setSelectValue(this.inputElements.panelTypeSelect, panelType);
    }

    /**
     * Builds and populates panel type dropdown options
     */
    buildPanelTypeOptions() {
        const panelTypes = getAllPanelTypes();
        const optionsObj = {};
        panelTypes.forEach(type => optionsObj[type] = true);
        const optionsHTML = buildSelectOptions(optionsObj);
        populateSelectElement(this.inputElements.panelTypeSelect, optionsHTML);
    }

    // ===== Gage Type =====

    /**
     * Gets the currently selected gage type
     */
    getGageType() {
        return this.inputElements.gageTypeElement.dataset.value || GAGE_TYPE_STANDARD;
    }

    /**
     * Sets the gage type and updates radio button
     */
    setGageType(gageType) {
        const validGageTypes = [GAGE_TYPE_STANDARD, GAGE_TYPE_PEDESTRIAN];
        if (!validGageTypes.includes(gageType)) {
            console.warn(`Invalid gage type: ${gageType}`);
            return false;
        }

        this.inputElements.gageTypeElement.dataset.value = gageType;

        const gageRadio = document.querySelector(`input[type='radio'][name='gageType'][value='${gageType}']`);
        if (gageRadio) {
            gageRadio.checked = true;
        } else {
            console.warn(`Gage type radio button for ${gageType} not found.`);
        }

        this.setGageWidth(gageType);

        // Update gage rubber width to match gage type (only if still auto-managed)
        if (this.autoManagedFields.gageRubberWidth) {
            const rubberWidth = gageType === GAGE_TYPE_PEDESTRIAN ? PEDESTRIAN_GAGE_RUBBER_WIDTH_FEET : STANDARD_GAGE_RUBBER_WIDTH_FEET;
            this.setGageRubberWidth(rubberWidth);
        }

        return true;
    }

    // ===== Panel Length =====

    /**
     * Gets the panel length in feet
     */
    getPanelLength() {
        return this.inputElements.panelLengthInput.value ? parseFloat(this.inputElements.panelLengthInput.value) : 0;
    }

    /**
     * Sets the panel length
     */
    setPanelLength(panelLength) {
        return setNumericInputValue(this.inputElements.panelLengthInput, panelLength, 3);
    }

    // ===== Gage Width =====

    /**
     * Gets the gage width in feet
     */
    getGageWidth() {
        return this.inputElements.gageWidthInput.value ? parseFloat(this.inputElements.gageWidthInput.value) : 0;
    }

    /**
     * Sets the gage width based on gage type
     */
    setGageWidth(gageType) {
        const validGageTypes = [GAGE_TYPE_STANDARD, GAGE_TYPE_PEDESTRIAN];
        if (!validGageTypes.includes(gageType)) {
            console.warn(`Invalid gage type: ${gageType}`);
            return false;
        }

        // Assign full precision directly (not through toFixed) to match pre-refactor behavior
        this.inputElements.gageWidthInput.value = gageType === GAGE_TYPE_STANDARD ? STANDARD_GAGE_WIDTH_FEET : PEDESTRIAN_GAGE_WIDTH_FEET;
        return true;
    }

    // ===== Field Width =====

    /**
     * Gets the field width in feet
     */
    getFieldWidth() {
        return this.inputElements.fieldWidthInput.value ? parseFloat(this.inputElements.fieldWidthInput.value) : 0;
    }

    /**
     * Sets the field width
     */
    setFieldWidth(fieldWidth) {
        return setNumericInputValue(this.inputElements.fieldWidthInput, fieldWidth, 3);
    }

    // ===== Rail Size =====

    /**
     * Gets the currently selected rail size
     */
    getRailSize() {
        return this.inputElements.railSizeSelect.value;
    }

    /**
     * Sets the rail size and updates rail head width
     */
    setRailSize(railSize) {
        const success = setSelectValue(this.inputElements.railSizeSelect, railSize);
        if (success) {
            this.setRailHeadWidth(railSize);
        }
        return success;
    }

    /**
     * Builds and populates rail size dropdown options
     */
    buildRailSizeOptions() {
        const railSizes = getAllRailSizes();
        const optionsObj = {};
        railSizes.forEach(size => optionsObj[size] = true);
        const optionsHTML = buildSelectOptions(optionsObj, (key) => `#${key}`);
        populateSelectElement(this.inputElements.railSizeSelect, optionsHTML);
    }

    // ===== Rail Head Width =====

    /**
     * Gets the rail head width in feet
     */
    getRailHeadWidth() {
        return this.inputElements.railHeadWidthInput.value ? parseFloat(this.inputElements.railHeadWidthInput.value) : 0;
    }

    /**
     * Sets the rail head width based on rail size
     */
    setRailHeadWidth(railSize) {
        const width = getRailHeadWidthForSize(railSize);
        if (width === 0) {
            console.warn(`Rail head width not found for rail size: ${railSize}`);
            return false;
        }
        return setNumericInputValue(this.inputElements.railHeadWidthInput, width, 3);
    }

    // ===== Field Rubber Width =====

    /**
     * Gets the field rubber width in feet
     */
    getFieldRubberWidth() {
        return this.inputElements.fieldRubberWidthInput.value ? parseFloat(this.inputElements.fieldRubberWidthInput.value) : 0;
    }

    /**
     * Sets the field rubber width
     */
    setFieldRubberWidth(fieldRubberWidth) {
        return setNumericInputValue(this.inputElements.fieldRubberWidthInput, fieldRubberWidth, 3);
    }

    // ===== Gage Rubber Width =====

    /**
     * Gets the gage rubber width in feet
     */
    getGageRubberWidth() {
        return this.inputElements.gageRubberWidthInput.value ? parseFloat(this.inputElements.gageRubberWidthInput.value) : 0;
    }

    /**
     * Sets the gage rubber width
     */
    setGageRubberWidth(gageRubberWidth) {
        return setNumericInputValue(this.inputElements.gageRubberWidthInput, gageRubberWidth, 3);
    }

    // ===== Auto/Manual Mode Management =====

    /**
     * Checks if a field is in auto-managed mode
     */
    isFieldAutoManaged(fieldName) {
        return this.autoManagedFields[fieldName] === true;
    }

    /**
     * Sets a field to manual mode
     */
    setFieldManualMode(fieldName) {
        if (this.autoManagedFields[fieldName]) {
            this.autoManagedFields[fieldName] = false;

            // Set panel type to manual mode if any setting is manually changed
            if (fieldName !== 'panelType') {
                this.autoManagedFields.panelType = false;
            }
        }
    }

    /**
     * Resets a field back to auto-managed mode
     */
    resetFieldToAuto(fieldName) {
        // Special case: Panel Type reset button resets ALL fields
        if (fieldName === 'panelType') {
            this.resetAllFieldsToAuto();
            return;
        }

        this.autoManagedFields[fieldName] = true;

        // Check if all fields are now auto - if so, reset Panel Type to auto
        this.checkAndUpdatePanelTypeAuto();

        // Reapply the panel default value
        const currentPanelType = this.getPanelType();
        const defaults = getPanelDefaultConfig(currentPanelType);

        if (defaults) {
            this.applyFieldDefault(fieldName, defaults);
        }
    }

    /**
     * Resets ALL fields to auto-managed mode (master reset)
     */
    resetAllFieldsToAuto() {
        // Reset all fields to auto mode
        for (let field in this.autoManagedFields) {
            this.autoManagedFields[field] = true;
        }

        // Reapply all panel defaults
        const currentPanelType = this.getPanelType();
        this.applyPanelTypeDefaults(currentPanelType);
    }

    /**
     * Checks if all non-panelType fields are in auto mode
     * If yes, sets Panel Type back to auto mode
     */
    checkAndUpdatePanelTypeAuto() {
        const allFieldsAuto = Object.keys(this.autoManagedFields).every(key =>
            key === 'panelType' || this.autoManagedFields[key]
        );

        if (allFieldsAuto && !this.autoManagedFields.panelType) {
            this.autoManagedFields.panelType = true;
        }
    }

    /**
     * Checks if a field value has been manually changed from panel default
     */
    isValueModifiedFromDefault(fieldName, currentValue) {
        const defaultValue = this.currentPanelDefaults[fieldName];

        if (defaultValue === null || defaultValue === undefined) {
            return false;
        }

        return Math.abs(currentValue - defaultValue) > FLOAT_COMPARISON_EPSILON;
    }

    // ===== Panel Defaults Application =====

    /**
     * Applies a single field default value
     */
    applyFieldDefault(fieldName, defaults) {
        switch (fieldName) {
            case 'gageType':
                const gageType = defaults.gageType || GAGE_TYPE_STANDARD;
                this.setGageType(gageType);
                this.currentPanelDefaults.gageType = gageType;
                break;

            case 'panelLength':
                if (defaults.panelLength !== undefined) {
                    this.setPanelLength(defaults.panelLength);
                    this.currentPanelDefaults.panelLength = defaults.panelLength;
                }
                break;

            case 'gageWidth':
                const gType = defaults.gageType || GAGE_TYPE_STANDARD;
                this.setGageWidth(gType);
                this.currentPanelDefaults.gageWidth = gType === GAGE_TYPE_STANDARD ? STANDARD_GAGE_WIDTH_FEET : PEDESTRIAN_GAGE_WIDTH_FEET;
                break;

            case 'fieldWidth':
                if (defaults.fieldWidth !== undefined) {
                    this.setFieldWidth(defaults.fieldWidth);
                    this.currentPanelDefaults.fieldWidth = defaults.fieldWidth;
                }
                break;

            case 'railSize':
                if (defaults.railSize !== undefined) {
                    this.setRailSize(defaults.railSize);
                    this.currentPanelDefaults.railSize = defaults.railSize;
                }
                break;

            case 'fieldRubberWidth':
                if (defaults.fieldRubberWidth !== undefined) {
                    this.setFieldRubberWidth(defaults.fieldRubberWidth);
                    this.currentPanelDefaults.fieldRubberWidth = defaults.fieldRubberWidth;
                }
                break;

            case 'railHeadWidth':
                if (defaults.railSize !== undefined) {
                    this.setRailHeadWidth(defaults.railSize);
                    this.currentPanelDefaults.railHeadWidth = getRailHeadWidthForSize(defaults.railSize);
                }
                break;

            case 'gageRubberWidth':
                if (defaults.gageRubberWidth !== undefined) {
                    this.setGageRubberWidth(defaults.gageRubberWidth);
                    this.currentPanelDefaults.gageRubberWidth = defaults.gageRubberWidth;
                }
                break;
        }
    }

    /**
     * Applies all panel type defaults
     */
    applyPanelTypeDefaults(panelType) {
        const defaults = getPanelDefaultConfig(panelType);

        if (!defaults) {
            console.warn(`No panel defaults found for panel type: ${panelType}`);
            return;
        }

        // Always set gage type
        const gageType = defaults.gageType || GAGE_TYPE_STANDARD;
        this.setGageType(gageType);
        this.currentPanelDefaults.gageType = gageType;

        // Set panel length (only if in auto mode)
        if (this.autoManagedFields.panelLength && defaults.panelLength !== undefined) {
            this.setPanelLength(defaults.panelLength);
        }
        this.currentPanelDefaults.panelLength = defaults.panelLength || 0;

        // Set gage width (only if in auto mode)
        if (this.autoManagedFields.gageWidth) {
            this.setGageWidth(gageType);
        }
        this.currentPanelDefaults.gageWidth = gageType === GAGE_TYPE_STANDARD ? STANDARD_GAGE_WIDTH_FEET : PEDESTRIAN_GAGE_WIDTH_FEET;

        // Set field width (only if in auto mode)
        if (this.autoManagedFields.fieldWidth && defaults.fieldWidth !== undefined) {
            this.setFieldWidth(defaults.fieldWidth);
        }
        this.currentPanelDefaults.fieldWidth = defaults.fieldWidth || 0;

        // Set rail size (only if in auto mode)
        if (this.autoManagedFields.railSize && defaults.railSize !== undefined) {
            this.setRailSize(defaults.railSize);
        }
        this.currentPanelDefaults.railSize = defaults.railSize || "133";

        // Set field rubber width (only if in auto mode)
        if (this.autoManagedFields.fieldRubberWidth && defaults.fieldRubberWidth !== undefined) {
            this.setFieldRubberWidth(defaults.fieldRubberWidth);
        }
        this.currentPanelDefaults.fieldRubberWidth = defaults.fieldRubberWidth || 0;

        // Set rail head width (only if in auto mode)
        if (this.autoManagedFields.railHeadWidth && defaults.railSize !== undefined) {
            this.setRailHeadWidth(defaults.railSize);
        }
        this.currentPanelDefaults.railHeadWidth = getRailHeadWidthForSize(defaults.railSize || "133");

        // Set gage rubber width (only if in auto mode)
        if (this.autoManagedFields.gageRubberWidth && defaults.gageRubberWidth !== undefined) {
            this.setGageRubberWidth(defaults.gageRubberWidth);
        }
        this.currentPanelDefaults.gageRubberWidth = defaults.gageRubberWidth || 0;
    }

    /**
     * Calculates the radius offset for high/low radius conversions
     */
    getRadiusOffset() {
        return this.getRailHeadWidth() / 2 + this.getGageRubberWidth() + this.getGageWidth() / 2;
    }
}

/**
 * Creates and returns a new SettingsManager instance
 */
export function createSettingsManager(inputElements, autoManagedElements) {
    return new SettingsManager(inputElements, autoManagedElements);
}
