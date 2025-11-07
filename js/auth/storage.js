/**
 * Storage Module - Cookie-based JWT Storage
 * Uses cookies with Secure and SameSite flags for better security
 * 
 * Note: HttpOnly flag cannot be set from client-side JavaScript.
 * For true HttpOnly security, you would need a backend server.
 */

const Storage = {
    /**
     * Cookie configuration
     */
    COOKIE_CONFIG: {
        JWT_TOKEN: 'zone01_jwt_token',
        USER_ID: 'zone01_user_id',
        USERNAME: 'zone01_username',
        MAX_AGE: 86400, // 24 hours in seconds
        PATH: '/',
        SECURE: window.location.protocol === 'https:', // Only true on HTTPS
        SAMESITE: 'Strict' // CSRF protection
    },

    /**
     * Set a cookie with security flags
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {number} maxAge - Max age in seconds (optional)
     */
    setCookie(name, value, maxAge = this.COOKIE_CONFIG.MAX_AGE) {
        try {
            let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
            cookie += `; max-age=${maxAge}`;
            cookie += `; path=${this.COOKIE_CONFIG.PATH}`;
            cookie += `; SameSite=${this.COOKIE_CONFIG.SAMESITE}`;
            
            // Only set Secure flag on HTTPS
            if (this.COOKIE_CONFIG.SECURE) {
                cookie += '; Secure';
            }

            document.cookie = cookie;
            return true;
        } catch (error) {
            console.error('Error setting cookie:', error);
            return false;
        }
    },

    /**
     * Get a cookie value
     * @param {string} name - Cookie name
     * @returns {string|null} Cookie value or null
     */
    getCookie(name) {
        try {
            const nameEQ = encodeURIComponent(name) + '=';
            const cookies = document.cookie.split(';');
            
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.indexOf(nameEQ) === 0) {
                    return decodeURIComponent(cookie.substring(nameEQ.length));
                }
            }
            return null;
        } catch (error) {
            console.error('Error getting cookie:', error);
            return null;
        }
    },

    /**
     * Delete a cookie
     * @param {string} name - Cookie name
     */
    deleteCookie(name) {
        try {
            // Set expiration to past date
            document.cookie = `${encodeURIComponent(name)}=; max-age=0; path=${this.COOKIE_CONFIG.PATH}`;
            return true;
        } catch (error) {
            console.error('Error deleting cookie:', error);
            return false;
        }
    },

    /**
     * Save JWT token to cookie
     * @param {string} token - JWT token
     */
    saveToken(token) {
        return this.setCookie(this.COOKIE_CONFIG.JWT_TOKEN, token);
    },

    /**
     * Get JWT token from cookie
     * @returns {string|null} JWT token or null
     */
    getToken() {
        return this.getCookie(this.COOKIE_CONFIG.JWT_TOKEN);
    },

    /**
     * Remove JWT token cookie
     */
    removeToken() {
        return this.deleteCookie(this.COOKIE_CONFIG.JWT_TOKEN);
    },

    /**
     * Save user ID to cookie
     * @param {number} userId - User ID
     */
    saveUserId(userId) {
        return this.setCookie(this.COOKIE_CONFIG.USER_ID, userId.toString());
    },

    /**
     * Get user ID from cookie
     * @returns {number|null} User ID or null
     */
    getUserId() {
        const userId = this.getCookie(this.COOKIE_CONFIG.USER_ID);
        return userId ? parseInt(userId, 10) : null;
    },

    /**
     * Save username to cookie
     * @param {string} username - Username
     */
    saveUsername(username) {
        return this.setCookie(this.COOKIE_CONFIG.USERNAME, username);
    },

    /**
     * Get username from cookie
     * @returns {string|null} Username or null
     */
    getUsername() {
        return this.getCookie(this.COOKIE_CONFIG.USERNAME);
    },

    /**
     * Clear all authentication cookies
     */
    clear() {
        try {
            this.removeToken();
            this.deleteCookie(this.COOKIE_CONFIG.USER_ID);
            this.deleteCookie(this.COOKIE_CONFIG.USERNAME);
            return true;
        } catch (error) {
            console.error('Error clearing cookies:', error);
            return false;
        }
    },

    /**
     * Check if user is authenticated (has valid token cookie)
     * @returns {boolean} True if token exists
     */
    isAuthenticated() {
        const token = this.getToken();
        return !!token;
    },

    /**
     * Migration utility: Move data from localStorage to cookies
     * Call this once to migrate existing users
     */
    migrateFromLocalStorage() {
        try {
            // Check if localStorage has old data
            const oldToken = localStorage.getItem('jwt_token');
            const oldUserId = localStorage.getItem('user_id');
            const oldUsername = localStorage.getItem('username');

            if (oldToken) {
                this.saveToken(oldToken);
                console.log('✅ Migrated JWT token to cookie');
            }

            if (oldUserId) {
                this.saveUserId(parseInt(oldUserId, 10));
                console.log('✅ Migrated user ID to cookie');
            }

            if (oldUsername) {
                this.saveUsername(oldUsername);
                console.log('✅ Migrated username to cookie');
            }

            // Clean up localStorage
            if (oldToken || oldUserId || oldUsername) {
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('user_id');
                localStorage.removeItem('username');
                console.log('✅ Cleaned up localStorage');
            }

            return true;
        } catch (error) {
            console.error('Error migrating from localStorage:', error);
            return false;
        }
    }
};

// Auto-migrate on first load (only runs once if localStorage has data)
if (typeof window !== 'undefined') {
    Storage.migrateFromLocalStorage();
}

// Expose to window
window.Storage = Storage;

// Freeze the Storage object
Object.freeze(Storage);