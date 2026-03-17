import {Component, input, output, signal, linkedSignal} from '@angular/core';
import {RoutineSet, Repetition} from '../../routine.service';
import {RepetitionPipe} from '../../repetition.pipe';
import {FormatSecondsPipe} from '../../format-seconds.pipe';
import {Timer} from './timer/timer';
import {GoalsAttemptsEditor} from './goals-attempts-editor/goals-attempts-editor';

type OngoingSetState = 'starting' | 'started' | 'resting' | 'completed';

class GoalsAttemptsLogger {
    private goalsAttempts: {[key: number]: {[key: number]: Repetition}} = {};

    logAttempt(ongoingSet: OngoingSet, attemptTime: number) {
        const goal = ongoingSet.goal;

        if (!goal.target) {return;}

        const repetition = ongoingSet.repetition;
        const goalIndex = ongoingSet.index;

        let attempt: Repetition;
        if (goal.target.kind === 'static') {
            attempt = {kind: 'static', holdTime: attemptTime}
        } else {
            attempt = goal.target;
        }

        this.goalsAttempts[repetition] ||= {};
        this.goalsAttempts[repetition][goalIndex] = attempt;
    }

    getGoalsAttemptAsNumbers(repetition: number) {
        const goalsAttempt = this.goalsAttempts[repetition];
        const goalsAttemptAsNumbers: number[] = [];
        for (const index in goalsAttempt) {
            const rep = goalsAttempt[index];
            goalsAttemptAsNumbers[index] = rep.kind === 'static' ? rep.holdTime : rep.repetitions;
        }
        return goalsAttemptAsNumbers;
    }

    updateAttempt(repetition: number, goalsAttemptAsNumbers: number[]) {
        const goalsAttempt = this.goalsAttempts[repetition];
        for (let i = 0; i < goalsAttemptAsNumbers.length; i++) {
            if (goalsAttempt[i].kind === 'static') {
                goalsAttempt[i] = {kind: 'static', holdTime: goalsAttemptAsNumbers[i]};
            } else {
                goalsAttempt[i] = {kind: 'dynamic', repetitions: goalsAttemptAsNumbers[i]};
            }
        }
    }

    getCompletedRoutineSet(set: RoutineSet) {
        const completedGoals: RoutineSet['goals'] = [];
        const totalRepetitions = set.repetitions || 1;

        for (let repetition = 1; repetition <= totalRepetitions; repetition++) {
            const goalsAttempt = this.goalsAttempts[repetition];
            for (const goalIndex in goalsAttempt) {
                if (!completedGoals[goalIndex]) {
                    completedGoals[goalIndex] = {...set.goals[goalIndex]};
                    completedGoals[goalIndex].actual = [];
                }
                completedGoals[goalIndex].actual!.push(goalsAttempt[goalIndex]);
            }
        }

        const completedSet = {...set};
        completedSet.goals = completedGoals;

        return completedSet;
    }
}


class OngoingSet {
    public goal;

    constructor(
        private set: RoutineSet,
        public index = 0,
        public repetition = 1,
        public state: OngoingSetState = 'starting',
    ) {
        this.goal = this.set.goals[this.index];
    }

    get goalsWithTargets() {
        return this.set.goals.filter((goal) => goal.target);
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

    startExercise(): OngoingSet {
        return this.with({state: 'started'});
    }

    completeExercise(): OngoingSet {
        if (this.isLastExercise) {
            if (this.restTime > 0) {
                return this.with({state: 'resting'});
            } else if (this.isLastSet) {
                return this.with({state: 'completed'});
            } else {
                return this.with({repetition: this.repetition + 1, index: 0, state: 'starting'});
            }
        } else {
            return this.with({index: this.index + 1, state: 'starting'});
        }

    }

    finishRest(): OngoingSet {
        if (this.isLastSet) {
            return this.with({state: 'completed'});
        } else {
            return this.with({repetition: this.repetition + 1, index: 0, state: 'starting'});
        }
    }

    private with(overrides: Partial<{index: number, repetition: number, state: OngoingSetState}>): OngoingSet {
        return new OngoingSet(
            this.set,
            overrides.index ?? this.index,
            overrides.repetition ?? this.repetition,
            overrides.state ?? this.state
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
    completed = output<RoutineSet>();

    protected ongoingSet = linkedSignal(() => new OngoingSet(this.set()));
    protected timerTime = signal(0);
    protected editedGoalsAttemp = signal<number[]>([]);

    private goalsAttemptsLogger = new GoalsAttemptsLogger();

    protected startExercise() {
        const next = this.ongoingSet().startExercise();
        this.moveToNextState(next);
    }

    protected completeExercise() {
        this.goalsAttemptsLogger.logAttempt(this.ongoingSet(), this.timerTime())
        const next = this.ongoingSet().completeExercise();
        if (next.state === 'resting') {
            const repetition = this.ongoingSet().repetition;
            const attemptsAsNumbers = this.goalsAttemptsLogger.getGoalsAttemptAsNumbers(repetition);
            this.editedGoalsAttemp.set(attemptsAsNumbers);
        }
        this.moveToNextState(next);
    }

    protected finishRest() {
        const repetition = this.ongoingSet().repetition;
        this.goalsAttemptsLogger.updateAttempt(repetition, this.editedGoalsAttemp());
        const next = this.ongoingSet().finishRest();
        this.moveToNextState(next);
    }

    private moveToNextState(next: OngoingSet) {
        if (next.state === 'completed') {
            const completedSet = this.goalsAttemptsLogger.getCompletedRoutineSet(this.set());
            this.goalsAttemptsLogger = new GoalsAttemptsLogger();
            return this.completed.emit(completedSet);
        }

        this.ongoingSet.set(next);
    }
}
