import {Component, input} from '@angular/core';
import {Repetition, Phase, RoutineSet} from '../routine.service';
import {CompletedRoutine} from '../database';
import {RepetitionPipe} from '../repetition.pipe';


@Component({
    selector: 'ss-routine-completed',
    imports: [RepetitionPipe],
    templateUrl: './routine-completed.html',
    styleUrl: './routine-completed.scss',
})
export class RoutineCompleted {
    routine = input.required<CompletedRoutine>();

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
