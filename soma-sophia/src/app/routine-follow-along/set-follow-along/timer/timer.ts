import {Component, OnDestroy, model, input, effect, output} from '@angular/core';
import {StopWatchFormat} from './stopwatch-format.pipe';


class Ticker {
    private intervalId: ReturnType<typeof setInterval>;

    constructor(timeLength: number, onTick: (diff: number) => void) {
        const endTime = Date.now() + timeLength;
        let lastTickTime = Date.now();

        this.intervalId = setInterval(() => {
            const now = Date.now()
            if (now < endTime) {
                onTick(now - lastTickTime);
            } else {
                onTick(endTime - lastTickTime);
                this.destroy();
            }
            lastTickTime = now;
        }, 1000);
    }

    destroy() {
        clearInterval(this.intervalId);
    }
}

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
    time = model<number>(0);

    private ticker: Ticker | null = null;

    constructor() {
        effect(() => {
            this.time.set(0);

            if (this.running()) {
                this.ticker = new Ticker(this.limit() * 1000, (diffBetweenTicks) => {
                    const diffBetweenTicksSeconds = Math.floor(diffBetweenTicks / 1000);
                    const updatedTime = Math.min(this.limit(), this.time() + diffBetweenTicksSeconds);
                    this.time.set(updatedTime);
                });
            } else {
                this.ngOnDestroy();
            }
        });
    }

    ngOnDestroy() {
        this.ticker?.destroy();
        this.ticker = null;
    }
}
