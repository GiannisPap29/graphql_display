/**
 * GraphQL Queries Collection
 * Contains all pre-defined queries for the application
 */

const Queries = {
    /**
     * Get user profile information
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
     * Get all transactions (XP, up, down)
     */
    getAllTransactions: `
        query {
            transaction(order_by: { createdAt: desc }) {
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
     * Get user's audit information (as auditor)
     */
    getAuditorAudits: `
        query($userId: Int!) {
            audit(
                where: { auditorId: { _eq: $userId } }
                order_by: { createdAt: desc }
            ) {
                id
                grade
                createdAt
                group {
                    id
                    path
                    object {
                        name
                        type
                    }
                    captainId
                }
            }
        }
    `,

    /**
     * Get audits received by user (through their groups)
     */
    getReceivedAudits: `
        query($userId: Int!) {
            audit(
                where: { 
                    group: { 
                        members: { 
                            userId: { _eq: $userId } 
                        } 
                    } 
                }
                order_by: { createdAt: desc }
            ) {
                id
                grade
                createdAt
                auditorId
                group {
                    id
                    path
                    object {
                        name
                        type
                    }
                }
            }
        }
    `,

    /**
     * Get audit ratio (done vs received)
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
     * Get user progress on all objects
     */
    getUserProgress: `
        query($userId: Int!) {
            progress(
                where: { userId: { _eq: $userId } }
                order_by: { createdAt: desc }
            ) {
                id
                grade
                isDone
                createdAt
                updatedAt
                path
                object {
                    id
                    name
                    type
                }
            }
        }
    `,

    /**
     * Get user results
     */
    getUserResults: `
        query($userId: Int!) {
            result(
                where: { userId: { _eq: $userId } }
                order_by: { createdAt: desc }
            ) {
                id
                grade
                type
                createdAt
                updatedAt
                path
                object {
                    id
                    name
                    type
                }
            }
        }
    `,

    /**
     * Get projects with pass/fail status
     */
    getProjectResults: `
        query($userId: Int!) {
            result(
                where: { 
                    userId: { _eq: $userId },
                    object: { type: { _eq: "project" } }
                }
                order_by: { createdAt: desc }
            ) {
                id
                grade
                createdAt
                path
                object {
                    id
                    name
                    type
                }
            }
        }
    `,

    /**
     * Get piscine statistics
     */
    getPiscineStats: `
        query($userId: Int!, $piscinePath: String!) {
            progress(
                where: { 
                    userId: { _eq: $userId },
                    path: { _like: $piscinePath }
                }
            ) {
                id
                grade
                isDone
                createdAt
                path
                object {
                    id
                    name
                    type
                }
            }
        }
    `,

    /**
     * Get user groups
     */
    getUserGroups: `
        query($userId: Int!) {
            group(
                where: {
                    members: {
                        userId: { _eq: $userId }
                    }
                }
                order_by: { createdAt: desc }
            ) {
                id
                status
                createdAt
                updatedAt
                path
                captainId
                object {
                    id
                    name
                    type
                }
                members {
                    userId
                    user {
                        login
                    }
                }
            }
        }
    `,

    /**
     * Get XP by project type
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
     * Get user events
     */
    getUserEvents: `
        query($userId: Int!) {
            event_user(
                where: { userId: { _eq: $userId } }
                order_by: { createdAt: desc }
            ) {
                event {
                    id
                    path
                    createdAt
                    endAt
                    object {
                        name
                        type
                    }
                }
            }
        }
    `,

    /**
     * Get recent activity (transactions + results)
     */
    getRecentActivity: `
        query($userId: Int!, $limit: Int!) {
            transactions: transaction(
                where: { userId: { _eq: $userId } }
                order_by: { createdAt: desc }
                limit: $limit
            ) {
                id
                type
                amount
                createdAt
                path
                object {
                    name
                }
            }
            results: result(
                where: { userId: { _eq: $userId } }
                order_by: { createdAt: desc }
                limit: $limit
            ) {
                id
                grade
                createdAt
                path
                object {
                    name
                }
            }
        }
    `,

    /**
     * Get XP progression over time (grouped by month)
     */
    getXPProgression: `
        query {
            transaction(
                where: { type: { _eq: "xp" } }
                order_by: { createdAt: asc }
            ) {
                amount
                createdAt
            }
        }
    `,

    /**
     * Get pass/fail statistics
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
     * Get skills/technologies worked on
     */
    getSkills: `
        query {
            transaction(
                where: { type: { _eq: "xp" } }
            ) {
                amount
                object {
                    name
                    type
                    attrs
                }
            }
        }
    `,

    /**
     * Get object details by ID
     */
    getObjectById: `
        query($objectId: Int!) {
            object(where: { id: { _eq: $objectId } }) {
                id
                name
                type
                attrs
                childrenAttrs
            }
        }
    `
};

// Freeze the Queries object to prevent modifications
Object.freeze(Queries);