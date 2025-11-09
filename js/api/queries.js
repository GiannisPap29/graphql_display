/**
 * GraphQL Queries Collection
 * Contains all pre-defined queries for the application
 * OPTIMIZED: Contains only actively used queries
 */

const XP_TRANSACTION_FIELDS = `
                id
                type
                amount
                createdAt
                path
                objectId
                object {
                    id
                    name
                    type
                }
            `;

const Queries = {
    /**
     * Get user profile information
     * Used in: profile.html (line 214)
     */
    getUserProfile: `
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
    `,

    /**
     * Get XP transactions (optionally filtered by event)
     * Used in: profile.html (line 293) - XPTimeline graph
     */
    getXPTransactions(eventPath = null) {
        const xpWhere = buildXPWhereClause(eventPath);
        return `
            query {
                transaction(
                    ${xpWhere}
                    order_by: { createdAt: asc }
                ) {
                    ${XP_TRANSACTION_FIELDS}
                }
            }
        `;
    },

    /**
     * Get total XP amount (optionally filtered by event)
     * Used in: profile.html (line 251) - Stats cards
     */
    getTotalXP(eventPath = null) {
        const xpWhere = buildXPWhereClause(eventPath);
        return `
            query {
                transaction_aggregate(
                    ${xpWhere}
                ) {
                    aggregate {
                        sum {
                            amount
                        }
                        count
                    }
                }
            }
        `;
    },

    /**
     * Get audit ratio (done vs received)
     * Used in: profile.html (lines 256, 303) - Stats cards & AuditRatio graph
     */
    getAuditRatio(userId) {
        return `
            query {
                auditorAudits: audit_aggregate(
                    where: { auditorId: { _eq: ${userId} } }
                ) {
                    aggregate {
                        count
                    }
                }
                receivedAudits: audit_aggregate(
                    where: { 
                        group: { 
                            members: { 
                                userId: { _eq: ${userId} } 
                            } 
                        } 
                    }
                ) {
                    aggregate {
                        count
                    }
                }
            }
        `;
    },

    /**
     * Get pass/fail statistics (optionally filtered by event)
     * Used in: profile.html (lines 261, 313) - Stats cards & ProjectStats graph
     */
    getPassFailStats(userId, eventPath = null) {
        const passedWhere = buildResultWhereClause(userId, 'grade: { _gte: 1 }', eventPath);
        const failedWhere = buildResultWhereClause(userId, 'grade: { _lt: 1 }', eventPath);
        return `
            query {
                passed: result_aggregate(
                    ${passedWhere}
                ) {
                    aggregate {
                        count
                    }
                }
                failed: result_aggregate(
                    ${failedWhere}
                ) {
                    aggregate {
                        count
                    }
                }
            }
        `;
    },

};

/**
 * Event path patterns for filtering
 */
const EventPaths = {
    ALL: null,                                    // All events (no path filter)
    PISCINE_GO: '/athens/piscine-go/%',         // Piscine Go
    PISCINE_JS: '/athens/div-01/piscine-js/%',  // Piscine JS
    MODULE: '/athens/div-01/%',                  // Div-01 Module (includes piscine-js)
};

/**
 * Helper to get queries for a specific event
 * @param {string} eventType - 'all', 'piscine-go', 'piscine-js', 'module'
 * @param {number} userId - User ID for queries that need it
 * @returns {object} Object with all queries for that event
 */
const getEventQueries = (eventType, userId = null) => {
    const pathMap = {
        'all': EventPaths.ALL,
        'piscine-go': EventPaths.PISCINE_GO,
        'piscine-js': EventPaths.PISCINE_JS,
        'module': EventPaths.MODULE
    };

    const eventPath = Object.prototype.hasOwnProperty.call(pathMap, eventType)
        ? pathMap[eventType]
        : EventPaths.ALL;

    return {
        xpTransactions: Queries.getXPTransactions(eventPath),
        totalXP: Queries.getTotalXP(eventPath),
        passFailStats: userId ? Queries.getPassFailStats(userId, eventPath) : null,
        auditRatio: userId ? Queries.getAuditRatio(userId) : null
    };
};

// Freeze the Queries object to prevent modifications
Object.freeze(Queries);
Object.freeze(EventPaths);

/**
 * Helper: build XP transaction where clause with optional path filter
 * @param {string|null} eventPath
 * @returns {string}
 */
function buildXPWhereClause(eventPath) {
    const filters = ['type: { _eq: "xp" }'];
    if (eventPath) {
        filters.push(`path: { _like: "${eventPath}" }`);
    }
    return `where: { ${filters.join(', ')} }`;
}

/**
 * Helper: build result aggregate where clause with optional path filter
 * @param {number} userId
 * @param {string} gradeFilter
 * @param {string|null} eventPath
 * @returns {string}
 */
function buildResultWhereClause(userId, gradeFilter, eventPath) {
    const filters = [
        `userId: { _eq: ${userId} }`,
        gradeFilter
    ];
    if (eventPath) {
        filters.push(`path: { _like: "${eventPath}" }`);
    }
    return `where: { ${filters.join(', ')} }`;
}
