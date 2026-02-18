import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatSeconds' })
export class FormatSecondsPipe implements PipeTransform {
    transform(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        if (mins === 0) return `${secs}s`;
        if (secs === 0) return `${mins}m`;
        return `${mins}m ${secs}s`;
    }
}
