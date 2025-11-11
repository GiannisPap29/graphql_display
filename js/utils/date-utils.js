/**
 * Date Utilities
 * Helper functions for date formatting and manipulation
 */

const DateUtils = {
    /**
     * Format date to readable string
     * @param {Date|string} date - Date object or ISO string
     * @param {string} format - Format type: 'short', 'long', 'full', 'time', 'datetime'
     * @returns {string} Formatted date string
     */
    format(date, format = 'long') {
        try {
            const d = typeof date === 'string' ? new Date(date) : date;
            
            if (isNaN(d.getTime())) {
                return 'Invalid Date';
            }

            switch (format) {
                case 'short':
                    return d.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });
                
                case 'long':
                    return d.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    });
                
                case 'full':
                    return d.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    });
                
                case 'time':
                    return d.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                
                case 'datetime':
                    return d.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                
                case 'iso':
                    return d.toISOString();
                
                case 'compact':
                    return d.toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: '2-digit'
                    });
                
                default:
                    return d.toLocaleDateString('en-US');
            }
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    }
};

// Freeze the DateUtils object
Object.freeze(DateUtils);