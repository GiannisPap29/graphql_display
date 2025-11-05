/**
 * Data Processor Utility
 * Processes and transforms data for display and graphs
 */

const DataProcessor = {
    /**
     * Process XP transactions for timeline graph
     * @param {Array} transactions - Array of transaction objects
     * @returns {Array} Processed data with cumulative XP
     */
    processXPTimeline(transactions) {
        if (!transactions || transactions.length === 0) {
            return [];
        }

        // Sort by date
        const sorted = [...transactions].sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
        });

        // Calculate cumulative XP
        let cumulative = 0;
        return sorted.map(transaction => {
            cumulative += transaction.amount;
            return {
                date: new Date(transaction.createdAt),
                amount: transaction.amount,
                cumulative: cumulative,
                path: transaction.path,
                objectName: transaction.object?.name || 'Unknown'
            };
        });
    },

    /**
     * Group XP by project
     * @param {Array} transactions - Array of transaction objects
     * @returns {Array} Array of {name, xp} objects sorted by XP
     */
    groupXPByProject(transactions) {
        if (!transactions || transactions.length === 0) {
            return [];
        }

        const projectMap = new Map();

        transactions.forEach(transaction => {
            const projectName = transaction.object?.name || 'Unknown';
            const currentXP = projectMap.get(projectName) || 0;
            projectMap.set(projectName, currentXP + transaction.amount);
        });

        // Convert to array and sort by XP (descending)
        return Array.from(projectMap.entries())
            .map(([name, xp]) => ({ name, xp }))
            .sort((a, b) => b.xp - a.xp);
    },

    /**
     * Get top N projects by XP
     * @param {Array} transactions - Array of transaction objects
     * @param {number} limit - Number of top projects to return
     * @returns {Array} Top N projects
     */
    getTopProjects(transactions, limit = 10) {
        const grouped = this.groupXPByProject(transactions);
        return grouped.slice(0, limit);
    },

    /**
     * Calculate audit ratio
     * @param {number} auditsDone - Number of audits done
     * @param {number} auditsReceived - Number of audits received
     * @returns {object} Ratio data
     */
    calculateAuditRatio(auditsDone, auditsReceived) {
        const ratio = auditsReceived > 0 ? auditsDone / auditsReceived : 0;
        
        return {
            done: auditsDone,
            received: auditsReceived,
            ratio: ratio,
            ratioString: ratio.toFixed(2),
            percentage: {
                done: auditsReceived > 0 ? (auditsDone / (auditsDone + auditsReceived) * 100) : 0,
                received: auditsReceived > 0 ? (auditsReceived / (auditsDone + auditsReceived) * 100) : 0
            },
            status: ratio >= 1 ? 'good' : ratio >= 0.5 ? 'average' : 'low'
        };
    },

    /**
     * Calculate pass/fail statistics
     * @param {Array} results - Array of result objects
     * @returns {object} Pass/fail statistics
     */
    calculatePassFailStats(results) {
        if (!results || results.length === 0) {
            return {
                passed: 0,
                failed: 0,
                total: 0,
                passRate: 0,
                failRate: 0
            };
        }

        const passed = results.filter(r => r.grade >= 1).length;
        const failed = results.filter(r => r.grade < 1).length;
        const total = results.length;

        return {
            passed,
            failed,
            total,
            passRate: total > 0 ? (passed / total * 100) : 0,
            failRate: total > 0 ? (failed / total * 100) : 0,
            passRateString: total > 0 ? (passed / total * 100).toFixed(1) + '%' : '0%',
            failRateString: total > 0 ? (failed / total * 100).toFixed(1) + '%' : '0%'
        };
    },

    /**
     * Group data by date (day, month, year)
     * @param {Array} data - Array of objects with createdAt property
     * @param {string} groupBy - 'day', 'month', or 'year'
     * @returns {Map} Grouped data
     */
    groupByDate(data, groupBy = 'month') {
        const grouped = new Map();

        data.forEach(item => {
            const date = new Date(item.createdAt);
            let key;

            switch (groupBy) {
                case 'day':
                    key = date.toISOString().split('T')[0];
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                case 'year':
                    key = date.getFullYear().toString();
                    break;
                default:
                    key = date.toISOString().split('T')[0];
            }

            if (!grouped.has(key)) {
                grouped.set(key, []);
            }
            grouped.get(key).push(item);
        });

        return grouped;
    },

    /**
     * Calculate XP per month
     * @param {Array} transactions - Array of transaction objects
     * @returns {Array} XP per month
     */
    calculateXPPerMonth(transactions) {
        if (!transactions || transactions.length === 0) {
            return [];
        }

        const monthlyMap = new Map();

        transactions.forEach(transaction => {
            const date = new Date(transaction.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            const current = monthlyMap.get(key) || 0;
            monthlyMap.set(key, current + transaction.amount);
        });

        // Convert to array and sort by date
        return Array.from(monthlyMap.entries())
            .map(([month, xp]) => ({ month, xp }))
            .sort((a, b) => a.month.localeCompare(b.month));
    },

    /**
     * Get recent activity
     * @param {Array} transactions - Transaction array
     * @param {Array} results - Results array
     * @param {number} limit - Number of items to return
     * @returns {Array} Combined and sorted activity
     */
    getRecentActivity(transactions, results, limit = 10) {
        const combined = [];

        // Add transactions
        if (transactions) {
            transactions.forEach(t => {
                combined.push({
                    type: 'transaction',
                    subtype: t.type,
                    date: new Date(t.createdAt),
                    amount: t.amount,
                    name: t.object?.name || 'Unknown',
                    path: t.path
                });
            });
        }

        // Add results
        if (results) {
            results.forEach(r => {
                combined.push({
                    type: 'result',
                    subtype: r.grade >= 1 ? 'pass' : 'fail',
                    date: new Date(r.createdAt),
                    grade: r.grade,
                    name: r.object?.name || 'Unknown',
                    path: r.path
                });
            });
        }

        // Sort by date (most recent first)
        combined.sort((a, b) => b.date - a.date);

        return combined.slice(0, limit);
    },

    /**
     * Calculate statistics summary
     * @param {object} data - All data
     * @returns {object} Summary statistics
     */
    calculateSummary(data) {
        const summary = {
            totalXP: 0,
            totalProjects: 0,
            passedProjects: 0,
            failedProjects: 0,
            auditsDone: 0,
            auditsReceived: 0,
            averageGrade: 0
        };

        if (data.transactions) {
            summary.totalXP = data.transactions
                .filter(t => t.type === 'xp')
                .reduce((sum, t) => sum + t.amount, 0);
        }

        if (data.results) {
            summary.totalProjects = data.results.length;
            summary.passedProjects = data.results.filter(r => r.grade >= 1).length;
            summary.failedProjects = data.results.filter(r => r.grade < 1).length;
            
            const totalGrade = data.results.reduce((sum, r) => sum + r.grade, 0);
            summary.averageGrade = data.results.length > 0 
                ? (totalGrade / data.results.length).toFixed(2) 
                : 0;
        }

        if (data.auditsDone !== undefined) {
            summary.auditsDone = data.auditsDone;
        }

        if (data.auditsReceived !== undefined) {
            summary.auditsReceived = data.auditsReceived;
        }

        return summary;
    },

    /**
     * Filter data by date range
     * @param {Array} data - Array of objects with createdAt
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Array} Filtered data
     */
    filterByDateRange(data, startDate, endDate) {
        if (!data || data.length === 0) {
            return [];
        }

        return data.filter(item => {
            const date = new Date(item.createdAt);
            return date >= startDate && date <= endDate;
        });
    },

    /**
     * Calculate average
     * @param {Array} values - Array of numbers
     * @returns {number} Average
     */
    average(values) {
        if (!values || values.length === 0) return 0;
        const sum = values.reduce((acc, val) => acc + val, 0);
        return sum / values.length;
    },

    /**
     * Find min value
     * @param {Array} values - Array of numbers
     * @returns {number} Minimum value
     */
    min(values) {
        if (!values || values.length === 0) return 0;
        return Math.min(...values);
    },

    /**
     * Find max value
     * @param {Array} values - Array of numbers
     * @returns {number} Maximum value
     */
    max(values) {
        if (!values || values.length === 0) return 0;
        return Math.max(...values);
    },

    /**
     * Normalize values to 0-1 range
     * @param {Array} values - Array of numbers
     * @returns {Array} Normalized values
     */
    normalize(values) {
        if (!values || values.length === 0) return [];
        
        const minVal = this.min(values);
        const maxVal = this.max(values);
        const range = maxVal - minVal;

        if (range === 0) return values.map(() => 0);

        return values.map(val => (val - minVal) / range);
    },

    /**
     * Round number to decimal places
     * @param {number} num - Number to round
     * @param {number} decimals - Number of decimal places
     * @returns {number} Rounded number
     */
    round(num, decimals = 2) {
        return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }
};

// Freeze the DataProcessor object
Object.freeze(DataProcessor);