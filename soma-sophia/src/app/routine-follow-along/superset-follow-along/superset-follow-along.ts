import {Component, input, linkedSignal} from '@angular/core';
import {ExerciseSuperSet, Exercise} from '../../routine.service';
import {ExerciseTargetPipe} from '../../exercise-target.pipe';
import {Timer} from '../timer/timer';
import {FormatSecondsPipe} from '../../format-seconds.pipe';


type OngoingSupersetState = 'starting' | 'started' | 'resting' | 'completed';

class OngoingSuperset {
    exercise: Exercise;

    constructor(private superset: ExerciseSuperSet, public index: number = 0, public currentSet: number = 1, public state: OngoingSupersetState = 'starting') {
        this.exercise = this.superset.exercises[this.index];
    }

    next() {
        if (this.state === 'starting') {
            return this.with({state: 'started'});
        }

        if (this.state === 'resting') {
            return this.with({currentSet: this.currentSet + 1, index: 0, state: 'starting'});
        }

        if (this.state === 'completed') {
            return this;
        }

        // this.state === 'started'
        if (this.isLastExercise && !this.isLastSet && this.restTime > 0) {
            return this.with({state: 'resting'});
        } else if (this.isLastExercise && this.isLastSet) {
            return this.with({state: 'completed'});
        } else {
            return this.with({index: this.index + 1, state: 'starting'});
        }
    }

    get restTime() {
        return this.superset.restTime || 0;
    }

    get isLastExercise() {
        return this.index + 1 === this.superset.exercises.length;
    }

    get isLastSet() {
        return this.currentSet === this.superset.repetitions;
    }

    private with(overrides: Partial<{index: number, currentSet: number, state: OngoingSupersetState}>): OngoingSuperset {
        return new OngoingSuperset(
            this.superset,
            overrides.index ?? this.index,
            overrides.currentSet ?? this.currentSet,
            overrides.state ?? this.state,
        );
    }
}

@Component({
    selector: 'ss-superset-follow-along',
    imports: [ExerciseTargetPipe, FormatSecondsPipe, Timer],
    templateUrl: './superset-follow-along.html',
    styleUrls: ['../card-follow-along.scss', './superset-follow-along.scss'],
})
export class SupersetFollowAlong {
    superset = input.required<ExerciseSuperSet>();
    ongoingSuperset = linkedSignal(() => new OngoingSuperset(this.superset()));

    moveToNextState() {
        const newOngoingSuperset = this.ongoingSuperset().next();

        if (newOngoingSuperset.state == 'completed') {return;}

        this.ongoingSuperset.set(newOngoingSuperset);
    }
}
