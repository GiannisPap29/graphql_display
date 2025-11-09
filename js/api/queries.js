/**
 * GraphQL Queries Collection
 * Contains all pre-defined queries for the application
 * OPTIMIZED: Contains only actively used queries
 */

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
     * Get all XP transactions for the user
     * Used in: profile.html (line 293) - XPTimeline graph
     */
    getXPTransactions: `
        query {
            transaction(
                where: { type: { _eq: "xp" } }
                order_by: { createdAt: asc }
            ) {
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
            }
        }   
    `,

    /**
     * Get total XP amount
     * Used in: profile.html (line 251) - Stats cards
     */
    getTotalXP: `
        query {
            transaction_aggregate(where: { type: { _eq: "xp" } }) {
                aggregate {
                    sum {
                        amount
                    }
                    count
                }
            }
        }
    `,

    /**
     * Get audit ratio (done vs received)
     * Used in: profile.html (lines 256, 303) - Stats cards & AuditRatio graph
     */
    getAuditRatio: `
        query($userId: Int!) {
            auditorAudits: audit_aggregate(
                where: { auditorId: { _eq: $userId } }
            ) {
                aggregate {
                    count
                }
            }
            receivedAudits: audit_aggregate(
                where: { 
                    group: { 
                        members: { 
                            userId: { _eq: $userId } 
                        } 
                    } 
                }
            ) {
                aggregate {
                    count
                }
            }
        }
    `,

    /**
     * Get audit ratio without variables (for "all" events)
     */
    getAuditRatioAll(userId) {
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
     * Get pass/fail statistics
     * Used in: profile.html (lines 261, 313) - Stats cards & ProjectStats graph
     */
    getPassFailStats: `
        query($userId: Int!) {
            passed: result_aggregate(
                where: { 
                    userId: { _eq: $userId },
                    grade: { _gte: 1 }
                }
            ) {
                aggregate {
                    count
                }
            }
            failed: result_aggregate(
                where: { 
                    userId: { _eq: $userId },
                    grade: { _lt: 1 }
                }
            ) {
                aggregate {
                    count
                }
            }
        }
    `,

    /**
     * Get pass/fail stats without variables (for "all" events)
     */
    getPassFailStatsAll(userId) {
        return `
            query {
                passed: result_aggregate(
                    where: { 
                        userId: { _eq: ${userId} },
                        grade: { _gte: 1 }
                    }
                ) {
                    aggregate {
                        count
                    }
                }
                failed: result_aggregate(
                    where: { 
                        userId: { _eq: ${userId} },
                        grade: { _lt: 1 }
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
     * Get XP by project type
     * Used in: profile.html (line 323) - XPByProject graph
     */
    getXPByProject: `
        query {
            transaction(
                where: { type: { _eq: "xp" } }
            ) {
                amount
                object {
                    name
                    type
                }
            }
        }
    `,

    /**
     * Get XP by project filtered by event
     * @param {string} eventPath - Path pattern for filtering (e.g., "/athens/piscine-go/%")
     */
    getXPByProjectByEvent(eventPath) {
        return `
            query {
                transaction(
                    where: { 
                        type: { _eq: "xp" },
                        path: { _like: "${eventPath}" }
                    }
                ) {
                    amount
                    path
                    object {
                        name
                        type
                    }
                }
            }
        `;
    },

    // ========================================
    // EVENT-SPECIFIC QUERIES
    // ========================================

    /**
     * Get XP transactions filtered by event type
     * @param {string} eventPath - Path pattern for filtering (e.g., "/athens/piscine-go/%")
     */
    getXPTransactionsByEvent(eventPath) {
        return `
            query {
                transaction(
                    where: { 
                        type: { _eq: "xp" },
                        path: { _like: "${eventPath}" }
                    }
                    order_by: { createdAt: asc }
                ) {
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
                }
            }
        `;
    },

    /**
     * Get total XP for specific event
     */
    getTotalXPByEvent(eventPath) {
        return `
            query {
                transaction_aggregate(
                    where: { 
                        type: { _eq: "xp" },
                        path: { _like: "${eventPath}" }
                    }
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
     * Get pass/fail stats for specific event
     */
    getPassFailStatsByEvent(userId, eventPath) {
        return `
            query {
                passed: result_aggregate(
                    where: { 
                        userId: { _eq: ${userId} },
                        grade: { _gte: 1 },
                        path: { _like: "${eventPath}" }
                    }
                ) {
                    aggregate {
                        count
                    }
                }
                failed: result_aggregate(
                    where: { 
                        userId: { _eq: ${userId} },
                        grade: { _lt: 1 },
                        path: { _like: "${eventPath}" }
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
     * Get audit ratio for specific event
     */
    /**
     * Get audit ratio for specific event
     * NOTE: Audit records don't expose path information in the schema,
     * so we fall back to global counts to avoid query errors.
     */
    getAuditRatioByEvent(userId, eventPath) { // eventPath kept for API consistency
        return `
            query {
                auditorAudits: audit_aggregate(
                    where: { 
                        auditorId: { _eq: ${userId} }
                    }
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
    }
};

/**
 * Event path patterns for filtering
 */
const EventPaths = {
    ALL: '%',                                    // All events
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

    const eventPath = pathMap[eventType] || EventPaths.ALL;

    // For "all" events, use the non-variable versions
    if (eventType === 'all') {
        return {
            xpTransactions: Queries.getXPTransactions,
            totalXP: Queries.getTotalXP,
            passFailStats: userId ? Queries.getPassFailStatsAll(userId) : null,
            xpByProject: Queries.getXPByProject,
            auditRatio: userId ? Queries.getAuditRatioAll(userId) : null
        };
    }

    // For specific events, use filtered queries
    return {
        xpTransactions: Queries.getXPTransactionsByEvent(eventPath),
        totalXP: Queries.getTotalXPByEvent(eventPath),
        passFailStats: userId ? Queries.getPassFailStatsByEvent(userId, eventPath) : null,
        xpByProject: Queries.getXPByProjectByEvent(eventPath),
        auditRatio: userId ? Queries.getAuditRatioByEvent(userId, eventPath) : null
    };
};

// Freeze the Queries object to prevent modifications
Object.freeze(Queries);
Object.freeze(EventPaths);
