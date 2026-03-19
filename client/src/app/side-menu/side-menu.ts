import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';

import {AuthService} from '../auth.service';

@Component({
    selector: 'ss-side-menu',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './side-menu.html',
    styleUrl: './side-menu.scss',
})
export class SideMenu {
    protected isOpen = signal(false);
    protected readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    protected toggle() {
        this.isOpen.update((v) => !v);
    }

    protected close() {
        this.isOpen.set(false);
    }

    protected logout() {
        this.close();
        this.auth.logout();
        void this.router.navigate(['/login']);
    }
}
