import {Component, inject, signal} from '@angular/core';
import {RoutineService} from '../routine.service';
import {SetFollowAlong} from './set-follow-along/set-follow-along';
import {SupersetFollowAlong} from './superset-follow-along/superset-follow-along';

@Component({
    selector: 'ss-routine-follow-along',
    imports: [SetFollowAlong, SupersetFollowAlong],
    templateUrl: './routine-follow-along.html',
    styleUrl: './routine-follow-along.scss',
})
export class RoutineFollowAlong {
    private readonly routineService = inject(RoutineService);
    protected readonly routine = signal(this.routineService.getRoutine());
    protected readonly currentPhase = this.routine().phases[3];
    //protected readonly currentSet = this.currentPhase.sets[1];
    protected readonly currentSet = this.currentPhase.sets[0];
}
