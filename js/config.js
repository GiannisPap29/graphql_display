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
    
    // Authentication
    AUTH_HEADER_PREFIX: 'Bearer',
    
    // Application Settings
    TOKEN_EXPIRY_CHECK_INTERVAL: 60000, // Check token expiry every 60 seconds
    
    // GraphQL Settings
    GRAPHQL_BATCH_SIZE: 100, // Max items per query
    
    // UI Settings
    ANIMATION_DURATION: 300, // milliseconds
    TOAST_DURATION: 3000, // milliseconds for notifications
};

// Freeze the config to prevent modifications
Object.freeze(CONFIG);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}