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
        card.className = 'info-card';
        
        card.innerHTML = `
            <div class="info-icon">${cardData.icon}</div>
            <div class="info-content">
                <div class="info-label">${cardData.label}</div>
                <div class="info-value">${cardData.value}</div>
            </div>
        `;
        
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
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        } catch (e) {
            return dateString;
        }
    }
};

// Expose to window
window.ProfileInfo = ProfileInfo;

// Freeze the ProfileInfo object
Object.freeze(ProfileInfo);