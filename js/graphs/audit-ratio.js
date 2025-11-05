/**
 * Audit Ratio Graph
 * Displays audit ratio as a donut chart (audits done vs received)
 */

const AuditRatio = {
    /**
     * Render audit ratio graph
     * @param {object} data - Audit data with auditorAudits and receivedAudits
     */
    render(data) {
        const container = document.getElementById('auditRatioGraph');
        
        if (!container) {
            console.error('Audit ratio graph container not found');
            return;
        }

        // Clear container
        SVGBuilder.clearContainer(container);

        // Extract data
        const auditsDone = data?.auditorAudits?.aggregate?.count || 0;
        const auditsReceived = data?.receivedAudits?.aggregate?.count || 0;

        // Check if there's data
        if (auditsDone === 0 && auditsReceived === 0) {
            this.showEmptyState(container);
            return;
        }

        // Create the graph
        this.createGraph(container, auditsDone, auditsReceived);
    },

    /**
     * Create the donut chart
     * @param {HTMLElement} container - Container element
     * @param {number} auditsDone - Number of audits done
     * @param {number} auditsReceived - Number of audits received
     */
    createGraph(container, auditsDone, auditsReceived) {
        // Graph dimensions
        const width = 400;
        const height = 400;
        const centerX = width / 2;
        const centerY = height / 2;
        const outerRadius = 140;
        const innerRadius = 90;

        // Create SVG
        const svg = SVGBuilder.createSVG(width, height, 'audit-ratio-svg');

        // Create gradients
        const doneGradient = SVGBuilder.createLinearGradient(
            'auditDoneGradient',
            [
                { offset: '0%', color: '#48bb78' },
                { offset: '100%', color: '#38a169' }
            ]
        );

        const receivedGradient = SVGBuilder.createLinearGradient(
            'auditReceivedGradient',
            [
                { offset: '0%', color: '#667eea' },
                { offset: '100%', color: '#764ba2' }
            ]
        );

        const defs = SVGBuilder.createDefs([doneGradient, receivedGradient]);
        svg.appendChild(defs);

        // Calculate percentages and angles
        const total = auditsDone + auditsReceived;
        const donePercentage = (auditsDone / total) * 100;
        const receivedPercentage = (auditsReceived / total) * 100;
        
        // Calculate ratio
        const ratio = auditsReceived > 0 ? (auditsDone / auditsReceived).toFixed(2) : '0.00';

        // Create main group
        const mainGroup = SVGBuilder.createGroup('main-group');
        svg.appendChild(mainGroup);

        // Draw donut segments
        let startAngle = -90; // Start at top

        // Audits Done segment
        const doneAngle = (auditsDone / total) * 360;
        const donePath = this.createDonutSegment(
            centerX, 
            centerY, 
            innerRadius, 
            outerRadius, 
            startAngle, 
            startAngle + doneAngle
        );
        
        const doneSegment = SVGBuilder.createPath(donePath, {
            fill: 'url(#auditDoneGradient)',
            stroke: 'white',
            'stroke-width': 2,
            cursor: 'pointer',
            class: 'donut-segment'
        });

        // Add hover effect for done segment
        doneSegment.addEventListener('mouseenter', (e) => {
            doneSegment.setAttribute('opacity', '0.8');
            this.showTooltip(e, 'Audits Done', auditsDone, donePercentage);
        });
        doneSegment.addEventListener('mouseleave', () => {
            doneSegment.setAttribute('opacity', '1');
            this.hideTooltip();
        });

        mainGroup.appendChild(doneSegment);

        // Audits Received segment
        startAngle += doneAngle;
        const receivedAngle = (auditsReceived / total) * 360;
        const receivedPath = this.createDonutSegment(
            centerX, 
            centerY, 
            innerRadius, 
            outerRadius, 
            startAngle, 
            startAngle + receivedAngle
        );
        
        const receivedSegment = SVGBuilder.createPath(receivedPath, {
            fill: 'url(#auditReceivedGradient)',
            stroke: 'white',
            'stroke-width': 2,
            cursor: 'pointer',
            class: 'donut-segment'
        });

        // Add hover effect for received segment
        receivedSegment.addEventListener('mouseenter', (e) => {
            receivedSegment.setAttribute('opacity', '0.8');
            this.showTooltip(e, 'Audits Received', auditsReceived, receivedPercentage);
        });
        receivedSegment.addEventListener('mouseleave', () => {
            receivedSegment.setAttribute('opacity', '1');
            this.hideTooltip();
        });

        mainGroup.appendChild(receivedSegment);

        // Center text - Ratio
        const ratioText = SVGBuilder.createText(
            ratio,
            centerX,
            centerY - 10,
            {
                'text-anchor': 'middle',
                'font-size': '48',
                'font-weight': 'bold',
                fill: '#1a202c'
            }
        );
        mainGroup.appendChild(ratioText);

        // Center text - Label
        const ratioLabel = SVGBuilder.createText(
            'Audit Ratio',
            centerX,
            centerY + 20,
            {
                'text-anchor': 'middle',
                'font-size': '14',
                fill: '#718096'
            }
        );
        mainGroup.appendChild(ratioLabel);

        // Legend
        const legendGroup = SVGBuilder.createGroup('legend-group', `translate(${centerX - 80}, ${height - 80})`);

        // Done legend
        const doneRect = SVGBuilder.createRect(0, 0, 20, 20, {
            fill: 'url(#auditDoneGradient)',
            rx: 4
        });
        legendGroup.appendChild(doneRect);

        const doneText = SVGBuilder.createText(
            `Done: ${auditsDone} (${donePercentage.toFixed(1)}%)`,
            30,
            15,
            { 'font-size': '14', fill: '#4a5568' }
        );
        legendGroup.appendChild(doneText);

        // Received legend
        const receivedRect = SVGBuilder.createRect(0, 30, 20, 20, {
            fill: 'url(#auditReceivedGradient)',
            rx: 4
        });
        legendGroup.appendChild(receivedRect);

        const receivedText = SVGBuilder.createText(
            `Received: ${auditsReceived} (${receivedPercentage.toFixed(1)}%)`,
            30,
            45,
            { 'font-size': '14', fill: '#4a5568' }
        );
        legendGroup.appendChild(receivedText);

        mainGroup.appendChild(legendGroup);

        // Status indicator
        const statusY = 50;
        let statusText = '';
        let statusColor = '';

        if (parseFloat(ratio) >= 1) {
            statusText = '✓ Good Ratio';
            statusColor = '#48bb78';
        } else if (parseFloat(ratio) >= 0.5) {
            statusText = '⚠ Average Ratio';
            statusColor = '#ed8936';
        } else {
            statusText = '⚠ Low Ratio';
            statusColor = '#f56565';
        }

        const status = SVGBuilder.createText(
            statusText,
            centerX,
            statusY,
            {
                'text-anchor': 'middle',
                'font-size': '16',
                'font-weight': 'bold',
                fill: statusColor
            }
        );
        mainGroup.appendChild(status);

        // Add SVG to container
        container.appendChild(svg);

        // Add animations
        this.animateSegments(doneSegment, receivedSegment);
    },

    /**
     * Create donut segment path
     * @param {number} cx - Center X
     * @param {number} cy - Center Y
     * @param {number} innerR - Inner radius
     * @param {number} outerR - Outer radius
     * @param {number} startAngle - Start angle in degrees
     * @param {number} endAngle - End angle in degrees
     * @returns {string} SVG path data
     */
    createDonutSegment(cx, cy, innerR, outerR, startAngle, endAngle) {
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

        const x1 = cx + outerR * Math.cos(startRad);
        const y1 = cy + outerR * Math.sin(startRad);
        const x2 = cx + outerR * Math.cos(endRad);
        const y2 = cy + outerR * Math.sin(endRad);
        const x3 = cx + innerR * Math.cos(endRad);
        const y3 = cy + innerR * Math.sin(endRad);
        const x4 = cx + innerR * Math.cos(startRad);
        const y4 = cy + innerR * Math.sin(startRad);

        return `
            M ${x1} ${y1}
            A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}
            L ${x3} ${y3}
            A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}
            Z
        `;
    },

    /**
     * Animate segments
     * @param {SVGElement} segment1 - First segment
     * @param {SVGElement} segment2 - Second segment
     */
    animateSegments(segment1, segment2) {
        // Add scale animation
        segment1.style.transformOrigin = 'center';
        segment1.style.animation = 'scaleIn 0.6s ease-out';
        
        segment2.style.transformOrigin = 'center';
        segment2.style.animation = 'scaleIn 0.6s ease-out 0.2s backwards';

        // Add keyframes if not already added
        if (!document.getElementById('audit-ratio-animations')) {
            const style = document.createElement('style');
            style.id = 'audit-ratio-animations';
            style.textContent = `
                @keyframes scaleIn {
                    from {
                        transform: scale(0);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .donut-segment {
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
        let tooltip = document.getElementById('audit-ratio-tooltip');
        
        if (!tooltip) {
            tooltip = SVGBuilder.createTooltip('audit-ratio-tooltip');
        }

        const content = `
            <div style="font-weight: bold; margin-bottom: 4px;">${label}</div>
            <div>Count: ${count}</div>
            <div>Percentage: ${percentage.toFixed(1)}%</div>
        `;

        SVGBuilder.showTooltip(tooltip, content, event.pageX, event.pageY);
    },

    /**
     * Hide tooltip
     */
    hideTooltip() {
        const tooltip = document.getElementById('audit-ratio-tooltip');
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
                <div class="empty-state-icon">👥</div>
                <h3>No Audit Data Available</h3>
                <p>Complete audits to see your audit ratio!</p>
            </div>
        `;
    }
};

// Freeze the AuditRatio object
Object.freeze(AuditRatio);