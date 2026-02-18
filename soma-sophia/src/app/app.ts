import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Dashboard} from './dashboard/dashboard'

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Dashboard],
    templateUrl: './app.html',
})
export class App {
}
