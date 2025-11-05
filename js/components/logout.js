/**
 * Logout Component
 * Handles logout functionality with confirmation
 */

const Logout = {
    /**
     * Initialize logout functionality
     */
    init() {
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (!logoutBtn) {
            console.warn('Logout button not found');
            return;
        }

        // Add click event listener
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showConfirmation();
        });

        console.log('Logout functionality initialized');
    },

    /**
     * Show logout confirmation dialog
     */
    showConfirmation() {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'logout-modal-overlay';
        overlay.innerHTML = `
            <div class="logout-modal">
                <div class="logout-modal-header">
                    <h3>Confirm Logout</h3>
                </div>
                <div class="logout-modal-body">
                    <p>Are you sure you want to logout?</p>
                </div>
                <div class="logout-modal-footer">
                    <button id="cancelLogout" class="btn-cancel">Cancel</button>
                    <button id="confirmLogout" class="btn-confirm">Logout</button>
                </div>
            </div>
        `;

        // Add to body
        document.body.appendChild(overlay);

        // Add animation
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);

        // Handle cancel
        document.getElementById('cancelLogout').addEventListener('click', () => {
            this.hideConfirmation(overlay);
        });

        // Handle confirm
        document.getElementById('confirmLogout').addEventListener('click', () => {
            this.performLogout(overlay);
        });

        // Handle click outside modal
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hideConfirmation(overlay);
            }
        });

        // Handle escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.hideConfirmation(overlay);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    },

    /**
     * Hide confirmation dialog
     * @param {HTMLElement} overlay - Modal overlay element
     */
    hideConfirmation(overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    },

    /**
     * Perform logout
     * @param {HTMLElement} overlay - Modal overlay element
     */
    performLogout(overlay) {
        // Disable buttons
        const confirmBtn = document.getElementById('confirmLogout');
        const cancelBtn = document.getElementById('cancelLogout');
        
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = '<span class="spinner"></span> Logging out...';
        }
        
        if (cancelBtn) {
            cancelBtn.disabled = true;
        }

        // Perform logout after a brief delay for UX
        setTimeout(() => {
            Auth.logout();
        }, 500);
    },

    /**
     * Quick logout without confirmation
     */
    quickLogout() {
        Auth.logout();
    },

    /**
     * Show logout success message
     */
    showLogoutSuccess() {
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 24px;">✓</span>
                <span>Logged out successfully</span>
            </div>
        `;
        
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
};

// Add logout modal styles dynamically
const style = document.createElement('style');
style.textContent = `
    .logout-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .logout-modal-overlay.show {
        opacity: 1;
    }

    .logout-modal {
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }

    .logout-modal-overlay.show .logout-modal {
        transform: scale(1);
    }

    .logout-modal-header {
        padding: 24px 24px 16px;
        border-bottom: 1px solid #e2e8f0;
    }

    .logout-modal-header h3 {
        margin: 0;
        font-size: 20px;
        color: #1a202c;
    }

    .logout-modal-body {
        padding: 24px;
    }

    .logout-modal-body p {
        margin: 0;
        color: #4a5568;
        font-size: 16px;
    }

    .logout-modal-footer {
        padding: 16px 24px;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        border-top: 1px solid #e2e8f0;
    }

    .btn-cancel,
    .btn-confirm {
        padding: 10px 24px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .btn-cancel {
        background: #e2e8f0;
        color: #4a5568;
    }

    .btn-cancel:hover {
        background: #cbd5e0;
    }

    .btn-confirm {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .btn-confirm:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-cancel:disabled,
    .btn-confirm:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .btn-confirm:disabled:hover {
        transform: none;
        box-shadow: none;
    }

    .btn-confirm .spinner {
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    /* Mobile responsive */
    @media (max-width: 480px) {
        .logout-modal {
            max-width: 95%;
        }

        .logout-modal-footer {
            flex-direction: column-reverse;
        }

        .btn-cancel,
        .btn-confirm {
            width: 100%;
        }
    }
`;
document.head.appendChild(style);

// Freeze the Logout object
Object.freeze(Logout);