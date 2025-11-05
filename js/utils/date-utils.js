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
    },

    /**
     * Get relative time string (e.g., "2 days ago", "in 3 hours")
     * @param {Date|string} date - Date object or ISO string
     * @returns {string} Relative time string
     */
    getRelativeTime(date) {
        try {
            const d = typeof date === 'string' ? new Date(date) : date;
            const now = new Date();
            const diffMs = now - d;
            const diffSec = Math.floor(diffMs / 1000);
            const diffMin = Math.floor(diffSec / 60);
            const diffHour = Math.floor(diffMin / 60);
            const diffDay = Math.floor(diffHour / 24);
            const diffWeek = Math.floor(diffDay / 7);
            const diffMonth = Math.floor(diffDay / 30);
            const diffYear = Math.floor(diffDay / 365);

            if (diffSec < 60) {
                return 'just now';
            } else if (diffMin < 60) {
                return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
            } else if (diffHour < 24) {
                return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
            } else if (diffDay < 7) {
                return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
            } else if (diffWeek < 4) {
                return `${diffWeek} week${diffWeek !== 1 ? 's' : ''} ago`;
            } else if (diffMonth < 12) {
                return `${diffMonth} month${diffMonth !== 1 ? 's' : ''} ago`;
            } else {
                return `${diffYear} year${diffYear !== 1 ? 's' : ''} ago`;
            }
        } catch (error) {
            console.error('Error getting relative time:', error);
            return 'Unknown';
        }
    },

    /**
     * Get month name
     * @param {number} monthIndex - Month index (0-11)
     * @param {boolean} short - Use short month name
     * @returns {string} Month name
     */
    getMonthName(monthIndex, short = false) {
        const months = short 
            ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        return months[monthIndex] || 'Unknown';
    },

    /**
     * Get day name
     * @param {number} dayIndex - Day index (0-6, Sunday = 0)
     * @param {boolean} short - Use short day name
     * @returns {string} Day name
     */
    getDayName(dayIndex, short = false) {
        const days = short 
            ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        return days[dayIndex] || 'Unknown';
    },

    /**
     * Parse ISO date string to Date object
     * @param {string} isoString - ISO date string
     * @returns {Date} Date object
     */
    parseISO(isoString) {
        return new Date(isoString);
    },

    /**
     * Check if date is today
     * @param {Date|string} date - Date to check
     * @returns {boolean} True if date is today
     */
    isToday(date) {
        const d = typeof date === 'string' ? new Date(date) : date;
        const today = new Date();
        
        return d.getDate() === today.getDate() &&
               d.getMonth() === today.getMonth() &&
               d.getFullYear() === today.getFullYear();
    },

    /**
     * Check if date is yesterday
     * @param {Date|string} date - Date to check
     * @returns {boolean} True if date is yesterday
     */
    isYesterday(date) {
        const d = typeof date === 'string' ? new Date(date) : date;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        return d.getDate() === yesterday.getDate() &&
               d.getMonth() === yesterday.getMonth() &&
               d.getFullYear() === yesterday.getFullYear();
    },

    /**
     * Check if date is this week
     * @param {Date|string} date - Date to check
     * @returns {boolean} True if date is this week
     */
    isThisWeek(date) {
        const d = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        
        return d >= weekStart && d <= weekEnd;
    },

    /**
     * Get date range for a period
     * @param {string} period - 'week', 'month', 'year'
     * @returns {object} {start: Date, end: Date}
     */
    getDateRange(period) {
        const now = new Date();
        const start = new Date();
        
        switch (period) {
            case 'week':
                start.setDate(now.getDate() - 7);
                break;
            case 'month':
                start.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                start.setFullYear(now.getFullYear() - 1);
                break;
            default:
                start.setDate(now.getDate() - 7);
        }
        
        return { start, end: now };
    },

    /**
     * Calculate difference between two dates
     * @param {Date|string} date1 - First date
     * @param {Date|string} date2 - Second date
     * @param {string} unit - Unit: 'days', 'hours', 'minutes', 'seconds'
     * @returns {number} Difference in specified unit
     */
    diff(date1, date2, unit = 'days') {
        const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
        const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
        
        const diffMs = Math.abs(d2 - d1);
        
        switch (unit) {
            case 'seconds':
                return Math.floor(diffMs / 1000);
            case 'minutes':
                return Math.floor(diffMs / (1000 * 60));
            case 'hours':
                return Math.floor(diffMs / (1000 * 60 * 60));
            case 'days':
                return Math.floor(diffMs / (1000 * 60 * 60 * 24));
            case 'weeks':
                return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
            default:
                return Math.floor(diffMs / (1000 * 60 * 60 * 24));
        }
    },

    /**
     * Add time to a date
     * @param {Date|string} date - Base date
     * @param {number} amount - Amount to add
     * @param {string} unit - Unit: 'days', 'hours', 'minutes', 'seconds'
     * @returns {Date} New date
     */
    add(date, amount, unit = 'days') {
        const d = new Date(typeof date === 'string' ? new Date(date) : date);
        
        switch (unit) {
            case 'seconds':
                d.setSeconds(d.getSeconds() + amount);
                break;
            case 'minutes':
                d.setMinutes(d.getMinutes() + amount);
                break;
            case 'hours':
                d.setHours(d.getHours() + amount);
                break;
            case 'days':
                d.setDate(d.getDate() + amount);
                break;
            case 'weeks':
                d.setDate(d.getDate() + (amount * 7));
                break;
            case 'months':
                d.setMonth(d.getMonth() + amount);
                break;
            case 'years':
                d.setFullYear(d.getFullYear() + amount);
                break;
        }
        
        return d;
    },

    /**
     * Format duration in seconds to human readable string
     * @param {number} seconds - Duration in seconds
     * @returns {string} Formatted duration
     */
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        const parts = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
        
        return parts.join(' ');
    },

    /**
     * Get start of day
     * @param {Date|string} date - Date
     * @returns {Date} Start of day
     */
    startOfDay(date) {
        const d = new Date(typeof date === 'string' ? new Date(date) : date);
        d.setHours(0, 0, 0, 0);
        return d;
    },

    /**
     * Get end of day
     * @param {Date|string} date - Date
     * @returns {Date} End of day
     */
    endOfDay(date) {
        const d = new Date(typeof date === 'string' ? new Date(date) : date);
        d.setHours(23, 59, 59, 999);
        return d;
    },

    /**
     * Get timestamp
     * @param {Date|string} date - Date (optional, defaults to now)
     * @returns {number} Unix timestamp
     */
    getTimestamp(date = null) {
        const d = date ? (typeof date === 'string' ? new Date(date) : date) : new Date();
        return d.getTime();
    }
};

// Freeze the DateUtils object
Object.freeze(DateUtils);