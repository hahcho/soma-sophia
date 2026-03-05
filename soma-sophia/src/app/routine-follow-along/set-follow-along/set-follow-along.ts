import {Component, input, output, linkedSignal} from '@angular/core';
import {RoutineSet} from '../../routine.service';
import {ExerciseTargetPipe} from '../../exercise-target.pipe';
import {FormatSecondsPipe} from '../../format-seconds.pipe';
import {Timer} from '../timer/timer';

type OngoingSetState = 'starting' | 'started' | 'resting' | 'completed';

class OngoingSet {
    public goal;

    constructor(
        private set: RoutineSet,
        public index = 0,
        public repetition = 1,
        public state: OngoingSetState = 'starting'
    ) {
        this.goal = this.set.goals[this.index];
    }

    get totalExercises() {
        return this.set.goals.length;
    }

    get totalRepetitions() {
        return this.set.repetitions || 1;
    }

    get restTime() {
        return this.set.restTime || 0;
    }

    get isLastExercise() {
        return this.index + 1 === this.totalExercises;
    }

    get isLastSet() {
        return this.repetition === this.totalRepetitions;
    }

    get isSuperset() {
        return this.totalExercises > 1;
    }

    next(): OngoingSet {
        if (this.state === 'starting') {
            return this.with({state: 'started'});
        }

        if (this.state === 'resting') {
            return this.with({repetition: this.repetition + 1, index: 0, state: 'starting'});
        }

        if (this.state === 'completed') {
            return this;
        }

        // state === 'started'
        if (!this.isLastExercise) {
            return this.with({index: this.index + 1, state: 'starting'});
        } else if (!this.isLastSet) {
            if (this.restTime > 0) {
                return this.with({state: 'resting'});
            } else {
                return this.with({repetition: this.repetition + 1, index: 0, state: 'starting'});
            }
        } else {
            return this.with({state: 'completed'});
        }
    }

    private with(overrides: Partial<{index: number, repetition: number, state: OngoingSetState}>): OngoingSet {
        return new OngoingSet(
            this.set,
            overrides.index ?? this.index,
            overrides.repetition ?? this.repetition,
            overrides.state ?? this.state,
        );
    }
}

@Component({
    selector: 'ss-set-follow-along',
    imports: [ExerciseTargetPipe, Timer, FormatSecondsPipe],
    templateUrl: './set-follow-along.html',
    styleUrls: ['./set-follow-along.scss'],
})
export class SetFollowAlong {
    set = input.required<RoutineSet>();
    completed = output<void>();

    protected ongoingSet = linkedSignal(() => new OngoingSet(this.set()));

    moveToNextState() {
        const next = this.ongoingSet().next();

        if (next.state === 'completed') {
            return this.completed.emit();
        }

        this.ongoingSet.set(next);
    }
}
