/**
 * Login page logic
 */
(function () {
    // Redirect if user already authenticated
    Auth.redirectIfAuthenticated();

    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const identifierInput = document.getElementById('identifier');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const buttonText = loginButton.querySelector('.button-text');
    const buttonLoader = loginButton.querySelector('.button-loader');
    const errorMessage = document.getElementById('errorMessage');

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear any previous error messages
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';

        // Get form values
        const identifier = identifierInput.value.trim();
        const password = passwordInput.value;

        // Basic validation
        if (!identifier || !password) {
            showError('Please enter both username/email and password');
            return;
        }

        // Disable form during login
        setLoading(true);

        try {
            // Attempt login
            const result = await Auth.login(identifier, password);

            if (result.success) {
                window.location.href = 'profile.html';
            } else {
                showError(result.error || 'Login failed. Please try again.');
                setLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    });

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';

        // Add shake animation
        errorMessage.classList.add('shake');
        setTimeout(() => {
            errorMessage.classList.remove('shake');
        }, 500);
    }

    /**
     * Set loading state for form
     * @param {boolean} loading - True to show loading state
     */
    function setLoading(loading) {
        if (loading) {
            loginButton.disabled = true;
            buttonText.style.display = 'none';
            buttonLoader.style.display = 'inline-block';
            identifierInput.disabled = true;
            passwordInput.disabled = true;
        } else {
            loginButton.disabled = false;
            buttonText.style.display = 'inline-block';
            buttonLoader.style.display = 'none';
            identifierInput.disabled = false;
            passwordInput.disabled = false;
        }
    }

    // Clear error message when user starts typing
    identifierInput.addEventListener('input', () => {
        if (errorMessage.style.display === 'block') {
            errorMessage.style.display = 'none';
        }
    });

    passwordInput.addEventListener('input', () => {
        if (errorMessage.style.display === 'block') {
            errorMessage.style.display = 'none';
        }
    });

    // Focus on identifier input on page load
    window.addEventListener('load', () => {
        identifierInput.focus();
    });
})();
