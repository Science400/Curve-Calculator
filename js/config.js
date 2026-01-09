/**
 * config.js - Panel and Rail Configuration
 *
 * Defines panel type defaults and rail head width specifications.
 * These configurations drive the auto-managed field system.
 *
 * @module config
 */

import {
    INCHES_PER_FOOT,
    GAGE_TYPE_STANDARD,
    GAGE_TYPE_PEDESTRIAN,
    STANDARD_GAGE_WIDTH_FEET,
    PEDESTRIAN_GAGE_WIDTH_FEET
} from './constants.js';

// ===== Rail Head Widths =====

/**
 * Rail head widths by rail size (in feet)
 * Maps rail size designation to the width of the rail head
 *
 * @constant {Object<string, number>}
 */
export const railHeadWidths = {
    "90": (2 + 9 / 16) / INCHES_PER_FOOT,
    "110": (2 + 5 / 8) / INCHES_PER_FOOT,
    "115": (2 + 11 / 16) / INCHES_PER_FOOT,
    "119": (2 + 5 / 8) / INCHES_PER_FOOT,
    "132": (2 + 15 / 16) / INCHES_PER_FOOT,
    "133": (2 + 7 / 8) / INCHES_PER_FOOT,
    "136": (2 + 7 / 8) / INCHES_PER_FOOT,
    "140": (2 + 15 / 16) / INCHES_PER_FOOT,
    "141": (3) / INCHES_PER_FOOT
};

// ===== Panel Type Defaults =====

/**
 * Default configurations for each panel type
 * Each panel type has predefined dimensions and rail specifications
 *
 * @constant {Object<string, Object>}
 *
 * @property {string} gageType - Either 'standard' or 'pedestrian'
 * @property {number} panelLength - Length of panel in feet
 * @property {number} gageWidth - Distance between rails in feet
 * @property {number} fieldWidth - Width of field side in feet
 * @property {string} railSize - Rail size designation (e.g., "133")
 * @property {number} fieldRubberWidth - Width of field rubber in feet
 * @property {number} railHeadWidth - Width of rail head in feet
 * @property {number} gageRubberWidth - Width of gage rubber in feet
 */
export const panelDefaults = {
    /**
     * Panel type 0201 - Currently undefined
     */
    "0201": {
        // No defaults defined yet
    },

    /**
     * Panel type 0202 - Currently undefined
     */
    "0202": {
        // No defaults defined yet
    },

    /**
     * Panel type 1301 - Standard gage, 8.125' panels with #133 rail
     */
    "1301": {
        gageType: GAGE_TYPE_STANDARD,
        panelLength: 8.125,
        gageWidth: STANDARD_GAGE_WIDTH_FEET,
        fieldWidth: 27 / INCHES_PER_FOOT,
        railSize: "133",
        fieldRubberWidth: 2.5 / INCHES_PER_FOOT,
        railHeadWidth: (2 + 7 / 8) / INCHES_PER_FOOT,
        gageRubberWidth: 3 / INCHES_PER_FOOT
    },

    /**
     * Panel type 1310 - Pedestrian gage, 10' panels with #115 rail
     */
    "1310": {
        gageType: GAGE_TYPE_PEDESTRIAN,
        panelLength: 10,
        gageWidth: PEDESTRIAN_GAGE_WIDTH_FEET,
        fieldWidth: 18 / INCHES_PER_FOOT,
        railSize: "115",
        fieldRubberWidth: 2.5 / INCHES_PER_FOOT,
        railHeadWidth: (2 + 11 / 16) / INCHES_PER_FOOT,
        gageRubberWidth: 2.5 / INCHES_PER_FOOT
    },

    /**
     * Panel type 1315 - Currently undefined
     */
    "1315": {
        // No defaults defined yet
    }
};

/**
 * Gets the default rail head width for a given rail size
 *
 * @param {string} railSize - The rail size (e.g., "133")
 * @returns {number} The rail head width in feet, or 0 if not found
 */
export function getRailHeadWidthForSize(railSize) {
    return railHeadWidths[railSize] || 0;
}

/**
 * Gets the default configuration for a panel type
 *
 * @param {string} panelType - The panel type (e.g., "1301")
 * @returns {Object|null} The panel configuration object, or null if not found
 */
export function getPanelDefaultConfig(panelType) {
    return panelDefaults[panelType] || null;
}

/**
 * Checks if a panel type has defined defaults
 *
 * @param {string} panelType - The panel type to check
 * @returns {boolean} True if the panel type has defined defaults
 */
export function hasPanelDefaults(panelType) {
    const config = panelDefaults[panelType];
    return config && Object.keys(config).length > 0;
}

/**
 * Gets all available panel types
 *
 * @returns {Array<string>} Array of panel type identifiers
 */
export function getAllPanelTypes() {
    return Object.keys(panelDefaults);
}

/**
 * Gets all available rail sizes
 *
 * @returns {Array<string>} Array of rail size identifiers
 */
export function getAllRailSizes() {
    return Object.keys(railHeadWidths);
}
