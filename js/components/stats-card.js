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
    createCard(cardData, index) {
        const card = document.createElement('div');
        card.className = `stat-card stat-card-${cardData.iconType}`;
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="stat-icon-container">
                <div class="stat-icon-bg"></div>
                <div class="stat-icon">${cardData.icon || '📈'}</div>
            </div>
            <div class="stat-content">
                <div class="stat-label">${cardData.label}</div>
                <div class="stat-value">${cardData.value}</div>
                <div class="stat-subtitle">${cardData.subtitle}</div>
            </div>
        `;
        
        return card;
    },

    /**
     * Format large numbers with commas
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
};

// Add styles dynamically
const style = document.createElement('style');
style.textContent = `
    .stat-card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        animation: slideUp 0.5s ease-out both;
        display: flex;
        gap: 20px;
        align-items: center;
    }

    .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .stat-icon-container {
        position: relative;
        flex-shrink: 0;
    }

    .stat-icon-bg {
        position: absolute;
        width: 60px;
        height: 60px;
        border-radius: 12px;
        opacity: 0.1;
    }

    .stat-icon {
        position: relative;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
    }

    .stat-content {
        flex: 1;
    }

    .stat-label {
        font-size: 14px;
        font-weight: 600;
        color: #718096;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .stat-value {
        font-size: 32px;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 4px;
    }

    .stat-subtitle {
        font-size: 13px;
        color: #a0aec0;
    }

    .stat-card-primary .stat-icon-bg {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .stat-card-success .stat-icon-bg {
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    }

    .stat-card-info .stat-icon-bg {
        background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
    }

    .stat-card-warning .stat-icon-bg {
        background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .stat-card {
            padding: 16px;
            gap: 12px;
        }

        .stat-icon-bg,
        .stat-icon {
            width: 48px;
            height: 48px;
        }

        .stat-icon {
            font-size: 24px;
        }

        .stat-value {
            font-size: 24px;
        }
    }
`;
document.head.appendChild(style);

// Expose to window
window.StatsCard = StatsCard;

// Freeze the StatsCard object
Object.freeze(StatsCard);