const ProjectStats = {
    render(data) {
        const container = document.getElementById('projectStatsGraph');
        if (!container) return;

        SVGBuilder.clearContainer(container);

        const passed = data?.passed?.aggregate?.count || 0;
        const failed = data?.failed?.aggregate?.count || 0;

        if (passed === 0 && failed === 0) {
            SVGBuilder.showEmptyState(container, '📈', 'No Project Data', 'Complete projects to see stats!');
            return;
        }

        this.createGraph(container, passed, failed);
    },

    createGraph(container, passed, failed) {
        const width = 500;
        const height = 350;
        const pad = { top: 50, right: 30, bottom: 60, left: 60 };
        const gw = width - pad.left - pad.right;
        const gh = height - pad.top - pad.bottom;

        const svg = SVGBuilder.createSVG(width, height, 'project-stats-svg');
        const g = SVGBuilder.createGroup('main', `translate(${pad.left}, ${pad.top})`);
        svg.appendChild(g);

        const total = passed + failed;
        const passRate = ((passed / total) * 100).toFixed(1);
        const max = Math.max(passed, failed);

        // Grid
        for (let i = 1; i < 3; i++) {
            const y = (gh / 3) * i;
            g.appendChild(SVGBuilder.createLine(0, y, gw, y, { stroke: '#e0e0e0', 'stroke-width': 1 }));
        }

        // Axes
        g.appendChild(SVGBuilder.createLine(0, gh, gw, gh, { stroke: '#666', 'stroke-width': 1 }));
        g.appendChild(SVGBuilder.createLine(0, 0, 0, gh, { stroke: '#666', 'stroke-width': 1 }));

        // Y labels
        for (let i = 0; i <= 3; i++) {
            const v = Math.round((max / 3) * i);
            const y = gh - ((gh / 3) * i);
            g.appendChild(SVGBuilder.createText(v.toString(), -8, y + 4, {
                'text-anchor': 'end', 'font-size': '11', fill: '#666'
            }));
        }

        // Bars
        const barW = 80;
        const passX = gw / 3 - barW / 2;
        const failX = (2 * gw / 3) - barW / 2;

        const passH = (passed / max) * gh;
        const passBar = SVGBuilder.createRect(passX, gh - passH, barW, passH, {
            fill: '#48bb78', rx: 4, cursor: 'pointer'
        });
        passBar.addEventListener('mouseenter', (e) => {
            passBar.setAttribute('opacity', '0.8');
            this.showTooltip(e, 'Passed', passed, passRate);
        });
        passBar.addEventListener('mouseleave', () => {
            passBar.setAttribute('opacity', '1');
            this.hideTooltip();
        });
        g.appendChild(passBar);

        const failH = (failed / max) * gh;
        const failBar = SVGBuilder.createRect(failX, gh - failH, barW, failH, {
            fill: '#f56565', rx: 4, cursor: 'pointer'
        });
        failBar.addEventListener('mouseenter', (e) => {
            failBar.setAttribute('opacity', '0.8');
            this.showTooltip(e, 'Failed', failed, ((failed/total)*100).toFixed(1));
        });
        failBar.addEventListener('mouseleave', () => {
            failBar.setAttribute('opacity', '1');
            this.hideTooltip();
        });
        g.appendChild(failBar);

        // Values
        if (passH > 25) {
            g.appendChild(SVGBuilder.createText(passed.toString(), passX + barW / 2, gh - passH - 8, {
                'text-anchor': 'middle', 'font-size': '14', 'font-weight': 'bold', fill: '#48bb78'
            }));
        }
        if (failH > 25) {
            g.appendChild(SVGBuilder.createText(failed.toString(), failX + barW / 2, gh - failH - 8, {
                'text-anchor': 'middle', 'font-size': '14', 'font-weight': 'bold', fill: '#f56565'
            }));
        }

        // Labels
        g.appendChild(SVGBuilder.createText('Passed', passX + barW / 2, gh + 20, {
            'text-anchor': 'middle', 'font-size': '13', 'font-weight': 'bold', fill: '#48bb78'
        }));
        g.appendChild(SVGBuilder.createText(`${passRate}%`, passX + barW / 2, gh + 35, {
            'text-anchor': 'middle', 'font-size': '11', fill: '#666'
        }));
        g.appendChild(SVGBuilder.createText('Failed', failX + barW / 2, gh + 20, {
            'text-anchor': 'middle', 'font-size': '13', 'font-weight': 'bold', fill: '#f56565'
        }));
        g.appendChild(SVGBuilder.createText(`${((failed/total)*100).toFixed(1)}%`, failX + barW / 2, gh + 35, {
            'text-anchor': 'middle', 'font-size': '11', fill: '#666'
        }));

        // Title
        g.appendChild(SVGBuilder.createText(`Total: ${total} Projects`, gw / 2, -25, {
            'text-anchor': 'middle', 'font-size': '14', 'font-weight': 'bold', fill: '#333'
        }));
        g.appendChild(SVGBuilder.createText(`Success Rate: ${passRate}%`, gw / 2, -10, {
            'text-anchor': 'middle', 'font-size': '12', fill: parseFloat(passRate) >= 50 ? '#48bb78' : '#ed8936'
        }));

        container.appendChild(svg);
    },

    showTooltip(e, label, count, pct) {
        let t = document.getElementById('project-stats-tooltip');
        if (!t) t = SVGBuilder.createTooltip('project-stats-tooltip');
        const c = `<div><b>${label}</b></div><div>${count} (${pct}%)</div>`;
        SVGBuilder.showTooltip(t, c, e.pageX, e.pageY);
    },

    hideTooltip() {
        const t = document.getElementById('project-stats-tooltip');
        if (t) SVGBuilder.hideTooltip(t);
    }
};

window.ProjectStats = ProjectStats;
Object.freeze(ProjectStats);