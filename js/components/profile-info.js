/**
 * Profile Info Component
 * Renders user profile information
 */

const ProfileInfo = {
    /**
     * Render user profile information
     * @param {object} userData - User data from GraphQL
     */
    render(userData) {
        const container = document.getElementById('userInfoGrid');
        
        if (!container) {
            console.error('User info grid container not found');
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Extract user information
        const userId = userData.id || 'N/A';
        const login = userData.login || 'N/A';
        const campus = userData.campus || 'N/A';
        const createdAt = userData.createdAt ? this.formatDate(userData.createdAt) : 'N/A';
        
        // Parse attrs if it's a JSON string
        let attrs = {};
        if (userData.attrs) {
            try {
                attrs = typeof userData.attrs === 'string' 
                    ? JSON.parse(userData.attrs) 
                    : userData.attrs;
            } catch (e) {
                console.warn('Could not parse user attrs:', e);
            }
        }

        // Create info cards
        const infoCards = [
            {
                label: 'Username',
                value: login,
                icon: '👤'
            },
            {
                label: 'User ID',
                value: userId,
                icon: '🆔'
            },
            {
                label: 'Campus',
                value: campus,
                icon: '🏫'
            },
            {
                label: 'Member Since',
                value: createdAt,
                icon: '📅'
            }
        ];

        // Add email if available in attrs
        if (attrs.email) {
            infoCards.push({
                label: 'Email',
                value: attrs.email,
                icon: '📧'
            });
        }

        // Add phone if available in attrs
        if (attrs.phone) {
            infoCards.push({
                label: 'Phone',
                value: attrs.phone,
                icon: '📱'
            });
        }

        // Render cards
        infoCards.forEach(card => {
            const cardElement = this.createInfoCard(card);
            container.appendChild(cardElement);
        });
    },

    /**
     * Create an info card element
     * @param {object} cardData - Card data {label, value, icon}
     * @returns {HTMLElement} Card element
     */
    createInfoCard(cardData) {
        const card = document.createElement('div');
        card.className = 'user-info-card';
        
        card.innerHTML = `
            <div class="info-icon">${cardData.icon}</div>
            <div class="info-label">${cardData.label}</div>
            <div class="info-value">${cardData.value}</div>
        `;

        // Add animation
        card.style.animation = 'fadeIn 0.5s ease';

        return card;
    },

    /**
     * Format date to readable string
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            return date.toLocaleDateString('en-US', options);
        } catch (e) {
            console.warn('Error formatting date:', e);
            return dateString;
        }
    },

    /**
     * Update a specific info value
     * @param {string} label - Label to update
     * @param {string} value - New value
     */
    updateInfo(label, value) {
        const container = document.getElementById('userInfoGrid');
        if (!container) return;

        const cards = container.querySelectorAll('.user-info-card');
        cards.forEach(card => {
            const cardLabel = card.querySelector('.info-label');
            if (cardLabel && cardLabel.textContent === label) {
                const valueElement = card.querySelector('.info-value');
                if (valueElement) {
                    valueElement.textContent = value;
                }
            }
        });
    },

    /**
     * Show loading state
     */
    showLoading() {
        const container = document.getElementById('userInfoGrid');
        if (!container) return;

        container.innerHTML = `
            <div class="loading-placeholder">
                <div class="loader"></div>
                <p>Loading user information...</p>
            </div>
        `;
    },

    /**
     * Show error state
     * @param {string} message - Error message
     */
    showError(message) {
        const container = document.getElementById('userInfoGrid');
        if (!container) return;

        container.innerHTML = `
            <div class="error-placeholder">
                <div class="error-icon">⚠️</div>
                <p>${message}</p>
            </div>
        `;
    }
};

// Freeze the ProfileInfo object
Object.freeze(ProfileInfo);