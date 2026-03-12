import {Component, input, output, linkedSignal, computed} from '@angular/core';
import {RoutineSet} from '../../routine.service';
import {RepetitionPipe} from '../../repetition.pipe';
import {FormatSecondsPipe} from '../../format-seconds.pipe';
import {Timer} from './timer/timer';
import {GoalsAttemptsEditor} from './goals-attempts-editor/goals-attempts-editor';

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

    startRepetition(): OngoingSet {
        return this.with({state: 'started'});
    }

    finishRest(): OngoingSet {
        return this.with({repetition: this.repetition + 1, index: 0, state: 'starting'});
    }

    completeExercise(): OngoingSet {
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
    imports: [RepetitionPipe, Timer, GoalsAttemptsEditor, FormatSecondsPipe],
    templateUrl: './set-follow-along.html',
    styleUrls: ['./set-follow-along.scss'],
})
export class SetFollowAlong {
    set = input.required<RoutineSet>();
    completed = output<void>();

    protected ongoingSet = linkedSignal(() => new OngoingSet(this.set()));
    protected goalsWithTargets = computed(() => this.set().goals.filter((goal) => goal.target));
    protected goalsAttempts = linkedSignal(() =>
        this.goalsWithTargets().map(goal =>
            goal.target!.kind === 'static'
                ? goal.target!.holdTime
                : goal.target!.repetitions
        )
    );

    protected startRepetition() {
        const next = this.ongoingSet().startRepetition();
        this.moveToNextState(next);
    }

    protected completeExercise() {
        const next = this.ongoingSet().completeExercise();
        this.moveToNextState(next);
    }

    protected finishRest() {
        const next = this.ongoingSet().finishRest();
        this.moveToNextState(next);
    }

    private moveToNextState(next: OngoingSet) {
        if (next.state === 'completed') {
            return this.completed.emit();
        }

        this.ongoingSet.set(next);
    }
}
