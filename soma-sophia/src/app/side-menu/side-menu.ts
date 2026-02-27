import {Component, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
    selector: 'ss-side-menu',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './side-menu.html',
    styleUrl: './side-menu.scss',
})
export class SideMenu {
    protected isOpen = signal(false);

    protected toggle() {
        this.isOpen.update((v) => !v);
    }

    protected close() {
        this.isOpen.set(false);
    }
}
