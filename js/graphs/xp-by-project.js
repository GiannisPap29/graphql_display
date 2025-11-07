const XPByProject = {
    render(transactions) {
        const container = document.getElementById('xpByProjectGraph');
        if (!container) return;

        SVGBuilder.clearContainer(container);

        if (!transactions || transactions.length === 0) {
            this.showEmptyState(container);
            return;
        }

        const top = DataProcessor.getTopProjects(transactions, 10);
        if (top.length === 0) {
            this.showEmptyState(container);
            return;
        }

        this.createGraph(container, top);
    },

    createGraph(container, projects) {
        const width = 600;
        const barH = 35;
        const barS = 12;
        const height = projects.length * (barH + barS) + 100;
        const pad = { top: 60, right: 80, bottom: 30, left: 180 };
        const gw = width - pad.left - pad.right;

        const svg = SVGBuilder.createSVG(width, height, 'xp-by-project-svg');
        const g = SVGBuilder.createGroup('main', `translate(${pad.left}, ${pad.top})`);
        svg.appendChild(g);

        const maxXP = Math.max(...projects.map(p => p.xp));
        const totalXP = projects.reduce((s, p) => s + p.xp, 0);

        // Title
        g.appendChild(SVGBuilder.createText('Top Projects by XP', gw / 2, -30, {
            'text-anchor': 'middle', 'font-size': '14', 'font-weight': 'bold', fill: '#333'
        }));
        g.appendChild(SVGBuilder.createText(`Total: ${SVGBuilder.formatNumber(totalXP)} XP`, gw / 2, -15, {
            'text-anchor': 'middle', 'font-size': '12', fill: '#666'
        }));

        // Bars
        projects.forEach((p, i) => {
            const y = i * (barH + barS);
            const w = (p.xp / maxXP) * gw;
            const pct = ((p.xp / totalXP) * 100).toFixed(1);

            // BG
            g.appendChild(SVGBuilder.createRect(0, y, gw, barH, { fill: '#f5f5f5', rx: 4 }));

            // Bar
            const bar = SVGBuilder.createRect(0, y, w, barH, { fill: '#667eea', rx: 4, cursor: 'pointer' });
            bar.addEventListener('mouseenter', (e) => {
                bar.setAttribute('opacity', '0.8');
                this.showTooltip(e, p.name, p.xp, pct);
            });
            bar.addEventListener('mouseleave', () => {
                bar.setAttribute('opacity', '1');
                this.hideTooltip();
            });
            g.appendChild(bar);

            // Name
            const name = p.name.length > 25 ? p.name.substring(0, 22) + '...' : p.name;
            g.appendChild(SVGBuilder.createText(name, -10, y + barH / 2 + 4, {
                'text-anchor': 'end', 'font-size': '12', 'font-weight': '600', fill: '#555'
            }));

            // Value
            g.appendChild(SVGBuilder.createText(SVGBuilder.formatNumber(p.xp), gw + 10, y + barH / 2 + 4, {
                'text-anchor': 'start', 'font-size': '12', 'font-weight': 'bold', fill: '#667eea'
            }));

            // Rank
            const rank = SVGBuilder.createCircle(-140, y + barH / 2, 10, {
                fill: i < 3 ? '#fbbf24' : '#cbd5e0'
            });
            g.appendChild(rank);
            g.appendChild(SVGBuilder.createText((i + 1).toString(), -140, y + barH / 2 + 3, {
                'text-anchor': 'middle', 'font-size': '10', 'font-weight': 'bold',
                fill: i < 3 ? '#78350f' : '#555'
            }));
        });

        container.appendChild(svg);
    },

    showTooltip(e, name, xp, pct) {
        let t = document.getElementById('xp-project-tooltip');
        if (!t) t = SVGBuilder.createTooltip('xp-project-tooltip');
        const c = `<div><b>${name}</b></div><div>${SVGBuilder.formatNumber(xp)} XP (${pct}%)</div>`;
        SVGBuilder.showTooltip(t, c, e.pageX, e.pageY);
    },

    hideTooltip() {
        const t = document.getElementById('xp-project-tooltip');
        if (t) SVGBuilder.hideTooltip(t);
    },

    showEmptyState(c) {
        c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📊</div><h3>No Project Data</h3><p>Complete projects to see XP distribution!</p></div>';
    }
};

window.XPByProject = XPByProject;
Object.freeze(XPByProject);