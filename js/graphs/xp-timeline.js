/**
 * XP Timeline Graph
 * Displays cumulative XP earned over time as a line chart
 */

const XPTimeline = {
    /**
     * Render XP timeline graph
     * @param {Array} transactions - Array of XP transaction objects
     */
    render(transactions) {
        const container = document.getElementById('xpTimelineGraph');
        
        if (!container) {
            console.error('XP timeline graph container not found');
            return;
        }

        // Clear container
        SVGBuilder.clearContainer(container);

        // Check if there's data
        if (!transactions || transactions.length === 0) {
            this.showEmptyState(container);
            return;
        }

        // Process data
        const processedData = DataProcessor.processXPTimeline(transactions);
        
        if (processedData.length === 0) {
            this.showEmptyState(container);
            return;
        }

        // Create the graph
        this.createGraph(container, processedData);
    },

    /**
     * Create the actual graph
     * @param {HTMLElement} container - Container element
     * @param {Array} data - Processed data
     */
    createGraph(container, data) {
        // Graph dimensions
        const width = 800;
        const height = 400;
        const padding = { top: 40, right: 40, bottom: 60, left: 80 };
        const graphWidth = width - padding.left - padding.right;
        const graphHeight = height - padding.top - padding.bottom;

        // Create SVG
        const svg = SVGBuilder.createSVG(width, height, 'xp-timeline-svg');

        // Create defs for gradients
        const gradient = SVGBuilder.createLinearGradient(
            'xpGradient',
            [
                { offset: '0%', color: '#667eea', opacity: 0.8 },
                { offset: '100%', color: '#764ba2', opacity: 0.8 }
            ],
            'horizontal'
        );
        
        const areaGradient = SVGBuilder.createLinearGradient(
            'xpAreaGradient',
            [
                { offset: '0%', color: '#667eea', opacity: 0.3 },
                { offset: '100%', color: '#667eea', opacity: 0.05 }
            ],
            'vertical'
        );

        const defs = SVGBuilder.createDefs([gradient, areaGradient]);
        svg.appendChild(defs);

        // Calculate scales
        const maxXP = Math.max(...data.map(d => d.cumulative));
        const minDate = data[0].date;
        const maxDate = data[data.length - 1].date;
        const dateRange = maxDate - minDate;

        // Create main group
        const mainGroup = SVGBuilder.createGroup('main-group', `translate(${padding.left}, ${padding.top})`);
        svg.appendChild(mainGroup);

        // Draw grid lines (horizontal)
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

        // Y-axis labels (XP values)
        const yLabelGroup = SVGBuilder.createGroup('y-labels');
        for (let i = 0; i <= yTicks; i++) {
            const value = (maxXP / yTicks) * i;
            const y = graphHeight - (i * graphHeight / yTicks);
            const label = SVGBuilder.createText(
                SVGBuilder.formatNumber(Math.round(value), true),
                -10,
                y + 4,
                { 'text-anchor': 'end', 'font-size': '12', fill: '#4a5568' }
            );
            yLabelGroup.appendChild(label);
        }
        mainGroup.appendChild(yLabelGroup);

        // X-axis labels (dates)
        const xLabelGroup = SVGBuilder.createGroup('x-labels');
        const xTicks = Math.min(data.length, 6);
        for (let i = 0; i < xTicks; i++) {
            const index = Math.floor((i * (data.length - 1)) / (xTicks - 1));
            const point = data[index];
            const x = ((point.date - minDate) / dateRange) * graphWidth;
            const label = SVGBuilder.createText(
                DateUtils.format(point.date, 'short'),
                x,
                graphHeight + 25,
                { 'text-anchor': 'middle', 'font-size': '11', fill: '#4a5568' }
            );
            xLabelGroup.appendChild(label);
        }
        mainGroup.appendChild(xLabelGroup);

        // Create points for line
        const points = data.map(d => ({
            x: ((d.date - minDate) / dateRange) * graphWidth,
            y: graphHeight - (d.cumulative / maxXP) * graphHeight
        }));

        // Draw area under the line
        const areaPath = this.createAreaPath(points, graphHeight);
        const area = SVGBuilder.createPath(areaPath, {
            fill: 'url(#xpAreaGradient)',
            stroke: 'none'
        });
        mainGroup.appendChild(area);

        // Draw line
        const line = SVGBuilder.createPolyline(points, {
            fill: 'none',
            stroke: 'url(#xpGradient)',
            'stroke-width': 3,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
        });
        mainGroup.appendChild(line);

        // Draw interactive points
        const pointsGroup = SVGBuilder.createGroup('points-group');
        data.forEach((d, index) => {
            const point = points[index];
            
            // Outer circle (hover effect)
            const outerCircle = SVGBuilder.createCircle(point.x, point.y, 8, {
                fill: '#667eea',
                opacity: 0,
                class: 'point-hover'
            });

            // Inner circle
            const circle = SVGBuilder.createCircle(point.x, point.y, 4, {
                fill: 'white',
                stroke: '#667eea',
                'stroke-width': 2,
                cursor: 'pointer'
            });

            // Add hover effects
            const hoverGroup = SVGBuilder.createGroup();
            hoverGroup.appendChild(outerCircle);
            hoverGroup.appendChild(circle);

            // Mouse events
            hoverGroup.addEventListener('mouseenter', (e) => {
                outerCircle.setAttribute('opacity', 0.3);
                circle.setAttribute('r', 6);
                this.showTooltip(e, d, container);
            });

            hoverGroup.addEventListener('mouseleave', () => {
                outerCircle.setAttribute('opacity', 0);
                circle.setAttribute('r', 4);
                this.hideTooltip();
            });

            pointsGroup.appendChild(hoverGroup);
        });
        mainGroup.appendChild(pointsGroup);

        // Add title
        const title = SVGBuilder.createText(
            `Total XP: ${SVGBuilder.formatNumber(maxXP)}`,
            graphWidth / 2,
            -15,
            {
                'text-anchor': 'middle',
                'font-size': '16',
                'font-weight': 'bold',
                fill: '#1a202c'
            }
        );
        mainGroup.appendChild(title);

        // Axis labels
        const yAxisLabel = SVGBuilder.createText(
            'XP',
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

        const xAxisLabel = SVGBuilder.createText(
            'Date',
            graphWidth / 2,
            graphHeight + 50,
            {
                'text-anchor': 'middle',
                'font-size': '14',
                'font-weight': 'bold',
                fill: '#4a5568'
            }
        );
        mainGroup.appendChild(xAxisLabel);

        // Add SVG to container
        container.appendChild(svg);

        // Add animation
        this.animateGraph(line, area);
    },

    /**
     * Create area path
     * @param {Array} points - Array of {x, y} points
     * @param {number} graphHeight - Graph height
     * @returns {string} SVG path data
     */
    createAreaPath(points, graphHeight) {
        if (points.length === 0) return '';

        let path = `M ${points[0].x} ${graphHeight}`;
        path += ` L ${points[0].x} ${points[0].y}`;

        for (let i = 1; i < points.length; i++) {
            path += ` L ${points[i].x} ${points[i].y}`;
        }

        path += ` L ${points[points.length - 1].x} ${graphHeight}`;
        path += ' Z';

        return path;
    },

    /**
     * Animate the graph
     * @param {SVGElement} line - Line element
     * @param {SVGElement} area - Area element
     */
    animateGraph(line, area) {
        // Animate line
        const lineLength = line.getTotalLength();
        line.style.strokeDasharray = lineLength;
        line.style.strokeDashoffset = lineLength;
        line.style.animation = 'drawLine 1.5s ease-in-out forwards';

        // Animate area
        if (area) {
            area.style.opacity = '0';
            area.style.animation = 'fadeIn 1s ease-in-out 0.5s forwards';
        }

        // Add keyframes if not already added
        if (!document.getElementById('xp-timeline-animations')) {
            const style = document.createElement('style');
            style.id = 'xp-timeline-animations';
            style.textContent = `
                @keyframes drawLine {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes fadeIn {
                    to {
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },

    /**
     * Show tooltip
     * @param {Event} event - Mouse event
     * @param {object} data - Data point
     * @param {HTMLElement} container - Container element
     */
    showTooltip(event, data, container) {
        let tooltip = document.getElementById('xp-tooltip');
        
        if (!tooltip) {
            tooltip = SVGBuilder.createTooltip('xp-tooltip');
        }

        const content = `
            <div style="font-weight: bold; margin-bottom: 4px;">${data.objectName}</div>
            <div>Date: ${DateUtils.format(data.date, 'long')}</div>
            <div>XP Earned: ${SVGBuilder.formatNumber(data.amount)}</div>
            <div style="color: #48bb78;">Total XP: ${SVGBuilder.formatNumber(data.cumulative)}</div>
        `;

        SVGBuilder.showTooltip(tooltip, content, event.pageX, event.pageY);
    },

    /**
     * Hide tooltip
     */
    hideTooltip() {
        const tooltip = document.getElementById('xp-tooltip');
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
                <h3>No XP Data Available</h3>
                <p>Start completing projects to see your XP progress over time!</p>
            </div>
        `;
    }
};

// Freeze the XPTimeline object
Object.freeze(XPTimeline);