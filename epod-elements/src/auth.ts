export interface AuthState {
    token: string | null;
    expiresAt: number | null;
}

const STORAGE_KEY = 'epod_web_elements_auth';

export class EpodAuthManager {
    private state: AuthState = { token: null, expiresAt: null };

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage() {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (raw) {
                this.state = JSON.parse(raw);
            }
        } catch {
            // ignore parse errors
        }
    }

    private saveToStorage() {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        } catch {
            // ignore storage errors
        }
    }

    getToken(): string | null {
        if (this.state.expiresAt && Date.now() > this.state.expiresAt) {
            this.clear();
            return null;
        }
        return this.state.token;
    }

    setToken(token: string, ttlSeconds: number = 3600) {
        this.state = {
            token,
            expiresAt: Date.now() + ttlSeconds * 1000,
        };
        this.saveToStorage();
    }

    clear() {
        this.state = { token: null, expiresAt: null };
        sessionStorage.removeItem(STORAGE_KEY);
    }

    isAuthenticated(): boolean {
        return this.getToken() !== null;
    }
}

export const epodAuth = new EpodAuthManager();
