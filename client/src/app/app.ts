import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SideMenu} from './side-menu/side-menu';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, SideMenu],
    templateUrl: './app.html',
})
export class App {
}
