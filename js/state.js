/**
 * state.js - Application State Management
 *
 * Manages application state, DOM element references, and state initialization.
 * Provides centralized access to all UI elements and data structures.
 *
 * @module state
 */

import { RADIUS_LAYERS } from './constants.js';

/**
 * Initializes DOM element references for input controls
 *
 * @returns {Object} Object containing references to all input elements
 * @throws {Error} If required elements are not found in DOM
 */
export function initializeInputElements() {
    const elements = {
        panelTypeSelect: document.getElementById("panelType"),
        gageTypeElement: document.getElementById("gageType"),
        panelLengthInput: document.getElementById("panelLength"),
        gageWidthInput: document.getElementById("gageWidth"),
        fieldWidthInput: document.getElementById("fieldWidth"),
        railSizeSelect: document.getElementById("railSize"),
        fieldRubberWidthInput: document.getElementById("fieldRubberWidth"),
        railHeadWidthInput: document.getElementById("railHeadWidth"),
        gageRubberWidthInput: document.getElementById("gageRubberWidth"),
        compareColumnToggle: document.getElementById("compareColumnToggle"),
        compareColumn: document.getElementById("compareColumn"),
        advancedSettingsToggle: document.getElementById("advancedSettingsToggle")
    };

    // Validate all required elements exist
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            throw new Error(`Required DOM element not found: ${key}`);
        }
    }

    // Add calculated reference
    elements.calculationsRow = elements.compareColumn.parentElement;

    return elements;
}

/**
 * Initializes DOM element references for auto-managed field badges and reset buttons
 *
 * @returns {Object} Object containing badge and reset button references
 * @throws {Error} If required elements are not found in DOM
 */
export function initializeAutoManagedElements() {
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

    const elements = {};

    fields.forEach(field => {
        const badge = document.getElementById(`${field}-badge`);
        const reset = document.getElementById(`${field}-reset`);

        if (!badge) {
            throw new Error(`Auto-managed badge not found: ${field}-badge`);
        }
        if (!reset) {
            throw new Error(`Auto-managed reset button not found: ${field}-reset`);
        }

        elements[`${field}Badge`] = badge;
        elements[`${field}Reset`] = reset;
    });

    return elements;
}

/**
 * Initializes DOM element references for measured values column
 *
 * @returns {Object} Object containing references to all measured value elements
 * @throws {Error} If required elements are not found in DOM
 */
export function initializeMeasuredElements() {
    const elements = {
        degree: document.getElementById("degreeOfCurve"),
        rise: document.getElementById("measuredRise"),
        highRadius: document.getElementById("highRadius"),
        centerRadius: document.getElementById("centerRadius"),
        lowRadius: document.getElementById("lowRadius")
    };

    // Validate basic elements
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            throw new Error(`Measured element not found: ${key}`);
        }
    }

    // Add radius layer elements (R1-R6)
    RADIUS_LAYERS.forEach(layer => {
        const layerElements = {
            radius: document.getElementById(`measured-${layer}-radius`),
            chord: document.getElementById(`measured-${layer}-chord`),
            arcLength: document.getElementById(`measured-${layer}-arc`),
            cutLength: document.getElementById(`measured-${layer}-cut`)
        };

        // Validate layer elements
        for (const [key, element] of Object.entries(layerElements)) {
            if (!element) {
                throw new Error(`Measured ${layer} element not found: ${key}`);
            }
        }

        elements[layer] = layerElements;
    });

    return elements;
}

/**
 * Initializes DOM element references for compare values column
 *
 * @returns {Object} Object containing references to all compare value elements
 * @throws {Error} If required elements are not found in DOM
 */
