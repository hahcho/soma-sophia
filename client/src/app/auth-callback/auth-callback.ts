import {Component, OnInit, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AuthService} from '../auth.service';

@Component({
    selector: 'ss-auth-callback',
    template: '<p>Signing in…</p>',
})
export class AuthCallback implements OnInit {
    private readonly auth = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    ngOnInit(): void {
        const token = this.route.snapshot.queryParamMap.get('token');
        if (token) {
            this.auth.storeToken(token);
            void this.router.navigate(['/']);
        } else {
            void this.router.navigate(['/login']);
        }
    }
}
