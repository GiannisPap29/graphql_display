/**
 * JWT utility for parsing and validating JWT tokens
 */

const JWT = {
    /**
     * Decode JWT token (without verification)
     * @param {string} token - JWT token
     * @returns {object|null} Decoded payload or null if invalid
     */
    decode(token) {
        try {
            if (!token || typeof token !== 'string') {
                return null;
            }

            // JWT has 3 parts: header.payload.signature
            const parts = token.split('.');
            
            if (parts.length !== 3) {
                console.error('Invalid JWT format');
                return null;
            }

            // Decode the payload (second part)
            const payload = parts[1];
            
            // Replace URL-safe characters
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            
            // Decode base64
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    },

    /**
     * Get user ID from JWT token
     * @param {string} token - JWT token
     * @returns {number|null} User ID or null if not found
     */
    getUserId(token) {
        const payload = this.decode(token);
        if (!payload) {
            return null;
        }

        // The JWT payload structure from Hasura typically contains:
        // { "sub": "user_id", "https://hasura.io/jwt/claims": { "x-hasura-user-id": "123" } }
        
        // Try different possible locations for user ID
        if (payload.sub) {
            return parseInt(payload.sub, 10);
        }
        
        if (payload['https://hasura.io/jwt/claims']) {
            const claims = payload['https://hasura.io/jwt/claims'];
            if (claims['x-hasura-user-id']) {
                return parseInt(claims['x-hasura-user-id'], 10);
            }
        }

        if (payload.userId) {
            return parseInt(payload.userId, 10);
        }

        return null;
    },

    /**
     * Get username from JWT token
     * @param {string} token - JWT token
     * @returns {string|null} Username or null if not found
     */
    getUsername(token) {
        const payload = this.decode(token);
        if (!payload) {
            return null;
        }

        // Try different possible locations for username
        if (payload['https://hasura.io/jwt/claims']) {
            const claims = payload['https://hasura.io/jwt/claims'];
            if (claims['x-hasura-default-role']) {
                return claims['x-hasura-default-role'];
            }
        }

        if (payload.username) {
            return payload.username;
        }

        if (payload.name) {
            return payload.name;
        }

        return null;
    },

    /**
     * Check if JWT token is expired
     * @param {string} token - JWT token
     * @returns {boolean} True if expired, false otherwise
     */
    isExpired(token) {
        const payload = this.decode(token);
        if (!payload || !payload.exp) {
            return true;
        }

        // exp is in seconds, Date.now() is in milliseconds
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();

        return currentTime >= expirationTime;
    },

    /**
     * Get expiration date from JWT token
     * @param {string} token - JWT token
     * @returns {Date|null} Expiration date or null if not found
     */
    getExpirationDate(token) {
        const payload = this.decode(token);
        if (!payload || !payload.exp) {
            return null;
        }

        return new Date(payload.exp * 1000);
    },

    /**
     * Get time remaining until token expires (in seconds)
     * @param {string} token - JWT token
     * @returns {number|null} Seconds remaining or null if invalid
     */
    getTimeRemaining(token) {
        const payload = this.decode(token);
        if (!payload || !payload.exp) {
            return null;
        }

        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        const remaining = expirationTime - currentTime;

        return remaining > 0 ? Math.floor(remaining / 1000) : 0;
    },

    /**
     * Validate JWT token
     * @param {string} token - JWT token
     * @returns {boolean} True if valid and not expired
     */
    isValid(token) {
        if (!token || typeof token !== 'string') {
            return false;
        }

        const payload = this.decode(token);
        if (!payload) {
            return false;
        }

        // Check if token is expired
        if (this.isExpired(token)) {
            return false;
        }

        return true;
    },

    /**
     * Get all claims from JWT token
     * @param {string} token - JWT token
     * @returns {object|null} All claims or null if invalid
     */
    getClaims(token) {
        return this.decode(token);
    }
};

// Freeze the JWT object to prevent modifications
Object.freeze(JWT);