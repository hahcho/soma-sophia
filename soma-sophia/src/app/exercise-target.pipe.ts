import {Pipe, PipeTransform} from '@angular/core';
import {Exercise} from './routine.service';
import {FormatSecondsPipe} from './format-seconds.pipe';

@Pipe({name: 'exerciseTarget'})
export class ExerciseTargetPipe implements PipeTransform {
    private formatSeconds = new FormatSecondsPipe();

    transform(exercise: Exercise): string {
        if (exercise.kind === 'dynamic') return `${exercise.repetitions} reps`;
        if (exercise.kind === 'static') return `${this.formatSeconds.transform(exercise.holdTime)} hold`;
        return '';
    }
}
