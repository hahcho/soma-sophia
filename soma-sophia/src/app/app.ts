import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dashboard } from './dashboard/dashboard'
import { Header } from './header/header'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Dashboard, Header],
  templateUrl: './app.html',
})
export class App {
  protected readonly headerText = 'Morning Routine';
}
