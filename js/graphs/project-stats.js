/**
 * Project Stats Graph
 * Displays project pass/fail statistics as a bar chart
 */

const ProjectStats = {
    /**
     * Render project stats graph
     * @param {object} data - Project data with passed and failed counts
     */
    render(data) {
        const container = document.getElementById('projectStatsGraph');
        
        if (!container) {
            console.error('Project stats graph container not found');
            return;
        }

        // Clear container
        SVGBuilder.clearContainer(container);

        // Extract data
        const passed = data?.passed?.aggregate?.count || 0;
        const failed = data?.failed?.aggregate?.count || 0;

        // Check if there's data
        if (passed === 0 && failed === 0) {
            this.showEmptyState(container);
            return;
        }

        // Create the graph
        this.createGraph(container, passed, failed);
    },

    /**
     * Create the bar chart
     * @param {HTMLElement} container - Container element
     * @param {number} passed - Number of passed projects
     * @param {number} failed - Number of failed projects
     */
    createGraph(container, passed, failed) {
        // Graph dimensions
        const width = 600;
        const height = 400;
        const padding = { top: 60, right: 40, bottom: 80, left: 80 };
        const graphWidth = width - padding.left - padding.right;
        const graphHeight = height - padding.top - padding.bottom;

        // Create SVG
        const svg = SVGBuilder.createSVG(width, height, 'project-stats-svg');

        // Create gradients
        const passGradient = SVGBuilder.createLinearGradient(
            'passGradient',
            [
                { offset: '0%', color: '#48bb78' },
                { offset: '100%', color: '#38a169' }
            ],
            'vertical'
        );

        const failGradient = SVGBuilder.createLinearGradient(
            'failGradient',
            [
                { offset: '0%', color: '#f56565' },
                { offset: '100%', color: '#e53e3e' }
            ],
            'vertical'
        );

        const defs = SVGBuilder.createDefs([passGradient, failGradient]);
        svg.appendChild(defs);

        // Calculate statistics
        const total = passed + failed;
        const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
        const failRate = total > 0 ? ((failed / total) * 100).toFixed(1) : 0;
        const maxValue = Math.max(passed, failed);

        // Create main group
        const mainGroup = SVGBuilder.createGroup('main-group', `translate(${padding.left}, ${padding.top})`);
        svg.appendChild(mainGroup);

        // Draw grid lines
        const gridGroup = SVGBuilder.createGroup('grid-group');
        const yTicks = 5;
        for (let i = 0; i <= yTicks; i++) {
            const y = graphHeight - (i * graphHeight / yTicks);
            const line = SVGBuilder.createLine(0, y, graphWidth, y, {
                stroke: '#e2e8f0',
                'stroke-width': 1,
                'stroke-dasharray': '4,4'
            });
            gridGroup.appendChild(line);
        }
        mainGroup.appendChild(gridGroup);

        // Draw axes
        const xAxis = SVGBuilder.createLine(0, graphHeight, graphWidth, graphHeight, {
            stroke: '#4a5568',
            'stroke-width': 2
        });
        const yAxis = SVGBuilder.createLine(0, 0, 0, graphHeight, {
            stroke: '#4a5568',
            'stroke-width': 2
        });
        mainGroup.appendChild(xAxis);
        mainGroup.appendChild(yAxis);

        // Y-axis labels
        const yLabelGroup = SVGBuilder.createGroup('y-labels');
        for (let i = 0; i <= yTicks; i++) {
            const value = Math.round((maxValue / yTicks) * i);
            const y = graphHeight - (i * graphHeight / yTicks);
            const label = SVGBuilder.createText(
                value.toString(),
                -10,
                y + 4,
                { 'text-anchor': 'end', 'font-size': '12', fill: '#4a5568' }
            );
            yLabelGroup.appendChild(label);
        }
        mainGroup.appendChild(yLabelGroup);

        // Bar dimensions
        const barWidth = 100;
        const barSpacing = graphWidth / 3;
        const passX = barSpacing - barWidth / 2;
        const failX = (2 * barSpacing) - barWidth / 2;

        // Draw bars
        const barsGroup = SVGBuilder.createGroup('bars-group');

        // Passed bar
        const passHeight = maxValue > 0 ? (passed / maxValue) * graphHeight : 0;
        const passBar = SVGBuilder.createRect(
            passX,
            graphHeight - passHeight,
            barWidth,
            passHeight,
            {
                fill: 'url(#passGradient)',
                rx: 8,
                cursor: 'pointer',
                class: 'bar-rect'
            }
        );

        // Passed bar hover
        passBar.addEventListener('mouseenter', (e) => {
            passBar.setAttribute('opacity', '0.8');
            this.showTooltip(e, 'Passed Projects', passed, passRate);
        });
        passBar.addEventListener('mouseleave', () => {
            passBar.setAttribute('opacity', '1');
            this.hideTooltip();
        });

        barsGroup.appendChild(passBar);

        // Failed bar
        const failHeight = maxValue > 0 ? (failed / maxValue) * graphHeight : 0;
        const failBar = SVGBuilder.createRect(
            failX,
            graphHeight - failHeight,
            barWidth,
            failHeight,
            {
                fill: 'url(#failGradient)',
                rx: 8,
                cursor: 'pointer',
                class: 'bar-rect'
            }
        );

        // Failed bar hover
        failBar.addEventListener('mouseenter', (e) => {
            failBar.setAttribute('opacity', '0.8');
            this.showTooltip(e, 'Failed Projects', failed, failRate);
        });
        failBar.addEventListener('mouseleave', () => {
            failBar.setAttribute('opacity', '1');
            this.hideTooltip();
        });

        barsGroup.appendChild(failBar);

        mainGroup.appendChild(barsGroup);

        // Value labels on top of bars
        const valuesGroup = SVGBuilder.createGroup('values-group');

        if (passHeight > 20) {
            const passValue = SVGBuilder.createText(
                passed.toString(),
                passX + barWidth / 2,
                graphHeight - passHeight - 8,
                {
                    'text-anchor': 'middle',
                    'font-size': '16',
                    'font-weight': 'bold',
                    fill: '#48bb78'
                }
            );
            valuesGroup.appendChild(passValue);
        }

        if (failHeight > 20) {
            const failValue = SVGBuilder.createText(
                failed.toString(),
                failX + barWidth / 2,
                graphHeight - failHeight - 8,
                {
                    'text-anchor': 'middle',
                    'font-size': '16',
                    'font-weight': 'bold',
                    fill: '#f56565'
                }
            );
            valuesGroup.appendChild(failValue);
        }

        mainGroup.appendChild(valuesGroup);

        // X-axis labels
        const xLabelGroup = SVGBuilder.createGroup('x-labels');

        const passLabel = SVGBuilder.createText(
            'Passed',
            passX + barWidth / 2,
            graphHeight + 25,
            {
                'text-anchor': 'middle',
                'font-size': '14',
                'font-weight': 'bold',
                fill: '#48bb78'
            }
        );
        xLabelGroup.appendChild(passLabel);

        const passPercentage = SVGBuilder.createText(
            `${passRate}%`,
            passX + barWidth / 2,
            graphHeight + 45,
            {
                'text-anchor': 'middle',
                'font-size': '12',
                fill: '#718096'
            }
        );
        xLabelGroup.appendChild(passPercentage);

        const failLabel = SVGBuilder.createText(
            'Failed',
            failX + barWidth / 2,
            graphHeight + 25,
            {
                'text-anchor': 'middle',
                'font-size': '14',
                'font-weight': 'bold',
                fill: '#f56565'
            }
        );
        xLabelGroup.appendChild(failLabel);

        const failPercentage = SVGBuilder.createText(
            `${failRate}%`,
            failX + barWidth / 2,
            graphHeight + 45,
            {
                'text-anchor': 'middle',
                'font-size': '12',
                fill: '#718096'
            }
        );
        xLabelGroup.appendChild(failPercentage);

        mainGroup.appendChild(xLabelGroup);

        // Title
        const title = SVGBuilder.createText(
            `Total Projects: ${total}`,
            graphWidth / 2,
            -25,
            {
                'text-anchor': 'middle',
                'font-size': '18',
                'font-weight': 'bold',
                fill: '#1a202c'
            }
        );
        mainGroup.appendChild(title);

        // Success rate indicator
        const successText = SVGBuilder.createText(
            `Success Rate: ${passRate}%`,
            graphWidth / 2,
            -5,
            {
                'text-anchor': 'middle',
                'font-size': '14',
                fill: parseFloat(passRate) >= 50 ? '#48bb78' : '#ed8936'
            }
        );
        mainGroup.appendChild(successText);

        // Y-axis label
        const yAxisLabel = SVGBuilder.createText(
            'Number of Projects',
            -40,
            graphHeight / 2,
            {
                'text-anchor': 'middle',
                'font-size': '14',
                'font-weight': 'bold',
                fill: '#4a5568',
                transform: `rotate(-90, -40, ${graphHeight / 2})`
            }
        );
        mainGroup.appendChild(yAxisLabel);

        // Add SVG to container
        container.appendChild(svg);

        // Add animations
        this.animateBars(passBar, failBar, passHeight, failHeight, graphHeight);
    },

    /**
     * Animate bars
     * @param {SVGElement} passBar - Pass bar element
     * @param {SVGElement} failBar - Fail bar element
     * @param {number} passHeight - Pass bar height
     * @param {number} failHeight - Fail bar height
     * @param {number} graphHeight - Graph height
     */
    animateBars(passBar, failBar, passHeight, failHeight, graphHeight) {
        // Animate pass bar
        passBar.setAttribute('height', 0);
        passBar.setAttribute('y', graphHeight);
        
        const passAnimate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        passAnimate.setAttribute('attributeName', 'height');
        passAnimate.setAttribute('from', 0);
        passAnimate.setAttribute('to', passHeight);
        passAnimate.setAttribute('dur', '0.8s');
        passAnimate.setAttribute('fill', 'freeze');
        passBar.appendChild(passAnimate);

        const passYAnimate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        passYAnimate.setAttribute('attributeName', 'y');
        passYAnimate.setAttribute('from', graphHeight);
        passYAnimate.setAttribute('to', graphHeight - passHeight);
        passYAnimate.setAttribute('dur', '0.8s');
        passYAnimate.setAttribute('fill', 'freeze');
        passBar.appendChild(passYAnimate);

        // Animate fail bar
        failBar.setAttribute('height', 0);
        failBar.setAttribute('y', graphHeight);
        
        const failAnimate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        failAnimate.setAttribute('attributeName', 'height');
        failAnimate.setAttribute('from', 0);
        failAnimate.setAttribute('to', failHeight);
        failAnimate.setAttribute('dur', '0.8s');
        failAnimate.setAttribute('begin', '0.2s');
        failAnimate.setAttribute('fill', 'freeze');
        failBar.appendChild(failAnimate);

        const failYAnimate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        failYAnimate.setAttribute('attributeName', 'y');
        failYAnimate.setAttribute('from', graphHeight);
        failYAnimate.setAttribute('to', graphHeight - failHeight);
        failYAnimate.setAttribute('dur', '0.8s');
        failYAnimate.setAttribute('begin', '0.2s');
        failYAnimate.setAttribute('fill', 'freeze');
        failBar.appendChild(failYAnimate);

        // Add CSS for hover effect
        if (!document.getElementById('project-stats-animations')) {
            const style = document.createElement('style');
            style.id = 'project-stats-animations';
            style.textContent = `
                .bar-rect {
                    transition: opacity 0.2s ease;
                }
            `;
            document.head.appendChild(style);
        }
    },

    /**
     * Show tooltip
     * @param {Event} event - Mouse event
     * @param {string} label - Label
     * @param {number} count - Count value
     * @param {number} percentage - Percentage value
     */
    showTooltip(event, label, count, percentage) {
        let tooltip = document.getElementById('project-stats-tooltip');
        
        if (!tooltip) {
            tooltip = SVGBuilder.createTooltip('project-stats-tooltip');
        }

        const content = `
            <div style="font-weight: bold; margin-bottom: 4px;">${label}</div>
            <div>Count: ${count}</div>
            <div>Percentage: ${percentage}%</div>
        `;

        SVGBuilder.showTooltip(tooltip, content, event.pageX, event.pageY);
    },

    /**
     * Hide tooltip
     */
    hideTooltip() {
        const tooltip = document.getElementById('project-stats-tooltip');
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
                <div class="empty-state-icon">ðŸ“</div>
                <h3>No Project Data Available</h3>
                <p>Complete projects to see your success statistics!</p>
            </div>
        `;
    }
};

// Expose to window
window.ProjectStats = ProjectStats;

// Freeze the ProjectStats object
Object.freeze(ProjectStats);