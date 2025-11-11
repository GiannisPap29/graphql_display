/**
 * Main Profile Page Logic
 */
(async function () {
    Auth.requireAuth();

    let currentEvent = 'all';

    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const profileContent = document.getElementById('profileContent');
    const errorMessage = document.getElementById('errorMessage');
    const retryBtn = document.getElementById('retryBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (window.Logout) {
        Logout.init();
    }

    /**
     * Handle event selection
     */
    function handleEventSelection(eventType) {
        currentEvent = eventType;

        document.querySelectorAll('.event-card').forEach(card => {
            card.classList.remove('active');
        });
        document.querySelector(`[data-event="${eventType}"]`).classList.add('active');

        const currentUser = Auth.getCurrentUser();
        if (currentUser) {
            loadStatistics(currentUser.userId);
            loadGraphs(currentUser.userId);
        }
    }

    /**
     * Initialize event selector
     */
    function initEventSelector() {
        document.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('click', () => {
                const eventType = card.getAttribute('data-event');
                handleEventSelection(eventType);
            });
        });
    }

    /**
     * Load all profile data
     */
    async function loadProfile() {
        try {
            showLoading();

            const currentUser = Auth.getCurrentUser();
            if (!currentUser) {
                throw new Error('User not authenticated');
            }

            console.log('Loading profile for user:', currentUser.userId);

            const userResult = await GraphQL.query(Queries.getUserProfile);
            if (!userResult.success) {
                throw new Error(userResult.error);
            }

            const userData = userResult.data.user[0];
            console.log('User data loaded:', userData);

            if (window.ProfileInfo) {
                ProfileInfo.render(userData);
            }

            await loadStatistics(currentUser.userId);
            await loadGraphs(currentUser.userId);

            showProfile();

        } catch (error) {
            console.error('Error loading profile:', error);
            showError(error.message);
        }
    }

    /**
     * Load statistics data
     */
    async function loadStatistics(userId) {
        try {
            console.log('Loading statistics for user:', userId);
            console.log('Current event:', currentEvent);

            const queries = getEventQueries(currentEvent, userId);

            console.log('Fetching total XP...');
            const xpResult = await GraphQL.query(queries.totalXP);
            console.log('XP result:', xpResult);

            console.log('Fetching audit ratio...');
            const auditResult = await GraphQL.query(queries.auditRatio);
            console.log('Audit result:', auditResult);

            console.log('Fetching pass/fail stats...');
            const passFailResult = await GraphQL.query(queries.passFailStats);
            console.log('Pass/fail result:', passFailResult);

            if (window.StatsCard) {
                const stats = {
                    totalXP: xpResult.data?.transaction_aggregate?.aggregate?.sum?.amount || 0,
                    auditsDone: auditResult.data?.auditorAudits?.aggregate?.count || 0,
                    auditsReceived: auditResult.data?.receivedAudits?.aggregate?.count || 0,
                    projectsPassed: passFailResult.data?.passed?.aggregate?.count || 0,
                    projectsFailed: passFailResult.data?.failed?.aggregate?.count || 0
                };

                console.log('Rendering stats:', stats);
                StatsCard.renderAll(stats);
            }

        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }
    
    /**
     * Load all graphs
     */
    async function loadGraphs(userId) {
        try {
            console.log('Loading graphs for user:', userId);
            console.log('Current event:', currentEvent);

            const queries = getEventQueries(currentEvent, userId);

            if (window.XPTimeline) {
                console.log('Loading XP timeline...');
                const xpData = await GraphQL.query(queries.xpTransactions);
                console.log('XP timeline data:', xpData);
                if (xpData.success) {
                    XPTimeline.render(xpData.data.transaction);
                }
            }

            if (window.AuditRatio && queries.auditRatio) {
                console.log('Loading audit ratio chart...');
                const auditData = await GraphQL.query(queries.auditRatio);
                console.log('Audit ratio data:', auditData);
                if (auditData.success) {
                    AuditRatio.render(auditData.data);
                }
            }

            if (window.ProjectStats && queries.passFailStats) {
                console.log('Loading project stats...');
                const projectData = await GraphQL.query(queries.passFailStats);
                console.log('Project stats data:', projectData);
                if (projectData.success) {
                    ProjectStats.render(projectData.data);
                }
            }

            if (window.XPByProject) {
                console.log('Loading XP by project...');
                const xpByProjectData = await GraphQL.query(queries.xpTransactions);
                console.log('XP by project data:', xpByProjectData);
                if (xpByProjectData.success) {
                    XPByProject.render(xpByProjectData.data.transaction);
                }
            }

            console.log('All graphs loaded successfully');

        } catch (error) {
            console.error('Error loading graphs:', error);
        }
    }

    function showLoading() {
        loadingState.style.display = 'flex';
        errorState.style.display = 'none';
        profileContent.style.display = 'flex';
    }

    function showError(message) {
        loadingState.style.display = 'none';
        errorState.style.display = 'flex';
        profileContent.style.display = 'none';
        errorMessage.textContent = message;
    }

    function showProfile() {
        loadingState.style.display = 'none';
        errorState.style.display = 'none';
        profileContent.style.display = 'block';
    }

    retryBtn.addEventListener('click', loadProfile);

    Logout.init();

    loadProfile().then(() => {
        initEventSelector();
    });

})();