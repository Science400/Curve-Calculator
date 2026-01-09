/**
 * main.js - Application Entry Point
 *
 * Initializes the Curve Calculator application with error handling.
 * Coordinates state, settings, storage, and event listeners.
 *
 * @module main
 * @author Isaiah Young
 * @version 2.0
 */

import { createAppState } from './state.js';
import { createSettingsManager } from './settings.js';
import { setupEventListeners } from './events.js';
import { updateCompareColumnVisibility, updateAllAutoIndicators } from './dom.js';
import { storage } from './storage.js';
import { STORAGE_KEY_COMPARE_COLUMN } from './constants.js';

/**
 * Initializes the compare column visibility from localStorage
 *
 * @param {Object} state - Application state
 */
function initializeCompareColumnToggle(state) {
    try {
        const savedState = storage.getItem(STORAGE_KEY_COMPARE_COLUMN, 'false');
        state.isCompareColumnVisible = savedState === 'true';

        updateCompareColumnVisibility(
            state.isCompareColumnVisible,
            state.inputElements.compareColumn,
            state.inputElements.calculationsRow,
            state.inputElements.compareColumnToggle
        );
    } catch (error) {
        console.warn('Failed to initialize compare column toggle:', error);
        state.isCompareColumnVisible = false;
    }
}

/**
 * Initializes the application
 *
 * Sets up state, settings, storage, DOM, and event listeners
 */
async function initializeApp() {
    try {
        console.log('🚀 Initializing Curve Calculator...');

        // Create and initialize application state
        const state = createAppState();
        state.initialize();

        console.log('✅ State initialized');

        // Create settings manager
        const settingsManager = createSettingsManager(
            state.inputElements,
            state.autoManagedElements
        );

        console.log('✅ Settings manager created');

        // Build dropdown options
        settingsManager.buildPanelTypeOptions();
        settingsManager.buildRailSizeOptions();

        console.log('✅ Dropdown options populated');

        // Set default rail size
        settingsManager.setRailSize("133");

        // Apply initial panel defaults
        const initialPanelType = settingsManager.getPanelType();
        settingsManager.applyPanelTypeDefaults(initialPanelType);

        console.log('✅ Panel defaults applied');

        // Initialize auto-managed field indicators
        updateAllAutoIndicators(
            settingsManager.autoManagedFields,
            state.autoManagedElements
        );

        console.log('✅ Auto indicators initialized');

        // Initialize compare column toggle from storage
        initializeCompareColumnToggle(state);

        console.log('✅ Compare column initialized');

        // Setup all event listeners
        setupEventListeners(state, settingsManager);

        console.log('✅ Event listeners registered');

        console.log('🎉 Curve Calculator initialized successfully!');

    } catch (error) {
        console.error('❌ Application initialization failed:', error);

        // Display fatal error to user
        displayFatalError(error);
    }
}

/**
 * Displays a fatal error message to the user
 *
 * @param {Error} error - The error that occurred
 */
function displayFatalError(error) {
    const errorHTML = `
        <div style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #dc3545;
            color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            max-width: 500px;
            font-family: system-ui, -apple-system, sans-serif;
        ">
            <h3 style="margin: 0 0 10px 0;">⚠️ Application Error</h3>
            <p style="margin: 0 0 10px 0;">
                The Curve Calculator failed to initialize. Please refresh the page to try again.
            </p>
            <details style="margin-top: 10px;">
                <summary style="cursor: pointer; font-weight: bold;">Technical Details</summary>
                <pre style="
                    margin: 10px 0 0 0;
                    padding: 10px;
                    background: rgba(0,0,0,0.2);
                    border-radius: 4px;
                    font-size: 12px;
                    overflow: auto;
                ">${error.message}\n\n${error.stack || ''}</pre>
            </details>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', errorHTML);
}

/**
 * Global error handler
 *
 * Catches unhandled errors and prevents application crashes
 */
window.addEventListener('error', function(event) {
    console.error('Unhandled error:', event.error);

    // Prevent default browser error handling
    event.preventDefault();

    // Log to console with context
    console.error('Error details:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

/**
 * Global unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);

    // Prevent default browser handling
    event.preventDefault();

    // Log to console
    console.error('Rejection details:', {
        reason: event.reason,
        promise: event.promise
    });
});

/**
 * Initialize when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM already loaded
    initializeApp();
}

/**
 * Color Scheme Management
 * Handles light/dark/system theme preferences with localStorage persistence
 */
import { STORAGE_KEY_COLOR_SCHEME, DEFAULT_COLOR_SCHEME } from './constants.js';

const selectedColorScheme = storage.getItem(STORAGE_KEY_COLOR_SCHEME, DEFAULT_COLOR_SCHEME);

/**
 * Applies the selected color scheme to the document
 *
 * @param {string} scheme - The color scheme to apply ('light', 'dark', or 'light dark' for system)
 */
const applyScheme = (scheme) => {
    try {
        storage.setItem(STORAGE_KEY_COLOR_SCHEME, scheme);
        document.documentElement.style.setProperty('color-scheme', scheme);

        const radio = document.querySelector(`[name="color-scheme"][value="${scheme}"]`);
        if (radio) {
            radio.checked = true;
        }
    } catch (error) {
        console.warn('Failed to apply color scheme:', error);
    }
};

// Apply saved color scheme on page load
applyScheme(selectedColorScheme);

// Listen for color scheme changes
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[name="color-scheme"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            applyScheme(e.target.value);
        });
    });
});