export function initializeCompareElements() {
    const elements = {
        degree: document.getElementById("compare-degreeOfCurve"),
        rise: document.getElementById("compare-Rise"),
        highRadius: document.getElementById("compare-highRadius"),
        centerRadius: document.getElementById("compare-centerRadius"),
        lowRadius: document.getElementById("compare-lowRadius")
    };

    // Validate basic elements
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            throw new Error(`Compare element not found: ${key}`);
        }
    }

    // Add radius layer elements (R1-R6) with spec cells
    RADIUS_LAYERS.forEach(layer => {
        const layerElements = {
            radius: document.getElementById(`compare-${layer}-radius`),
            chord: document.getElementById(`compare-${layer}-chord`),
            arcLength: document.getElementById(`compare-${layer}-arc`),
            cutLength: document.getElementById(`compare-${layer}-cut`),
            spec: document.getElementById(`compare-${layer}-spec`)
        };

        // Validate layer elements
        for (const [key, element] of Object.entries(layerElements)) {
            if (!element) {
                throw new Error(`Compare ${layer} element not found: ${key}`);
            }
        }

        elements[layer] = layerElements;
    });

    return elements;
}

/**
 * Creates an empty values object structure for measured or compare data
 *
 * @returns {Object} Empty values object with all required fields
 */
export function createEmptyValuesObject() {
    const values = {
        degree: null,
        rise: null,
        highRadius: null,
        centerRadius: null,
        lowRadius: null
    };

    // Add radius layer values (R1-R6)
    RADIUS_LAYERS.forEach(layer => {
        values[layer] = {
            radius: null,
            chord: null,
            arcLength: null,
            cutLength: null
        };
    });

    return values;
}

/**
 * Creates initial state for auto-managed fields
 *
 * All fields default to auto-managed (true)
 *
 * @returns {Object} Auto-managed fields state object
 */
export function createAutoManagedFieldsState() {
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
 * Creates initial state for current panel defaults tracking
 *
 * Used to compare current values against panel defaults to detect manual changes
 *
 * @returns {Object} Current panel defaults object
 */
export function createPanelDefaultsState() {
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

/**
 * Application State Manager
 *
 * Centralizes all application state and provides controlled access
 */
export class AppState {
    constructor() {
        this.inputElements = null;
        this.autoManagedElements = null;
        this.measuredElements = null;
        this.measuredValues = null;
        this.compareElements = null;
        this.compareValues = null;
        this.autoManagedFields = null;
        this.currentPanelDefaults = null;
        this.isCompareColumnVisible = false;
        this.theta = 0;
    }

    /**
     * Initializes all state objects and DOM references
     *
     * Must be called after DOM is ready
     *
     * @throws {Error} If initialization fails
     */
    initialize() {
        try {
            this.inputElements = initializeInputElements();
            this.autoManagedElements = initializeAutoManagedElements();
            this.measuredElements = initializeMeasuredElements();
            this.measuredValues = createEmptyValuesObject();
            this.compareElements = initializeCompareElements();
            this.compareValues = createEmptyValuesObject();
            this.autoManagedFields = createAutoManagedFieldsState();
            this.currentPanelDefaults = createPanelDefaultsState();
        } catch (error) {
            console.error('State initialization failed:', error);
            throw new Error(`Failed to initialize application state: ${error.message}`);
        }
    }

    /**
     * Gets a specific input element
     *
     * @param {string} name - Element name
     * @returns {HTMLElement} The requested element
     */
    getInputElement(name) {
        return this.inputElements[name];
    }

    /**
     * Gets the auto-managed state for a field
     *
     * @param {string} fieldName - Field name
     * @returns {boolean} Whether the field is auto-managed
     */
    isFieldAutoManaged(fieldName) {
        return this.autoManagedFields[fieldName] === true;
    }

    /**
     * Sets the auto-managed state for a field
     *
     * @param {string} fieldName - Field name
     * @param {boolean} isAuto - Whether the field should be auto-managed
     */
    setFieldAutoManaged(fieldName, isAuto) {
        this.autoManagedFields[fieldName] = isAuto;
    }

    /**
     * Updates a current panel default value
     *
     * @param {string} fieldName - Field name
     * @param {*} value - The default value
     */
    setCurrentPanelDefault(fieldName, value) {
        this.currentPanelDefaults[fieldName] = value;
    }

    /**
     * Gets a current panel default value
     *
     * @param {string} fieldName - Field name
     * @returns {*} The default value
     */
    getCurrentPanelDefault(fieldName) {
        return this.currentPanelDefaults[fieldName];
    }
}

/**
 * Creates and returns a new AppState instance
 *
 * @returns {AppState} New application state manager
 */
export function createAppState() {
    return new AppState();
}
