import {Component, inject, signal, linkedSignal} from '@angular/core';
import {RoutineService, Routine, RoutineSet} from '../routine.service';
import {SetFollowAlong} from './set-follow-along/set-follow-along';
import {ProgressBar} from './progress-bar/progress-bar';
import {Router} from '@angular/router';


class OngoingRoutine {
    constructor(private routine: Routine, public phaseIndex = 0, private setIndex = 0, public completed = false) {}

    get currentExerciseIndex() {
        let index = 0;
        for (let i = 0; i < this.phaseIndex; i++) {
            index += this.routine.phases[i].sets.length;
        }
        return index + this.setIndex;
    }

    get exercisesProgress() {
        return (this.currentExerciseIndex + 1) / this.routine.totalExercises();
    }

    get currentPhase() {
        return this.routine.phases[this.phaseIndex];
    }

    get currentSet() {
        return this.currentPhase.sets[this.setIndex];
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
    imports: [SetFollowAlong, ProgressBar],
    templateUrl: './routine-follow-along.html',
    styleUrl: './routine-follow-along.scss',
})
export class RoutineFollowAlong {
    private readonly routineService = inject(RoutineService);
    private readonly router = inject(Router);

    protected readonly routine = signal(this.routineService.getRoutine());
    protected readonly ongoingRoutine = linkedSignal(() => new OngoingRoutine(this.routine()));
    protected readonly completedRoutine = linkedSignal<Routine>(() => new Routine({
        name: this.routine().name,
        phases: this.routine().phases.map((phase) => ({name: phase.name, sets: []})),
    }));

    moveToNextSet(completedSet: RoutineSet) {
        const phaseIndex = this.ongoingRoutine().phaseIndex;
        const phase = this.completedRoutine().phases[phaseIndex];
        phase.sets.push(completedSet);

        const newOngoingRoutine = this.ongoingRoutine().next();

        if (newOngoingRoutine.completed) {
            this.routineService.saveCompletedRoutine(this.completedRoutine());
            this.router.navigate(['/completed']);
            return;
        }

        this.ongoingRoutine.set(newOngoingRoutine);
    }
}
