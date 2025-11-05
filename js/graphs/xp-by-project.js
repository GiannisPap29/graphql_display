/**
 * XP by Project Graph
 * Displays XP distribution across projects as a horizontal bar chart
 */

const XPByProject = {
    /**
     * Render XP by project graph
     * @param {Array} transactions - Array of XP transaction objects
     */
    render(transactions) {
        const container = document.getElementById('xpByProjectGraph');
        
        if (!container) {
            console.error('XP by project graph container not found');
            return;
        }

        // Clear container
        SVGBuilder.clearContainer(container);

        // Check if there's data
        if (!transactions || transactions.length === 0) {
            this.showEmptyState(container);
            return;
        }

        // Process data - get top 10 projects
        const topProjects = DataProcessor.getTopProjects(transactions, 10);

        if (topProjects.length === 0) {
            this.showEmptyState(container);
            return;
        }

        // Create the graph
        this.createGraph(container, topProjects);
    },

    /**
     * Create the horizontal bar chart
     * @param {HTMLElement} container - Container element
     * @param {Array} projects - Array of {name, xp} objects
     */
    createGraph(container, projects) {
        // Graph dimensions
        const width = 700;
        const barHeight = 40;
        const barSpacing = 15;
        const graphHeight = projects.length * (barHeight + barSpacing) + 100;
        const padding = { top: 60, right: 100, bottom: 40, left: 200 };
        const graphWidth = width - padding.left - padding.right;

        // Create SVG
        const svg = SVGBuilder.createSVG(width, graphHeight, 'xp-by-project-svg');

        // Create gradient
        const barGradient = SVGBuilder.createLinearGradient(
            'xpProjectGradient',
            [
                { offset: '0%', color: '#667eea' },
                { offset: '100%', color: '#764ba2' }
            ],
            'horizontal'
        );

        const defs = SVGBuilder.createDefs([barGradient]);
        svg.appendChild(defs);

        // Calculate max XP for scaling
        const maxXP = Math.max(...projects.map(p => p.xp));

        // Create main group
        const mainGroup = SVGBuilder.createGroup('main-group', `translate(${padding.left}, ${padding.top})`);
        svg.appendChild(mainGroup);

        // Title
        const title = SVGBuilder.createText(
            'Top Projects by XP',
            graphWidth / 2,
            -30,
            {
                'text-anchor': 'middle',
                'font-size': '18',
                'font-weight': 'bold',
                fill: '#1a202c'
            }
        );
        mainGroup.appendChild(title);

        // Total XP
        const totalXP = projects.reduce((sum, p) => sum + p.xp, 0);
        const subtitle = SVGBuilder.createText(
            `Total XP: ${SVGBuilder.formatNumber(totalXP)}`,
            graphWidth / 2,
            -10,
            {
                'text-anchor': 'middle',
                'font-size': '14',
                fill: '#718096'
            }
        );
        mainGroup.appendChild(subtitle);

        // Draw bars
        const barsGroup = SVGBuilder.createGroup('bars-group');

        projects.forEach((project, index) => {
            const y = index * (barHeight + barSpacing);
            const barWidth = (project.xp / maxXP) * graphWidth;
            const percentage = ((project.xp / totalXP) * 100).toFixed(1);

            // Background bar (for visual depth)
            const bgBar = SVGBuilder.createRect(
                0,
                y,
                graphWidth,
                barHeight,
                {
                    fill: '#f7fafc',
                    rx: 8
                }
            );
            barsGroup.appendChild(bgBar);

            // Actual bar
            const bar = SVGBuilder.createRect(
                0,
                y,
                0, // Start at 0 for animation
                barHeight,
                {
                    fill: 'url(#xpProjectGradient)',
                    rx: 8,
                    cursor: 'pointer',
                    class: 'xp-bar'
                }
            );

            // Add hover effect
            bar.addEventListener('mouseenter', (e) => {
                bar.setAttribute('opacity', '0.8');
                this.showTooltip(e, project.name, project.xp, percentage);
            });
            bar.addEventListener('mouseleave', () => {
                bar.setAttribute('opacity', '1');
                this.hideTooltip();
            });

            // Animate bar width
            const widthAnimate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            widthAnimate.setAttribute('attributeName', 'width');
            widthAnimate.setAttribute('from', 0);
            widthAnimate.setAttribute('to', barWidth);
            widthAnimate.setAttribute('dur', '1s');
            widthAnimate.setAttribute('begin', `${index * 0.1}s`);
            widthAnimate.setAttribute('fill', 'freeze');
            bar.appendChild(widthAnimate);

            barsGroup.appendChild(bar);

            // Project name (left side)
            const nameText = SVGBuilder.createText(
                this.truncateText(project.name, 25),
                -10,
                y + barHeight / 2 + 5,
                {
                    'text-anchor': 'end',
                    'font-size': '13',
                    'font-weight': '600',
                    fill: '#4a5568'
                }
            );
            barsGroup.appendChild(nameText);

            // XP value (right side)
            const valueText = SVGBuilder.createText(
                SVGBuilder.formatNumber(project.xp),
                graphWidth + 10,
                y + barHeight / 2 + 5,
                {
                    'text-anchor': 'start',
                    'font-size': '13',
                    'font-weight': 'bold',
                    fill: '#667eea'
                }
            );
            barsGroup.appendChild(valueText);

            // Rank badge
            const rankBadge = SVGBuilder.createCircle(
                -150,
                y + barHeight / 2,
                12,
                {
                    fill: index < 3 ? '#fbbf24' : '#cbd5e0'
                }
            );
            barsGroup.appendChild(rankBadge);

            const rankText = SVGBuilder.createText(
                (index + 1).toString(),
                -150,
                y + barHeight / 2 + 4,
                {
                    'text-anchor': 'middle',
                    'font-size': '11',
                    'font-weight': 'bold',
                    fill: index < 3 ? '#78350f' : '#4a5568'
                }
            );
            barsGroup.appendChild(rankText);
        });

        mainGroup.appendChild(barsGroup);

        // Add reference line for average
        const avgXP = totalXP / projects.length;
        const avgX = (avgXP / maxXP) * graphWidth;
        
        const avgLine = SVGBuilder.createLine(
            avgX,
            -10,
            avgX,
            projects.length * (barHeight + barSpacing) - barSpacing,
            {
                stroke: '#ed8936',
                'stroke-width': 2,
                'stroke-dasharray': '5,5',
                opacity: 0.6
            }
        );
        mainGroup.appendChild(avgLine);

        const avgLabel = SVGBuilder.createText(
            'Avg',
            avgX,
            -15,
            {
                'text-anchor': 'middle',
                'font-size': '11',
                fill: '#ed8936',
                'font-weight': 'bold'
            }
        );
        mainGroup.appendChild(avgLabel);

        // Add SVG to container
        container.appendChild(svg);

        // Add CSS animations
        this.addAnimations();
    },

    /**
     * Truncate text if too long
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    },

    /**
     * Add CSS animations
     */
    addAnimations() {
        if (!document.getElementById('xp-by-project-animations')) {
            const style = document.createElement('style');
            style.id = 'xp-by-project-animations';
            style.textContent = `
                .xp-bar {
                    transition: opacity 0.2s ease;
                }
            `;
            document.head.appendChild(style);
        }
    },

    /**
     * Show tooltip
     * @param {Event} event - Mouse event
     * @param {string} projectName - Project name
     * @param {number} xp - XP amount
     * @param {string} percentage - Percentage string
     */
    showTooltip(event, projectName, xp, percentage) {
        let tooltip = document.getElementById('xp-project-tooltip');
        
        if (!tooltip) {
            tooltip = SVGBuilder.createTooltip('xp-project-tooltip');
        }

        const content = `
            <div style="font-weight: bold; margin-bottom: 4px;">${projectName}</div>
            <div>XP Earned: ${SVGBuilder.formatNumber(xp)}</div>
            <div>Percentage: ${percentage}%</div>
        `;

        SVGBuilder.showTooltip(tooltip, content, event.pageX, event.pageY);
    },

    /**
     * Hide tooltip
     */
    hideTooltip() {
        const tooltip = document.getElementById('xp-project-tooltip');
        if (tooltip) {
            SVGBuilder.hideTooltip(tooltip);
        }
    },

    /**
     * Show empty state
     * @param {HTMLElement} container - Container element
     */
    showEmptyState(container) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <h3>No Project Data Available</h3>
                <p>Complete projects to see XP distribution!</p>
            </div>
        `;
    }
};

// Freeze the XPByProject object
Object.freeze(XPByProject);