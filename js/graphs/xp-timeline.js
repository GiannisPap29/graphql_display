const XPTimeline = {
    render(transactions) {
        const container = document.getElementById('xpTimelineGraph');
        if (!container) return;

        SVGBuilder.clearContainer(container);

        if (!transactions || transactions.length === 0) {
            this.showEmptyState(container);
            return;
        }

        const data = DataProcessor.processXPTimeline(transactions);
        if (data.length === 0) {
            this.showEmptyState(container);
            return;
        }

        this.createGraph(container, data);
    },

    createGraph(container, data) {
        const width = 700;
        const height = 350;
        const pad = { top: 50, right: 30, bottom: 50, left: 60 };
        const gw = width - pad.left - pad.right;
        const gh = height - pad.top - pad.bottom;

        const svg = SVGBuilder.createSVG(width, height, 'xp-timeline-svg');
        const maxXP = Math.max(...data.map(d => d.cumulative));
        const minDate = data[0].date;
        const maxDate = data[data.length - 1].date;
        const range = maxDate - minDate;

        const g = SVGBuilder.createGroup('main', `translate(${pad.left}, ${pad.top})`);
        svg.appendChild(g);

        // Grid - 3 lines
        for (let i = 1; i < 3; i++) {
            const y = (gh / 3) * i;
            g.appendChild(SVGBuilder.createLine(0, y, gw, y, { stroke: '#e0e0e0', 'stroke-width': 1 }));
        }

        // Axes
        g.appendChild(SVGBuilder.createLine(0, gh, gw, gh, { stroke: '#666', 'stroke-width': 1 }));
        g.appendChild(SVGBuilder.createLine(0, 0, 0, gh, { stroke: '#666', 'stroke-width': 1 }));

        // Y labels
        for (let i = 0; i <= 3; i++) {
            const v = Math.round((maxXP / 3) * i);
            const y = gh - ((gh / 3) * i);
            g.appendChild(SVGBuilder.createText(SVGBuilder.formatNumber(v, true), -8, y + 4, {
                'text-anchor': 'end', 'font-size': '11', fill: '#666'
            }));
        }

        // X labels
        for (let i = 0; i < 4; i++) {
            const idx = Math.floor((i * (data.length - 1)) / 3);
            const pt = data[idx];
            const x = ((pt.date - minDate) / range) * gw;
            g.appendChild(SVGBuilder.createText(DateUtils.format(pt.date, 'short'), x, gh + 20, {
                'text-anchor': 'middle', 'font-size': '10', fill: '#666'
            }));
        }

        // Points
        const pts = data.map(d => ({
            x: ((d.date - minDate) / range) * gw,
            y: gh - (d.cumulative / maxXP) * gh
        }));

        // Area
        let path = `M ${pts[0].x} ${gh} L ${pts[0].x} ${pts[0].y}`;
        for (let i = 1; i < pts.length; i++) path += ` L ${pts[i].x} ${pts[i].y}`;
        path += ` L ${pts[pts.length - 1].x} ${gh} Z`;
        g.appendChild(SVGBuilder.createPath(path, { fill: '#667eea', opacity: 0.1, stroke: 'none' }));

        // Line
        const line = SVGBuilder.createPolyline(pts, { fill: 'none', stroke: '#667eea', 'stroke-width': 2 });
        g.appendChild(line);

        // Points
        data.forEach((d, i) => {
            const c = SVGBuilder.createCircle(pts[i].x, pts[i].y, 3, {
                fill: '#667eea', stroke: 'white', 'stroke-width': 2, cursor: 'pointer'
            });
            c.addEventListener('mouseenter', (e) => this.showTooltip(e, d));
            c.addEventListener('mouseleave', () => this.hideTooltip());
            g.appendChild(c);
        });

        // Title
        g.appendChild(SVGBuilder.createText(`Total: ${SVGBuilder.formatNumber(maxXP)} XP`, gw / 2, -25, {
            'text-anchor': 'middle', 'font-size': '14', 'font-weight': 'bold', fill: '#333'
        }));

        container.appendChild(svg);
    },

    showTooltip(e, d) {
        let t = document.getElementById('xp-tooltip');
        if (!t) t = SVGBuilder.createTooltip('xp-tooltip');
        const c = `<div><b>${d.objectName}</b></div><div>${DateUtils.format(d.date, 'short')}</div><div>+${SVGBuilder.formatNumber(d.amount)} XP</div><div>Total: ${SVGBuilder.formatNumber(d.cumulative)} XP</div>`;
        SVGBuilder.showTooltip(t, c, e.pageX, e.pageY);
    },

    hideTooltip() {
        const t = document.getElementById('xp-tooltip');
        if (t) SVGBuilder.hideTooltip(t);
    },

    showEmptyState(c) {
        c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📊</div><h3>No XP Data</h3><p>Complete projects to see progress!</p></div>';
    }
};

window.XPTimeline = XPTimeline;
Object.freeze(XPTimeline);