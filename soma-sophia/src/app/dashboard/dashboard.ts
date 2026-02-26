import {signal, Component, inject} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {ExerciseTargetPipe} from '../exercise-target.pipe';
import {FormatSecondsPipe} from '../format-seconds.pipe';
import {RoutineService} from '../routine.service';

@Component({
    selector: 'ss-dashboard',
    imports: [DecimalPipe, FormatSecondsPipe, ExerciseTargetPipe],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
})
export class Dashboard {
    private readonly routineService = inject(RoutineService);
    protected readonly routine = signal(this.routineService.getRoutine());
}
