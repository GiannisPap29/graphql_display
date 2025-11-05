/**
 * Main authentication module
 * Handles login, logout, and authentication state management
 */

const Auth = {
    /**
     * Login with credentials
     * @param {string} identifier - Username or email
     * @param {string} password - User password
     * @returns {Promise<object>} Response object with success status and data
     */
    async login(identifier, password) {
        try {
            // Create Basic Auth credentials
            const credentials = btoa(`${identifier}:${password}`);
            
            // Make POST request to signin endpoint
            const response = await fetch(CONFIG.SIGNIN_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });

            // Check if response is ok
            if (!response.ok) {
                // Handle different error status codes
                if (response.status === 401) {
                    return {
                        success: false,
                        error: 'Invalid credentials. Please check your username/email and password.'
                    };
                } else if (response.status === 403) {
                    return {
                        success: false,
                        error: 'Access forbidden. Your account may be suspended.'
                    };
                } else if (response.status === 500) {
                    return {
                        success: false,
                        error: 'Server error. Please try again later.'
                    };
                } else {
                    return {
                        success: false,
                        error: `Login failed with status: ${response.status}`
                    };
                }
            }

            // Parse the JSON response to get the JWT token
            const data = await response.json();
            
            // The token might be in different fields depending on the API response
            const token = data.token || data.jwt || data.access_token;
            
            if (!token) {
                return {
                    success: false,
                    error: 'No token received from server.'
                };
            }

            // Validate the token
            if (!JWT.isValid(token)) {
                return {
                    success: false,
                    error: 'Received invalid token from server.'
                };
            }

            // Extract user information from token
            const userId = JWT.getUserId(token);
            const username = JWT.getUsername(token) || identifier;

            if (!userId) {
                return {
                    success: false,
                    error: 'Could not extract user ID from token.'
                };
            }

            // Save to localStorage
            Storage.saveToken(token);
            Storage.saveUserId(userId);
            Storage.saveUsername(username);

            // Start token expiry monitoring
            this.startTokenExpiryCheck();

            return {
                success: true,
                data: {
                    token,
                    userId,
                    username
                }
            };

        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: 'Network error. Please check your connection and try again.'
            };
        }
    },

    /**
     * Logout current user
     * Clears all stored authentication data
     */
    logout() {
        // Stop token expiry monitoring
        this.stopTokenExpiryCheck();
        
        // Clear all stored data
        Storage.clearAll();
        
        // Redirect to login page
        window.location.href = 'login.html';
    },

    /**
     * Check if user is currently authenticated
     * @returns {boolean} True if authenticated with valid token
     */
    isAuthenticated() {
        const token = Storage.getToken();
        
        if (!token) {
            return false;
        }

        // Check if token is valid and not expired
        if (!JWT.isValid(token)) {
            // Token is invalid or expired, clear storage
            Storage.clearAll();
            return false;
        }

        return true;
    },

    /**
     * Get current authenticated user data
     * @returns {object|null} User data or null if not authenticated
     */
    getCurrentUser() {
        if (!this.isAuthenticated()) {
            return null;
        }

        return {
            userId: Storage.getUserId(),
            username: Storage.getUsername(),
            token: Storage.getToken()
        };
    },

    /**
     * Require authentication - redirect to login if not authenticated
     * Call this on protected pages
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            // Save current page to redirect back after login
            sessionStorage.setItem('redirect_after_login', window.location.pathname);
            window.location.href = 'login.html';
        }
    },

    /**
     * Redirect to profile if already authenticated
     * Call this on login page
     */
    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            // Check if there's a redirect URL saved
            const redirectUrl = sessionStorage.getItem('redirect_after_login');
            sessionStorage.removeItem('redirect_after_login');
            
            window.location.href = redirectUrl || 'profile.html';
        }
    },

    /**
     * Start monitoring token expiry
     * Automatically logout when token expires
     */
    startTokenExpiryCheck() {
        // Clear any existing interval
        this.stopTokenExpiryCheck();

        // Check token expiry periodically
        this.expiryCheckInterval = setInterval(() => {
            const token = Storage.getToken();
            
            if (!token || JWT.isExpired(token)) {
                console.log('Token expired, logging out...');
                this.logout();
            } else {
                // Log time remaining (for debugging)
                const timeRemaining = JWT.getTimeRemaining(token);
                if (timeRemaining < 300) { // Less than 5 minutes
                    console.warn(`Token expires in ${timeRemaining} seconds`);
                }
            }
        }, CONFIG.TOKEN_EXPIRY_CHECK_INTERVAL);
    },

    /**
     * Stop monitoring token expiry
     */
    stopTokenExpiryCheck() {
        if (this.expiryCheckInterval) {
            clearInterval(this.expiryCheckInterval);
            this.expiryCheckInterval = null;
        }
    },

    /**
     * Get authorization header for API requests
     * @returns {object} Headers object with Authorization
     */
    getAuthHeaders() {
        const token = Storage.getToken();
        
        if (!token) {
            return {};
        }

        return {
            'Authorization': `${CONFIG.AUTH_HEADER_PREFIX} ${token}`,
            'Content-Type': 'application/json'
        };
    },

    /**
     * Refresh token validity check
     * @returns {boolean} True if token is still valid
     */
    refreshTokenCheck() {
        const token = Storage.getToken();
        
        if (!token || !JWT.isValid(token)) {
            this.logout();
            return false;
        }

        return true;
    }
};

// Initialize token expiry check if user is authenticated
if (Auth.isAuthenticated()) {
    Auth.startTokenExpiryCheck();
}

// Freeze the Auth object to prevent modifications
Object.freeze(Auth);