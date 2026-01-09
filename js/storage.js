/**
 * storage.js - Safe localStorage Wrapper
 *
 * Provides graceful fallback when localStorage is unavailable (private browsing,
 * disabled storage, quota exceeded, etc.). Uses in-memory storage as fallback.
 *
 * @module storage
 */

/**
 * Safe localStorage wrapper with memory fallback
 * Handles disabled localStorage, quota exceeded, and security errors
 *
 * @class SafeStorage
 */
export class SafeStorage {
    /**
     * Creates a new SafeStorage instance
     * Tests localStorage availability and sets up memory fallback
     */
    constructor() {
        this.isAvailable = this._checkAvailability();
        this.memoryFallback = new Map();

        if (!this.isAvailable) {
            console.warn('localStorage unavailable - using in-memory storage (data will not persist across page reloads)');
        }
    }

    /**
     * Tests if localStorage is available and working
     *
     * @private
     * @returns {boolean} True if localStorage is available
     */
    _checkAvailability() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            return retrieved === 'test';
        } catch (e) {
            // Could be SecurityError, QuotaExceededError, or localStorage disabled
            return false;
        }
    }

    /**
     * Gets item from storage with fallback to default value
     *
     * @param {string} key - The storage key
     * @param {*} defaultValue - Default value if key doesn't exist (default: null)
     * @returns {string|null} The stored value or default
     */
    getItem(key, defaultValue = null) {
        try {
            if (this.isAvailable) {
                const value = localStorage.getItem(key);
                return value !== null ? value : defaultValue;
            }
            // Fallback to memory
            return this.memoryFallback.get(key) ?? defaultValue;
        } catch (error) {
            console.warn(`Storage read failed for key "${key}":`, error.message);
            return this.memoryFallback.get(key) ?? defaultValue;
        }
    }

    /**
     * Sets item in storage with fallback to memory
     *
     * @param {string} key - The storage key
     * @param {string} value - The value to store
     * @returns {boolean} True if successfully saved to localStorage
     */
    setItem(key, value) {
        let success = false;

        // Try localStorage first
        if (this.isAvailable) {
            try {
                localStorage.setItem(key, value);
                success = true;
            } catch (error) {
                console.warn(`Storage write failed for key "${key}":`, error.message);
                // Could be QuotaExceededError - continue to memory fallback
            }
        }

        // Always save to memory fallback
        this.memoryFallback.set(key, value);

        return success;
    }

    /**
     * Removes item from storage
     *
     * @param {string} key - The storage key to remove
     */
    removeItem(key) {
        if (this.isAvailable) {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.warn(`Storage removal failed for key "${key}":`, error.message);
            }
        }
        this.memoryFallback.delete(key);
    }

    /**
     * Clears all items from storage
     */
    clear() {
        if (this.isAvailable) {
            try {
                localStorage.clear();
            } catch (error) {
                console.warn('Storage clear failed:', error.message);
            }
        }
        this.memoryFallback.clear();
    }

    /**
     * Gets the number of items in storage
     *
     * @returns {number} Number of stored items
     */
    get length() {
        if (this.isAvailable) {
            try {
                return localStorage.length;
            } catch (error) {
                console.warn('Storage length check failed:', error.message);
            }
        }
        return this.memoryFallback.size;
    }

    /**
     * Gets key at specific index (for iteration)
     *
     * @param {number} index - The index
     * @returns {string|null} The key at that index, or null
     */
    key(index) {
        if (this.isAvailable) {
            try {
                return localStorage.key(index);
            } catch (error) {
                console.warn('Storage key retrieval failed:', error.message);
            }
        }
        const keys = Array.from(this.memoryFallback.keys());
        return keys[index] || null;
    }
}

/**
 * Singleton instance of SafeStorage
 * Import this to use throughout the application
 *
 * @example
 * import { storage } from './storage.js';
 * storage.setItem('theme', 'dark');
 * const theme = storage.getItem('theme', 'light');
 */
export const storage = new SafeStorage();
