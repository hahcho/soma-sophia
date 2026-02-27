import {Component, input, linkedSignal} from '@angular/core';
import {ExerciseSet} from '../../routine.service';
import {ExerciseTargetPipe} from '../../exercise-target.pipe';
import {FormatSecondsPipe} from '../../format-seconds.pipe';
import {Timer} from '../timer/timer';

type OngoingSetState = 'starting' | 'started' | 'resting' | 'completed';

class OngoingSet {
    constructor(private set: ExerciseSet, public state: OngoingSetState = 'starting', public currentSet = 1) {};

    get exercise() {
        return this.set.exercise;
    }

    get repetitions() {
        return this.set.repetitions || 1;
    }

    get restTime() {
        return this.set.restTime || 0;
    }

    next() {
        if (this.state == 'starting') {
            return this.with({state: 'started'})
        } else if (this.state == 'started' && this.currentSet < this.repetitions) {
            return this.with({state: 'resting'})
        } else if (this.state == 'started' && this.currentSet == this.repetitions) {
            return this.with({state: 'completed'})
        } else if (this.state == 'resting') {
            return this.with({state: 'starting', currentSet: this.currentSet + 1})
        } else {
            return this;
        }
    }

    private with(overrides: Partial<{state: OngoingSetState, currentSet: number}>): OngoingSet {
        return new OngoingSet(
            this.set,
            overrides.state ?? this.state,
            overrides.currentSet ?? this.currentSet
        );
    }
}

@Component({
    selector: 'ss-set-follow-along',
    imports: [ExerciseTargetPipe, Timer, FormatSecondsPipe],
    templateUrl: './set-follow-along.html',
    styleUrls: ['../card-follow-along.scss', './set-follow-along.scss'],
})
export class SetFollowAlong {
    set = input.required<ExerciseSet>();

    protected ongoingSet = linkedSignal(() => new OngoingSet(this.set()));

    moveToNextState() {
        const newOngoingSet = this.ongoingSet().next();

        if (newOngoingSet.state == 'completed') {return;}

        this.ongoingSet.set(newOngoingSet);
    }
}
