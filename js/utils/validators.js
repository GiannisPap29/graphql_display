/**
 * Validators Utility
 * Input validation functions
 */

const Validators = {
    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid
     */
    isValidEmail(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    },

    /**
     * Validate username
     * @param {string} username - Username to validate
     * @param {number} minLength - Minimum length (default: 3)
     * @param {number} maxLength - Maximum length (default: 50)
     * @returns {object} {valid: boolean, error: string}
     */
    validateUsername(username, minLength = 3, maxLength = 50) {
        if (!username || typeof username !== 'string') {
            return { valid: false, error: 'Username is required' };
        }

        const trimmed = username.trim();

        if (trimmed.length < minLength) {
            return { valid: false, error: `Username must be at least ${minLength} characters` };
        }

        if (trimmed.length > maxLength) {
            return { valid: false, error: `Username must not exceed ${maxLength} characters` };
        }

        // Check for valid characters (alphanumeric, underscore, hyphen)
        const usernameRegex = /^[a-zA-Z0-9_-]+$/;
        if (!usernameRegex.test(trimmed)) {
            return { valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
        }

        return { valid: true, error: null };
    },

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @param {number} minLength - Minimum length (default: 8)
     * @returns {object} {valid: boolean, error: string, strength: string}
     */
    validatePassword(password, minLength = 8) {
        if (!password || typeof password !== 'string') {
            return { valid: false, error: 'Password is required', strength: 'none' };
        }

        if (password.length < minLength) {
            return { 
                valid: false, 
                error: `Password must be at least ${minLength} characters`, 
                strength: 'weak' 
            };
        }

        // Check password strength
        let strength = 'weak';
        let strengthScore = 0;

        // Has lowercase
        if (/[a-z]/.test(password)) strengthScore++;
        
        // Has uppercase
        if (/[A-Z]/.test(password)) strengthScore++;
        
        // Has numbers
        if (/[0-9]/.test(password)) strengthScore++;
        
        // Has special characters
        if (/[^a-zA-Z0-9]/.test(password)) strengthScore++;
        
        // Length bonus
        if (password.length >= 12) strengthScore++;

        if (strengthScore >= 4) {
            strength = 'strong';
        } else if (strengthScore >= 2) {
            strength = 'medium';
        }

        return { 
            valid: true, 
            error: null, 
            strength,
            score: strengthScore
        };
    },

    /**
     * Validate required field
     * @param {any} value - Value to validate
     * @param {string} fieldName - Field name for error message
     * @returns {object} {valid: boolean, error: string}
     */
    validateRequired(value, fieldName = 'Field') {
        if (value === null || value === undefined || value === '') {
            return { valid: false, error: `${fieldName} is required` };
        }

        if (typeof value === 'string' && value.trim() === '') {
            return { valid: false, error: `${fieldName} cannot be empty` };
        }

        return { valid: true, error: null };
    },

    /**
     * Validate string length
     * @param {string} str - String to validate
     * @param {number} min - Minimum length
     * @param {number} max - Maximum length
     * @param {string} fieldName - Field name for error message
     * @returns {object} {valid: boolean, error: string}
     */
    validateLength(str, min, max, fieldName = 'Field') {
        if (typeof str !== 'string') {
            return { valid: false, error: `${fieldName} must be a string` };
        }

        const length = str.length;

        if (length < min) {
            return { valid: false, error: `${fieldName} must be at least ${min} characters` };
        }

        if (length > max) {
            return { valid: false, error: `${fieldName} must not exceed ${max} characters` };
        }

        return { valid: true, error: null };
    },

    /**
     * Validate number range
     * @param {number} num - Number to validate
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @param {string} fieldName - Field name for error message
     * @returns {object} {valid: boolean, error: string}
     */
    validateRange(num, min, max, fieldName = 'Value') {
        if (typeof num !== 'number' || isNaN(num)) {
            return { valid: false, error: `${fieldName} must be a number` };
        }

        if (num < min) {
            return { valid: false, error: `${fieldName} must be at least ${min}` };
        }

        if (num > max) {
            return { valid: false, error: `${fieldName} must not exceed ${max}` };
        }

        return { valid: true, error: null };
    },

    /**
     * Validate URL
     * @param {string} url - URL to validate
     * @returns {boolean} True if valid URL
     */
    isValidURL(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }

        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Validate date
     * @param {string|Date} date - Date to validate
     * @returns {boolean} True if valid date
     */
    isValidDate(date) {
        const d = date instanceof Date ? date : new Date(date);
        return !isNaN(d.getTime());
    },

    /**
     * Validate phone number (basic validation)
     * @param {string} phone - Phone number to validate
     * @returns {boolean} True if valid
     */
    isValidPhone(phone) {
        if (!phone || typeof phone !== 'string') {
            return false;
        }

        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        
        // Check if it has 10-15 digits
        return cleaned.length >= 10 && cleaned.length <= 15;
    },

    /**
     * Validate JSON string
     * @param {string} jsonString - JSON string to validate
     * @returns {object} {valid: boolean, error: string, data: object}
     */
    validateJSON(jsonString) {
        if (!jsonString || typeof jsonString !== 'string') {
            return { valid: false, error: 'Invalid JSON string', data: null };
        }

        try {
            const data = JSON.parse(jsonString);
            return { valid: true, error: null, data };
        } catch (e) {
            return { valid: false, error: e.message, data: null };
        }
    },

    /**
     * Validate alphanumeric string
     * @param {string} str - String to validate
     * @returns {boolean} True if alphanumeric
     */
    isAlphanumeric(str) {
        if (!str || typeof str !== 'string') {
            return false;
        }

        return /^[a-zA-Z0-9]+$/.test(str);
    },

    /**
     * Validate numeric string
     * @param {string} str - String to validate
     * @returns {boolean} True if numeric
     */
    isNumeric(str) {
        if (!str || typeof str !== 'string') {
            return false;
        }

        return /^[0-9]+$/.test(str);
    },

    /**
     * Sanitize string (remove HTML tags)
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    sanitizeString(str) {
        if (!str || typeof str !== 'string') {
            return '';
        }

        return str.replace(/[<>]/g, '');
    },

    /**
     * Escape HTML special characters
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    escapeHTML(str) {
        if (!str || typeof str !== 'string') {
            return '';
        }

        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return str.replace(/[&<>"']/g, m => map[m]);
    },

    /**
     * Validate form data
     * @param {object} formData - Form data object
     * @param {object} rules - Validation rules
     * @returns {object} {valid: boolean, errors: object}
     */
    validateForm(formData, rules) {
        const errors = {};
        let valid = true;

        for (const field in rules) {
            const rule = rules[field];
            const value = formData[field];

            // Required check
            if (rule.required) {
                const requiredCheck = this.validateRequired(value, field);
                if (!requiredCheck.valid) {
                    errors[field] = requiredCheck.error;
                    valid = false;
                    continue;
                }
            }

            // Skip other validations if field is empty and not required
            if (!value && !rule.required) {
                continue;
            }

            // Email validation
            if (rule.type === 'email' && !this.isValidEmail(value)) {
                errors[field] = 'Invalid email address';
                valid = false;
            }

            // Length validation
            if (rule.minLength || rule.maxLength) {
                const min = rule.minLength || 0;
                const max = rule.maxLength || Infinity;
                const lengthCheck = this.validateLength(value, min, max, field);
                if (!lengthCheck.valid) {
                    errors[field] = lengthCheck.error;
                    valid = false;
                }
            }

            // Custom validation function
            if (rule.validate && typeof rule.validate === 'function') {
                const customCheck = rule.validate(value);
                if (!customCheck.valid) {
                    errors[field] = customCheck.error;
                    valid = false;
                }
            }
        }

        return { valid, errors };
    },

    /**
     * Check if value is empty
     * @param {any} value - Value to check
     * @returns {boolean} True if empty
     */
    isEmpty(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string' && value.trim() === '') return true;
        if (Array.isArray(value) && value.length === 0) return true;
        if (typeof value === 'object' && Object.keys(value).length === 0) return true;
        return false;
    },

    /**
     * Trim all string values in an object
     * @param {object} obj - Object to trim
     * @returns {object} Trimmed object
     */
    trimObject(obj) {
        const trimmed = {};
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                trimmed[key] = obj[key].trim();
            } else {
                trimmed[key] = obj[key];
            }
        }
        return trimmed;
    }
};

// Freeze the Validators object
Object.freeze(Validators);