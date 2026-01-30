// Shared OTP store across API routes
// In production, use Redis or a database instead of in-memory Map

class OTPStore {
    constructor() {
        if (!global.otpStore) {
            global.otpStore = new Map();
        }
        this.store = global.otpStore;
    }

    set(email, data) {
        this.store.set(email.toLowerCase().trim(), data);
    }

    get(email) {
        return this.store.get(email.toLowerCase().trim());
    }

    delete(email) {
        this.store.delete(email.toLowerCase().trim());
    }

    has(email) {
        return this.store.has(email.toLowerCase().trim());
    }

    // Clean up expired OTPs
    cleanup() {
        const now = Date.now();
        for (const [email, data] of this.store.entries()) {
            if (data.expiresAt && now > data.expiresAt) {
                this.store.delete(email);
            }
        }
    }
}

// Export singleton instance
const otpStore = new OTPStore();

// Clean up expired OTPs every minute
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        otpStore.cleanup();
    }, 60000);
}

export default otpStore;
