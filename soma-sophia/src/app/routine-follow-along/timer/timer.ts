import {Component, OnDestroy, signal, input, effect, output} from '@angular/core';
import {StopWatchFormat} from './stopwatch-format.pipe';

@Component({
    selector: 'ss-timer',
    imports: [StopWatchFormat],
    templateUrl: './timer.html',
    styleUrl: './timer.scss',
})
export class Timer implements OnDestroy {
    limit = input(Number.POSITIVE_INFINITY);
    running = input(false);
    label = input('');

    finished = output<void>();

    protected time = signal(0);
    private intervalId: ReturnType<typeof setInterval> | null = null;

    constructor() {
        effect(() => {
            if (this.running()) {
                this.intervalId = setInterval(() => {
                    if (this.time() < this.limit()) {
                        this.time.update(t => t + 1);
                    } else {
                        this.cleanupInterval();
                        this.finished.emit();
                    }
                }, 1000);
            } else {
                this.cleanupInterval();
            }
        });
    }

    ngOnDestroy() {
        this.cleanupInterval();
    }

    private cleanupInterval() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
