/**
 * SVG Builder Utility
 * Base utilities for creating SVG graphs and charts
 */

const SVGBuilder = {
    /**
     * Create SVG element with viewBox
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {string} className - CSS class name
     * @returns {SVGElement} SVG element
     */
    createSVG(width, height, className = '') {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        
        if (className) {
            svg.setAttribute('class', className);
        }

        return svg;
    },

    /**
     * Create a group element
     * @param {string} className - CSS class name
     * @param {string} transform - Transform attribute
     * @returns {SVGElement} Group element
     */
    createGroup(className = '', transform = '') {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        if (className) {
            g.setAttribute('class', className);
        }
        
        if (transform) {
            g.setAttribute('transform', transform);
        }

        return g;
    },

    /**
     * Create a line
     * @param {number} x1 - Start X
     * @param {number} y1 - Start Y
     * @param {number} x2 - End X
     * @param {number} y2 - End Y
     * @param {object} styles - Style attributes
     * @returns {SVGElement} Line element
     */
    createLine(x1, y1, x2, y2, styles = {}) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);

        const defaultStyles = {
            stroke: '#e2e8f0',
            'stroke-width': 1
        };

        const finalStyles = { ...defaultStyles, ...styles };
        Object.entries(finalStyles).forEach(([key, value]) => {
            line.setAttribute(key, value);
        });

        return line;
    },

    /**
     * Create a rectangle
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {object} styles - Style attributes
     * @returns {SVGElement} Rectangle element
     */
    createRect(x, y, width, height, styles = {}) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);

        Object.entries(styles).forEach(([key, value]) => {
            rect.setAttribute(key, value);
        });

        return rect;
    },

    /**
     * Create a circle
     * @param {number} cx - Center X
     * @param {number} cy - Center Y
     * @param {number} r - Radius
     * @param {object} styles - Style attributes
     * @returns {SVGElement} Circle element
     */
    createCircle(cx, cy, r, styles = {}) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);

        Object.entries(styles).forEach(([key, value]) => {
            circle.setAttribute(key, value);
        });

        return circle;
    },

    /**
     * Create a path
     * @param {string} d - Path data
     * @param {object} styles - Style attributes
     * @returns {SVGElement} Path element
     */
    createPath(d, styles = {}) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);

        Object.entries(styles).forEach(([key, value]) => {
            path.setAttribute(key, value);
        });

        return path;
    },

    /**
     * Create a polyline
     * @param {Array} points - Array of {x, y} points
     * @param {object} styles - Style attributes
     * @returns {SVGElement} Polyline element
     */
    createPolyline(points, styles = {}) {
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');
        polyline.setAttribute('points', pointsString);

        const defaultStyles = {
            fill: 'none',
            stroke: '#667eea',
            'stroke-width': 2
        };

        const finalStyles = { ...defaultStyles, ...styles };
        Object.entries(finalStyles).forEach(([key, value]) => {
            polyline.setAttribute(key, value);
        });

        return polyline;
    },

    /**
     * Create text element
     * @param {string} text - Text content
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {object} styles - Style attributes
     * @returns {SVGElement} Text element
     */
    createText(text, x, y, styles = {}) {
        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEl.textContent = text;
        textEl.setAttribute('x', x);
        textEl.setAttribute('y', y);

        const defaultStyles = {
            'font-size': '12',
            'font-family': 'sans-serif',
            fill: '#4a5568'
        };

        const finalStyles = { ...defaultStyles, ...styles };
        Object.entries(finalStyles).forEach(([key, value]) => {
            textEl.setAttribute(key, value);
        });

        return textEl;
    },

    /**
     * Create tooltip element
     * @param {string} id - Tooltip ID
     * @returns {HTMLElement} Tooltip div element
     */
    createTooltip(id = 'svg-tooltip') {
        const tooltip = document.createElement('div');
        tooltip.id = id;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 13px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 1000;
            white-space: nowrap;
        `;
        document.body.appendChild(tooltip);
        return tooltip;
    },

    /**
     * Show tooltip
     * @param {HTMLElement} tooltip - Tooltip element
     * @param {string} content - Tooltip content
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    showTooltip(tooltip, content, x, y) {
        tooltip.innerHTML = content;
        tooltip.style.left = `${x + 10}px`;
        tooltip.style.top = `${y - 10}px`;
        tooltip.style.opacity = '1';
    },

    /**
     * Hide tooltip
     * @param {HTMLElement} tooltip - Tooltip element
     */
    hideTooltip(tooltip) {
        tooltip.style.opacity = '0';
    },

    /**
     * Show empty state in container
     * @param {HTMLElement} container - Container element
     * @param {string} icon - Emoji icon
     * @param {string} title - Title text
     * @param {string} message - Message text
     */
    showEmptyState(container, icon = '📊', title = 'No Data', message = 'No data available to display') {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">${icon}</div>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    },

    /**
     * Format number for display
     * @param {number} num - Number to format
     * @param {boolean} compact - Use compact notation (K, M, B)
     * @returns {string} Formatted number
     */
    formatNumber(num, compact = false) {
        if (compact) {
            if (num >= 1000000000) {
                return (num / 1000000000).toFixed(1) + 'B';
            }
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
        }
        return num.toLocaleString();
    },

    /**
     * Clear SVG container
     * @param {HTMLElement} container - Container element
     */
    clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
};

// Freeze the SVGBuilder object
Object.freeze(SVGBuilder);