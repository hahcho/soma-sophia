import {Component, inject, isDevMode} from '@angular/core';

import {AuthService} from '../auth.service';

@Component({
    selector: 'ss-login',
    templateUrl: './login.html',
    styleUrl: './login.scss',
})
export class Login {
    protected readonly auth = inject(AuthService);
    protected readonly devMode = isDevMode();
}
