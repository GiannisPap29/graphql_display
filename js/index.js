/**
 * Main entry point for index.html
 * Handles routing based on authentication status
 */
(function () {
    // Minimum loading time for better UX (prevents flash)
    const MIN_LOADING_TIME = 500;
    const startTime = Date.now();

    /**
     * Redirect user based on authentication status
     */
    function handleRedirect() {
        try {
            if (Auth.isAuthenticated()) {
                const userData = Auth.getCurrentUser();
                console.log('User authenticated:', userData.username);
                redirectTo('profile.html');
            } else {
                console.log('User not authenticated, redirecting to login');
                redirectTo('login.html');
            }
        } catch (error) {
            console.error('Error during authentication check:', error);
            showError('An error occurred. Please try again.', 'login.html');
        }
    }

    /**
     * Redirect to specified page after minimum loading time
     * @param {string} url - URL to redirect to
     */
    function redirectTo(url) {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed);

        setTimeout(() => {
            window.location.href = url;
        }, remainingTime);
    }

    /**
     * Show error message with retry option
     * @param {string} message - Error message to display
     * @param {string} fallbackUrl - URL to redirect on retry
     */
    function showError(message, fallbackUrl = 'login.html') {
        const loadingScreen = document.getElementById('loadingScreen');

        loadingScreen.innerHTML = `
            <div class="error-container">
                <div class="error-box">
                    <div class="error-icon">⚠️</div>
                    <div class="error-title">Oops! Something went wrong</div>
                    <div class="error-message">${message}</div>
                    <button class="error-button" onclick="window.location.href='${fallbackUrl}'">
                        Continue to Login
                    </button>
                </div>
            </div>
        `;
    }

    

    handleRedirect();
})();
