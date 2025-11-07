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
    `
};

// Freeze the Queries object to prevent modifications
Object.freeze(Queries);