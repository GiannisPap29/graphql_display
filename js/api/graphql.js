/**
 * GraphQL API Handler
 * Handles all GraphQL queries and mutations
 */

const GraphQL = {
    /**
     * Execute a GraphQL query
     * @param {string} query - GraphQL query string
     * @param {object} variables - Query variables (optional)
     * @returns {Promise<object>} Query result data
     */
    async query(query, variables = {}) {
        try {
            // Check authentication
            if (!Auth.isAuthenticated()) {
                throw new Error('Not authenticated. Please login first.');
            }

            // Get auth headers
            const headers = {
                ...Auth.getAuthHeaders(),
                ...CONFIG.getProxyHeaders()
            };

            // Make the request (with CORS proxy if enabled)
            const response = await fetch(CONFIG.getGraphQLEndpoint(), {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    query: query,
                    variables: variables
                })
            });

            // Check if response is ok
            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired or invalid
                    Auth.logout();
                    throw new Error('Session expired. Please login again.');
                } else if (response.status === 403) {
                    throw new Error('Access forbidden. You do not have permission to access this resource.');
                } else if (response.status === 500) {
                    throw new Error('Server error. Please try again later.');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            // Parse JSON response
            const result = await response.json();

            // Check for GraphQL errors
            if (result.errors && result.errors.length > 0) {
                console.error('GraphQL errors:', result.errors);
                
                // Get the first error message
                const errorMessage = result.errors[0].message || 'GraphQL query failed';
                throw new Error(errorMessage);
            }

            // Return the data
            return {
                success: true,
                data: result.data
            };

        } catch (error) {
            console.error('GraphQL query error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    /**
     * Execute multiple GraphQL queries in parallel
     * @param {Array<object>} queries - Array of query objects {query, variables}
     * @returns {Promise<Array>} Array of query results
     */
    async queryBatch(queries) {
        try {
            const promises = queries.map(q => this.query(q.query, q.variables));
            const results = await Promise.all(promises);
            return results;
        } catch (error) {
            console.error('Batch query error:', error);
            throw error;
        }
    },

    /**
     * Execute a GraphQL query with retry logic
     * @param {string} query - GraphQL query string
     * @param {object} variables - Query variables (optional)
     * @param {number} maxRetries - Maximum number of retries (default: 3)
     * @returns {Promise<object>} Query result data
     */
    async queryWithRetry(query, variables = {}, maxRetries = 3) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await this.query(query, variables);
                
                if (result.success) {
                    return result;
                }
                
                lastError = result.error;
                
                // Don't retry on authentication errors
                if (result.error && result.error.includes('authenticated')) {
                    break;
                }
                
            } catch (error) {
                lastError = error.message;
                console.warn(`Query attempt ${attempt} failed:`, error);
                
                // Wait before retrying (exponential backoff)
                if (attempt < maxRetries) {
                    await this.sleep(Math.pow(2, attempt) * 100);
                }
            }
        }
        
        return {
            success: false,
            error: lastError || 'Query failed after multiple attempts'
        };
    },

    /**
     * Helper function to sleep/delay
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Test GraphQL connection
     * @returns {Promise<boolean>} True if connection successful
     */
    async testConnection() {
        try {
            const result = await this.query(`
                query {
                    user {
                        id
                    }
                }
            `);
            
            return result.success;
        } catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    },

    /**
     * Get current user basic info
     * @returns {Promise<object>} User data
     */
    async getCurrentUser() {
        const result = await this.query(`
            query {
                user {
                    id
                    login
                    campus
                    attrs
                    createdAt
                    updatedAt
                }
            }
        `);

        if (result.success && result.data.user && result.data.user.length > 0) {
            return {
                success: true,
                data: result.data.user[0]
            };
        }

        return {
            success: false,
            error: 'Could not fetch user data'
        };
    },

    /**
     * Build a GraphQL query with filters
     * @param {string} table - Table name
     * @param {Array<string>} fields - Fields to select
     * @param {object} where - Where conditions
     * @param {object} orderBy - Order by conditions
     * @param {number} limit - Limit results
     * @returns {string} GraphQL query string
     */
    buildQuery(table, fields, where = {}, orderBy = {}, limit = null) {
        let query = `query {\n  ${table}`;
        
        // Add parameters
        const params = [];
        
        if (Object.keys(where).length > 0) {
            params.push(`where: ${JSON.stringify(where)}`);
        }
        
        if (Object.keys(orderBy).length > 0) {
            params.push(`order_by: ${JSON.stringify(orderBy)}`);
        }
        
        if (limit !== null) {
            params.push(`limit: ${limit}`);
        }
        
        if (params.length > 0) {
            query += `(${params.join(', ')})`;
        }
        
        // Add fields
        query += ` {\n    ${fields.join('\n    ')}\n  }\n}`;
        
        return query;
    },

    /**
     * Get aggregate data (count, sum, avg, etc.)
     * @param {string} table - Table name
     * @param {object} where - Where conditions
     * @param {Array<string>} aggregates - Aggregate functions (count, sum, avg, max, min)
     * @returns {Promise<object>} Aggregate results
     */
    async getAggregate(table, where = {}, aggregates = ['count']) {
        const aggregateFields = aggregates.map(agg => {
            if (agg === 'count') {
                return 'count';
            }
            return agg;
        }).join('\n        ');

        const whereClause = Object.keys(where).length > 0 
            ? `(where: ${JSON.stringify(where)})` 
            : '';

        const query = `
            query {
                ${table}_aggregate${whereClause} {
                    aggregate {
                        ${aggregateFields}
                    }
                }
            }
        `;

        return await this.query(query);
    },

    /**
     * Format GraphQL error for display
     * @param {object} error - Error object
     * @returns {string} Formatted error message
     */
    formatError(error) {
        if (typeof error === 'string') {
            return error;
        }

        if (error.message) {
            return error.message;
        }

        if (error.error) {
            return error.error;
        }

        return 'An unknown error occurred';
    }
};

// Freeze the GraphQL object to prevent modifications
Object.freeze(GraphQL);
