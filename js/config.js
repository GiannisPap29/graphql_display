/**
 * Configuration file for API endpoints and application constants
 */

const CONFIG = {
    // API Endpoints
    API_BASE_URL: 'https://platform.zone01.gr',
    SIGNIN_ENDPOINT: 'https://platform.zone01.gr/api/auth/signin',
    GRAPHQL_ENDPOINT: 'https://platform.zone01.gr/api/graphql-engine/v1/graphql',
    
    // Local Storage Keys
    STORAGE_KEYS: {
        JWT_TOKEN: 'jwt_token',
        USER_ID: 'user_id',
        USERNAME: 'username'
    },
  
   USE_CORS_PROXY: true,

    CORS_PROXY: 'https://corsproxy.io/?',
    CORS_PROXY_ENCODE_URI: true,
    CORS_PROXY_HEADERS: {},

    // Authentication
    AUTH_HEADER_PREFIX: 'Bearer',
    
    // Application Settings
    TOKEN_EXPIRY_CHECK_INTERVAL: 60000, // Check token expiry every 60 seconds
    
    // GraphQL Settings
    GRAPHQL_BATCH_SIZE: 200, // Max items per query
    
    // UI Settings
    ANIMATION_DURATION: 400, // milliseconds
    TOAST_DURATION: 3000, // milliseconds for notifications

    /**
     * Apply optional CORS proxy to an endpoint when enabled
     * @param {string} endpoint - Base endpoint URL
     * @returns {string} Endpoint with proxy applied if configured
     */
    applyProxy(endpoint) {
        if (this.USE_CORS_PROXY && this.CORS_PROXY) {
            if (this.CORS_PROXY_ENCODE_URI) {
                const encodedEndpoint = encodeURIComponent(endpoint);
                return `${this.CORS_PROXY}${encodedEndpoint}`;
            }
            return `${this.CORS_PROXY}${endpoint}`;
        }
        return endpoint;
    },

    /**
     * Get the signin endpoint respecting proxy settings
     * @returns {string} Signin endpoint URL
     */
    getSigninEndpoint() {
        return this.applyProxy(this.SIGNIN_ENDPOINT);
    },

    /**
     * Get the GraphQL endpoint respecting proxy settings
     * @returns {string} GraphQL endpoint URL
     */
    getGraphQLEndpoint() {
        return this.applyProxy(this.GRAPHQL_ENDPOINT);
    },

    /**
     * Get additional headers needed when using a proxy
     * @returns {object} Proxy specific headers
     */
    getProxyHeaders() {
        if (this.USE_CORS_PROXY && this.CORS_PROXY_HEADERS) {
            return this.CORS_PROXY_HEADERS;
        }
        return {};
    }
};

// Freeze the config to prevent modifications
Object.freeze(CONFIG);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}