import {Component, inject} from '@angular/core';
import {RoutineService, Repetition, Phase, RoutineSet} from '../routine.service';
import {RepetitionPipe} from '../repetition.pipe';


@Component({
    selector: 'ss-routine-completed',
    imports: [RepetitionPipe],
    templateUrl: './routine-completed.html',
    styleUrl: './routine-completed.scss',
})
export class RoutineCompleted {
    protected readonly routine = inject(RoutineService).getRoutine();

    constructor() {
        for (let phase of this.routine.phases) {
            for (let set of phase.sets) {
                for (let goal of set.goals) {
                    if (!goal.target) {continue;}

                    const count = set.repetitions || 1;
                    if (goal.target.kind == 'static') {
                        goal.actual = new Array(count).fill({kind: 'static', holdTime: 10});
                    } else {
                        goal.actual = new Array(count).fill({kind: 'dynamic', repetitions: 10});
                    }
                }
            }
        }
    }

    protected phaseHasTargets(phase: Phase): boolean {
        return phase.sets.some(set => set.goals.some(g => g.target));
    }

    protected goalsWithTargets(set: RoutineSet) {
        return set.goals.filter(g => g.target);
    }

    protected metTarget(actual: Repetition, target?: Repetition): boolean {
        if (!target) return true;
        if (actual.kind === 'dynamic' && target.kind === 'dynamic') return actual.repetitions >= target.repetitions;
        if (actual.kind === 'static' && target.kind === 'static') return actual.holdTime >= target.holdTime;
        return false;
    }
}
