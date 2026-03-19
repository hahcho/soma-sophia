import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable, inject, signal} from '@angular/core';

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
    private readonly http = inject(HttpClient);

    readonly isLoggedIn = signal(!!localStorage.getItem(TOKEN_KEY));
    readonly user = signal<AuthUser | null>(null);

    constructor() {
        if (this.isLoggedIn()) {
            this.fetchUser();
        }
    }

    storeToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
        this.isLoggedIn.set(true);
        this.fetchUser();
    }

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        this.isLoggedIn.set(false);
        this.user.set(null);
    }

    loginWithGoogle(): void {
        window.location.href = `${API_URL}/auth/login`;
    }

    loginWithDevAccount(email = 'dev@soma.local'): void {
        window.location.href = `${API_URL}/auth/dev-login?email=${encodeURIComponent(email)}`;
    }

    private fetchUser(): void {
        const token = this.getToken();
        if (!token) return;
        const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
        this.http.get<AuthUser>(`${API_URL}/auth/me`, {headers}).subscribe({
            next: (user) => this.user.set(user),
            error: () => this.logout(),
        });
    }
}
