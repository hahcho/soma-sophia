import {Injectable, signal} from '@angular/core';

declare const API_URL: string;

const TOKEN_KEY = 'ss_auth_token';

export interface AuthUser {
    id: number;
    email: string;
    name: string;
    picture: string | null;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    readonly isLoggedIn = signal(!!localStorage.getItem(TOKEN_KEY));

    storeToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
        this.isLoggedIn.set(true);
    }

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        this.isLoggedIn.set(false);
    }

    loginWithGoogle(): void {
        window.location.href = `${API_URL}/auth/login`;
    }

    loginWithDevAccount(email = 'dev@soma.local'): void {
        window.location.href = `${API_URL}/auth/dev-login?email=${encodeURIComponent(email)}`;
    }
}
