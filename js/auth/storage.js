/**
 * Storage utility for managing authentication tokens and user data
 * Uses localStorage for persistent storage
 */

const Storage = {
    /**
     * Save JWT token to localStorage
     * @param {string} token - JWT token
     */
    saveToken(token) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.JWT_TOKEN, token);
            return true;
        } catch (error) {
            console.error('Error saving token:', error);
            return false;
        }
    },

    /**
     * Get JWT token from localStorage
     * @returns {string|null} JWT token or null if not found
     */
    getToken() {
        try {
            return localStorage.getItem(CONFIG.STORAGE_KEYS.JWT_TOKEN);
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    },

    /**
     * Remove JWT token from localStorage
     */
    removeToken() {
        try {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.JWT_TOKEN);
            return true;
        } catch (error) {
            console.error('Error removing token:', error);
            return false;
        }
    },

    /**
     * Save user ID to localStorage
     * @param {number} userId - User ID
     */
    saveUserId(userId) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.USER_ID, userId.toString());
            return true;
        } catch (error) {
            console.error('Error saving user ID:', error);
            return false;
        }
    },

    /**
     * Get user ID from localStorage
     * @returns {number|null} User ID or null if not found
     */
    getUserId() {
        try {
            const userId = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_ID);
            return userId ? parseInt(userId, 10) : null;
        } catch (error) {
            console.error('Error getting user ID:', error);
            return null;
        }
    },

    /**
     * Save username to localStorage
     * @param {string} username - Username
     */
    saveUsername(username) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.USERNAME, username);
            return true;
        } catch (error) {
            console.error('Error saving username:', error);
            return false;
        }
    },

    /**
     * Get username from localStorage
     * @returns {string|null} Username or null if not found
     */
    getUsername() {
        try {
            return localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME);
        } catch (error) {
            console.error('Error getting username:', error);
            return null;
        }
    },

    /**
     * Clear all authentication data from localStorage
     */
    clearAll() {
        try {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.JWT_TOKEN);
            localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_ID);
            localStorage.removeItem(CONFIG.STORAGE_KEYS.USERNAME);
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    },

    /**
     * Check if user is authenticated (has valid token)
     * @returns {boolean} True if token exists, false otherwise
     */
    isAuthenticated() {
        const token = this.getToken();
        return token !== null && token !== '';
    },

    /**
     * Get all stored authentication data
     * @returns {object} Object containing all auth data
     */
    getAllAuthData() {
        return {
            token: this.getToken(),
            userId: this.getUserId(),
            username: this.getUsername()
        };
    }
};

// Freeze the Storage object to prevent modifications
Object.freeze(Storage);