import {Component, input, model} from '@angular/core';
import {RoutineSet} from '../../../routine.service';

type Goals = RoutineSet['goals'];

@Component({
    selector: 'ss-goals-attempts-editor',
    imports: [],
    templateUrl: './goals-attempts-editor.html',
    styleUrl: './goals-attempts-editor.scss',
})
export class GoalsAttemptsEditor {
    goals = input.required<Goals>();
    goalsAttempts = model.required<number[]>();

    protected editGoalAttempt(index: number, value: number) {
        this.goalsAttempts.update((attempts) => {
            attempts[index] = value;
            return attempts;
        })
    }
}
