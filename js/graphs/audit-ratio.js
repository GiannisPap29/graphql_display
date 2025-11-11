const AuditRatio = {
    render(data) {
        const container = document.getElementById('auditRatioGraph');
        if (!container) return;

        SVGBuilder.clearContainer(container);

        const auditsDone = data?.auditorAudits?.aggregate?.count || 0;
        const auditsReceived = data?.receivedAudits?.aggregate?.count || 0;

        if (auditsDone === 0 && auditsReceived === 0) {
            SVGBuilder.showEmptyState(container, '📊', 'No Audit Data', 'Complete audits to see your ratio!');
            return;
        }

        this.createGraph(container, auditsDone, auditsReceived);
    },

    createGraph(container, auditsDone, auditsReceived) {
        const width = 350;
        const height = 350;
        const cx = width / 2;
        const cy = height / 2;
        const radius = 100;

        const svg = SVGBuilder.createSVG(width, height, 'audit-ratio-svg');
        const g = SVGBuilder.createGroup('main');
        svg.appendChild(g);

        const total = auditsDone + auditsReceived;
        const ratio = auditsReceived > 0 ? (auditsDone / auditsReceived).toFixed(2) : '0.00';

        // Done segment
        let startAngle = -90;
        const doneAngle = (auditsDone / total) * 360;
        const donePath = this.createArc(cx, cy, 70, radius, startAngle, startAngle + doneAngle);
        const done = SVGBuilder.createPath(donePath, {
            fill: '#48bb78', stroke: 'white', 'stroke-width': 2, cursor: 'pointer'
        });
        done.addEventListener('mouseenter', (e) => {
            done.setAttribute('opacity', '0.8');
            this.showTooltip(e, 'Done', auditsDone, (auditsDone/total*100).toFixed(1));
        });
        done.addEventListener('mouseleave', () => {
            done.setAttribute('opacity', '1');
            this.hideTooltip();
        });
        g.appendChild(done);

        // Received segment
        startAngle += doneAngle;
        const rcvAngle = (auditsReceived / total) * 360;
        const rcvPath = this.createArc(cx, cy, 70, radius, startAngle, startAngle + rcvAngle);
        const rcv = SVGBuilder.createPath(rcvPath, {
            fill: '#667eea', stroke: 'white', 'stroke-width': 2, cursor: 'pointer'
        });
        rcv.addEventListener('mouseenter', (e) => {
            rcv.setAttribute('opacity', '0.8');
            this.showTooltip(e, 'Received', auditsReceived, (auditsReceived/total*100).toFixed(1));
        });
        rcv.addEventListener('mouseleave', () => {
            rcv.setAttribute('opacity', '1');
            this.hideTooltip();
        });
        g.appendChild(rcv);

        // Center
        g.appendChild(SVGBuilder.createText(ratio, cx, cy - 5, {
            'text-anchor': 'middle', 'font-size': '36', 'font-weight': 'bold', fill: '#333'
        }));
        g.appendChild(SVGBuilder.createText('Ratio', cx, cy + 15, {
            'text-anchor': 'middle', 'font-size': '12', fill: '#666'
        }));

        // Legend
        const leg = SVGBuilder.createGroup('legend', `translate(${cx - 60}, ${height - 60})`);
        leg.appendChild(SVGBuilder.createRect(0, 0, 15, 15, { fill: '#48bb78', rx: 2 }));
        leg.appendChild(SVGBuilder.createText(`Done: ${auditsDone}`, 20, 12, { 'font-size': '12', fill: '#666' }));
        leg.appendChild(SVGBuilder.createRect(0, 22, 15, 15, { fill: '#667eea', rx: 2 }));
        leg.appendChild(SVGBuilder.createText(`Received: ${auditsReceived}`, 20, 34, { 'font-size': '12', fill: '#666' }));
        g.appendChild(leg);

        // Status
        const color = parseFloat(ratio) >= 1 ? '#48bb78' : '#ed8936';
        const text = parseFloat(ratio) >= 1 ? 'Good' : 'Low';
        g.appendChild(SVGBuilder.createText(text, cx, 30, {
            'text-anchor': 'middle', 'font-size': '13', 'font-weight': 'bold', fill: color
        }));

        container.appendChild(svg);
    },

    createArc(cx, cy, innerR, outerR, startAngle, endAngle) {
        const start = (a) => ({ x: cx + outerR * Math.cos(a * Math.PI / 180), y: cy + outerR * Math.sin(a * Math.PI / 180) });
        const end = (a) => ({ x: cx + outerR * Math.cos(a * Math.PI / 180), y: cy + outerR * Math.sin(a * Math.PI / 180) });
        const inner = (a) => ({ x: cx + innerR * Math.cos(a * Math.PI / 180), y: cy + innerR * Math.sin(a * Math.PI / 180) });
        
        const large = endAngle - startAngle > 180 ? 1 : 0;
        const s = start(startAngle);
        const e = end(endAngle);
        const ie = inner(endAngle);
        const is = inner(startAngle);

        return `M ${s.x} ${s.y} A ${outerR} ${outerR} 0 ${large} 1 ${e.x} ${e.y} L ${ie.x} ${ie.y} A ${innerR} ${innerR} 0 ${large} 0 ${is.x} ${is.y} Z`;
    },

    showTooltip(e, label, count, pct) {
        let t = document.getElementById('audit-ratio-tooltip');
        if (!t) t = SVGBuilder.createTooltip('audit-ratio-tooltip');
        const c = `<div><b>${label}</b></div><div>${count} (${pct}%)</div>`;
        SVGBuilder.showTooltip(t, c, e.pageX, e.pageY);
    },

    hideTooltip() {
        const t = document.getElementById('audit-ratio-tooltip');
        if (t) SVGBuilder.hideTooltip(t);
    }
};

window.AuditRatio = AuditRatio;
Object.freeze(AuditRatio);