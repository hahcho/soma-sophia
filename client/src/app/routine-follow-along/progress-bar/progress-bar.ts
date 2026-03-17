import {Component, input} from '@angular/core';

@Component({
    selector: 'ss-progress-bar',
    templateUrl: './progress-bar.html',
    styleUrl: './progress-bar.scss',
})
export class ProgressBar {
    filled = input.required<number>(); // 0 to 1
}
