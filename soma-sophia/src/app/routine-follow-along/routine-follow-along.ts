import {Component, inject, signal, output, linkedSignal} from '@angular/core';
import {RoutineService, Routine, ExerciseSet, ExerciseSuperSet} from '../routine.service';
import {SetFollowAlong} from './set-follow-along/set-follow-along';
import {SupersetFollowAlong} from './superset-follow-along/superset-follow-along';


class OngoingRoutine {
    constructor(private routine: Routine, public phaseIndex = 0, private setIndex = 0, public completed = false) {}

    get currentExerciseIndex() {
        let index = 0;
        for (let i = 0; i < this.phaseIndex; i++) {
            index += this.routine.phases[i].sets.length;
        }
        return index + this.setIndex;
    }

    get currentPhase() {
        return this.routine.phases[this.phaseIndex];
    }

    get currentSet() {
        return this.currentPhase.sets[this.setIndex];
    }

    get currentSetAsExerciseSet() {
        return this.currentSet as ExerciseSet;
    }

    get currentSetAsExerciseSuperset() {
        return this.currentSet as ExerciseSuperSet;
    }

    next() {
        if (this.setIndex < this.currentPhase.sets.length - 1) {
            return this.with({setIndex: this.setIndex + 1});
        } else if (this.phaseIndex < this.routine.phases.length - 1) {
            return this.with({phaseIndex: this.phaseIndex + 1, setIndex: 0});
        } else {
            return this.with({completed: true});
        }
    }

    private with(overrides: Partial<{phaseIndex: number, setIndex: number, completed: boolean}>) {
        return new OngoingRoutine(
            this.routine,
            overrides.phaseIndex ?? this.phaseIndex,
            overrides.setIndex ?? this.setIndex,
            overrides.completed ?? this.completed
        );
    }
}

@Component({
    selector: 'ss-routine-follow-along',
    imports: [SetFollowAlong, SupersetFollowAlong],
    templateUrl: './routine-follow-along.html',
    styleUrl: './routine-follow-along.scss',
})
export class RoutineFollowAlong {
    completed = output<void>();

    private readonly routineService = inject(RoutineService);
    protected readonly routine = signal(this.routineService.getRoutine());
    protected readonly ongoingRoutine = linkedSignal(() => new OngoingRoutine(this.routine()));

    moveToNextSet() {
        const newOngoingRoutine = this.ongoingRoutine().next();

        console.log(newOngoingRoutine);

        if (newOngoingRoutine.completed) {return this.completed.emit();}

        this.ongoingRoutine.set(newOngoingRoutine);
    }
}
