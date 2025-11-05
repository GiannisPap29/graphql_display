/**
 * Stats Card Component
 * Renders statistics cards with icons and values
 */

const StatsCard = {
    /**
     * Render all statistics cards
     * @param {object} stats - Statistics data
     */
    renderAll(stats) {
        const container = document.getElementById('statsGrid');
        
        if (!container) {
            console.error('Stats grid container not found');
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Calculate derived statistics
        const totalXP = stats.totalXP || 0;
        const auditsDone = stats.auditsDone || 0;
        const auditsReceived = stats.auditsReceived || 0;
        const projectsPassed = stats.projectsPassed || 0;
        const projectsFailed = stats.projectsFailed || 0;
        const totalProjects = projectsPassed + projectsFailed;
        
        // Calculate audit ratio
        const auditRatio = auditsReceived > 0 
            ? (auditsDone / auditsReceived).toFixed(2) 
            : '0.00';
        
        // Calculate success rate
        const successRate = totalProjects > 0 
            ? ((projectsPassed / totalProjects) * 100).toFixed(1) 
            : '0.0';

        // Define stat cards
        const statCards = [
            {
                icon: '⚡',
                iconType: 'primary',
                label: 'Total XP',
                value: this.formatNumber(totalXP),
                subtitle: 'Experience Points Earned'
            },
            {
                icon: '✅',
                iconType: 'success',
                label: 'Projects Passed',
                value: projectsPassed,
                subtitle: `${successRate}% success rate`
            },
            {
                icon: '👥',
                iconType: 'info',
                label: 'Audits Done',
                value: auditsDone,
                subtitle: `${auditsReceived} received`
            },
            {
                icon: '📊',
                iconType: 'warning',
                label: 'Audit Ratio',
                value: auditRatio,
                subtitle: auditRatio >= 1 ? 'Good ratio!' : 'Need more audits'
            }
        ];

        // Render each card
        statCards.forEach((card, index) => {
            const cardElement = this.createCard(card, index);
            container.appendChild(cardElement);
        });
    },

    /**
     * Create a stat card element
     * @param {object} cardData - Card data
     * @param {number} index - Card index for animation delay
     * @returns {HTMLElement} Card element
     */
    createCard(cardData, index = 0) {
        const card = document.createElement('div');
        card.className = 'stat-card';
        
        // Add animation delay
        card.style.animation = `fadeIn 0.5s ease ${index * 0.1}s backwards`;

        card.innerHTML = `
            <div class="stat-icon ${cardData.iconType}">
                ${cardData.icon}
            </div>
            <div class="stat-label">${cardData.label}</div>
            <div class="stat-value">${cardData.value}</div>
            <div class="stat-subtitle">${cardData.subtitle}</div>
        `;

        return card;
    },

    /**
     * Format large numbers with commas
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    formatNumber(num) {
        if (num === null || num === undefined) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Update a specific stat card
     * @param {string} label - Card label to update
     * @param {string|number} value - New value
     */
    updateCard(label, value) {
        const container = document.getElementById('statsGrid');
        if (!container) return;

        const cards = container.querySelectorAll('.stat-card');
        cards.forEach(card => {
            const cardLabel = card.querySelector('.stat-label');
            if (cardLabel && cardLabel.textContent === label) {
                const valueElement = card.querySelector('.stat-value');
                if (valueElement) {
                    valueElement.textContent = this.formatNumber(value);
                    
                    // Add pulse animation
                    card.classList.add('pulse');
                    setTimeout(() => card.classList.remove('pulse'), 500);
                }
            }
        });
    },

    /**
     * Create a custom stat card
     * @param {object} cardData - Custom card data
     * @returns {HTMLElement} Card element
     */
    createCustomCard(cardData) {
        return this.createCard({
            icon: cardData.icon || '📈',
            iconType: cardData.iconType || 'primary',
            label: cardData.label || 'Stat',
            value: cardData.value || '0',
            subtitle: cardData.subtitle || ''
        });
    },

    /**
     * Add a custom card to the grid
     * @param {object} cardData - Custom card data
     */
    addCustomCard(cardData) {
        const container = document.getElementById('statsGrid');
        if (!container) return;

        const card = this.createCustomCard(cardData);
        container.appendChild(card);
    },

    /**
     * Show loading state
     */
    showLoading() {
        const container = document.getElementById('statsGrid');
        if (!container) return;

        container.innerHTML = `
            <div class="loading-placeholder" style="grid-column: 1 / -1;">
                <div class="loader"></div>
                <p>Loading statistics...</p>
            </div>
        `;
    },

    /**
     * Show error state
     * @param {string} message - Error message
     */
    showError(message) {
        const container = document.getElementById('statsGrid');
        if (!container) return;

        container.innerHTML = `
            <div class="error-placeholder" style="grid-column: 1 / -1;">
                <div class="error-icon">⚠️</div>
                <p>${message}</p>
            </div>
        `;
    },

    /**
     * Calculate percentage
     * @param {number} value - Current value
     * @param {number} total - Total value
     * @returns {string} Percentage string
     */
    calculatePercentage(value, total) {
        if (total === 0) return '0.0';
        return ((value / total) * 100).toFixed(1);
    },

    /**
     * Format ratio
     * @param {number} numerator - Top number
     * @param {number} denominator - Bottom number
     * @returns {string} Ratio string
     */
    formatRatio(numerator, denominator) {
        if (denominator === 0) return '0.00';
        return (numerator / denominator).toFixed(2);
    }
};

// Add pulse animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .stat-card.pulse {
        animation: pulse 0.5s ease;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Freeze the StatsCard object
Object.freeze(StatsCard);