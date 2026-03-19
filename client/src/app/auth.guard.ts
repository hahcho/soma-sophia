import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';

import {AuthService} from './auth.service';

export const authGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    if (auth.isLoggedIn()) {
        return true;
    } else {
        return inject(Router).createUrlTree(['/login']);
    }
};
