import {Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {CompletedRoutine} from '../database';

@Component({
    selector: 'ss-completed-routines',
    imports: [RouterLink, DatePipe],
    templateUrl: './completed-routines.html',
    styleUrl: './completed-routines.scss',
})
export class CompletedRoutines {
    routines = input.required<CompletedRoutine[]>();
}
