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
     * Get top N projects by XP
     * @param {Array} transactions - Array of transaction objects
     * @param {number} limit - Number of top projects to return
     * @returns {Array} Top N projects
     */
    getTopProjects(transactions, limit = 10) {
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
            .sort((a, b) => b.xp - a.xp)
            .slice(0, limit);
    }
};

// Freeze the DataProcessor object
Object.freeze(DataProcessor);