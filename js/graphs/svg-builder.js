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

        // Default styles
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

        // Default styles
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

        // Default styles
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
     * Create a linear gradient
     * @param {string} id - Gradient ID
     * @param {Array} stops - Array of {offset, color} objects
     * @param {string} direction - 'vertical' or 'horizontal'
     * @returns {SVGElement} Gradient element
     */
    createLinearGradient(id, stops, direction = 'vertical') {
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', id);

        if (direction === 'horizontal') {
            gradient.setAttribute('x1', '0%');
            gradient.setAttribute('y1', '0%');
            gradient.setAttribute('x2', '100%');
            gradient.setAttribute('y2', '0%');
        } else {
            gradient.setAttribute('x1', '0%');
            gradient.setAttribute('y1', '0%');
            gradient.setAttribute('x2', '0%');
            gradient.setAttribute('y2', '100%');
        }

        stops.forEach(stop => {
            const stopEl = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stopEl.setAttribute('offset', stop.offset);
            stopEl.setAttribute('stop-color', stop.color);
            if (stop.opacity !== undefined) {
                stopEl.setAttribute('stop-opacity', stop.opacity);
            }
            gradient.appendChild(stopEl);
        });

        return gradient;
    },

    /**
     * Create definitions element with gradients
     * @param {Array} gradients - Array of gradient elements
     * @returns {SVGElement} Defs element
     */
    createDefs(gradients = []) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        gradients.forEach(gradient => {
            defs.appendChild(gradient);
        });
        return defs;
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
     * Calculate scale for data
     * @param {Array} data - Array of numbers
     * @param {number} max - Maximum value for scale
     * @returns {object} {min, max, scale}
     */
    calculateScale(data, max) {
        const dataMin = Math.min(...data);
        const dataMax = Math.max(...data);
        const range = dataMax - dataMin;
        const scale = max / (range || 1);

        return {
            min: dataMin,
            max: dataMax,
            range,
            scale
        };
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
     * Generate color palette
     * @param {number} count - Number of colors
     * @param {string} scheme - Color scheme: 'default', 'blue', 'green', 'rainbow'
     * @returns {Array} Array of color strings
     */
    generateColorPalette(count, scheme = 'default') {
        const schemes = {
            default: ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
            blue: ['#667eea', '#4299e1', '#3182ce', '#2c5282'],
            green: ['#48bb78', '#38a169', '#2f855a', '#276749'],
            rainbow: ['#f56565', '#ed8936', '#ecc94b', '#48bb78', '#4299e1', '#667eea', '#9f7aea']
        };

        const colors = schemes[scheme] || schemes.default;
        const result = [];

        for (let i = 0; i < count; i++) {
            result.push(colors[i % colors.length]);
        }

        return result;
    },

    /**
     * Add animation to element
     * @param {SVGElement} element - SVG element
     * @param {string} property - Property to animate
     * @param {string} from - Start value
     * @param {string} to - End value
     * @param {number} duration - Duration in ms
     */
    animate(element, property, from, to, duration = 500) {
        const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeName', property);
        animate.setAttribute('from', from);
        animate.setAttribute('to', to);
        animate.setAttribute('dur', `${duration}ms`);
        animate.setAttribute('fill', 'freeze');
        element.appendChild(animate);
    },

    /**
     * Clear SVG container
     * @param {HTMLElement} container - Container element
     */
    clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    },

    /**
     * Create responsive SVG wrapper
     * @param {number} aspectRatio - Aspect ratio (width/height)
     * @returns {HTMLElement} Wrapper div
     */
    createResponsiveWrapper(aspectRatio = 16/9) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            position: relative;
            width: 100%;
            padding-bottom: ${(1 / aspectRatio) * 100}%;
        `;
        return wrapper;
    }
};

// Freeze the SVGBuilder object
Object.freeze(SVGBuilder);