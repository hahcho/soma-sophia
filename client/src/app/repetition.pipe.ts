import {Pipe, PipeTransform} from '@angular/core';
import {Repetition} from './routine.service';
import {FormatSecondsPipe} from './format-seconds.pipe';

@Pipe({name: 'repetition'})
export class RepetitionPipe implements PipeTransform {
    private formatSeconds = new FormatSecondsPipe();

    transform(target: Repetition | undefined): string {
        if (target?.kind === 'dynamic') return `${target.repetitions} reps`;
        if (target?.kind === 'static') return `${this.formatSeconds.transform(target.holdTime)} hold`;
        return '';
    }
}
