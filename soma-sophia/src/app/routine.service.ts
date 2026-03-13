import {Injectable} from '@angular/core';

export type StaticHold = {
    readonly kind: 'static';
    readonly holdTime: number;
}

export type DynamicRepetitions = {
    readonly kind: 'dynamic';
    readonly repetitions: number;
}

export type Repetition = StaticHold | DynamicRepetitions;

export type Exercise = {
    name: string;
};

export type RoutineSet = {
    goals: {
        exercise: Exercise,
        target?: Repetition,
        actual?: Repetition[]
    }[];
    repetitions?: number;
    restTime?: number;
}

export type Phase = {
    name: string;
    sets: RoutineSet[];
}

export class Routine {
    name: string;
    phases: Phase[];

    constructor({name, phases}: {name: string; phases: Phase[]}) {
        this.name = name;
        this.phases = phases;
    }

    approximateTime() {
        const singleSetApproximateTime = 60;
        let totalApproximateTime = 0;

        for (let phase of this.phases) {
            for (let set of phase.sets) {
                const repetitions = set.repetitions || 0;
                const restTime = set.restTime || 0;
                const totalSetTime = (singleSetApproximateTime + restTime) * repetitions;
                totalApproximateTime += totalSetTime;
            }
        }

        return totalApproximateTime;
    }

    totalExercises() {
        let totalExercises = 0;
        for (let phase of this.phases) {
            totalExercises += phase.sets.length;
        }
        return totalExercises;
    }
}

const HARDCODED_ROUTINE: {name: string; phases: Phase[]} = {
    name: 'Morning Routine',
    phases: [
        {
            name: 'Strength',
            sets: [
                {
                    goals: [{exercise: {name: 'bend leg v sit on floor'}, target: {kind: 'static', holdTime: 30}}],
                    repetitions: 3,
                    restTime: 120,
                },
                {
                    goals: [
                        {
                            exercise: {name: 'push ups'},
                            target: {kind: 'dynamic', repetitions: 10},
                        },
                        {
                            exercise: {name: 'chest to bar pull ups'},
                            target: {kind: 'dynamic', repetitions: 5},
                        },
                        {
                            exercise: {name: 'compression work'},
                            target: {kind: 'dynamic', repetitions: 12},
                        }
                    ],
                    repetitions: 3,
                    restTime: 90,
                },
                {
                    goals: [
                        {
                            exercise: {name: 'ring holds'},
                            target: {kind: 'static', holdTime: 30},
                        },
                        {
                            exercise: {name: 'compression work'},
                            target: {kind: 'static', holdTime: 30},
                        }
                    ],
                    repetitions: 3,
                    restTime: 120,
                }
            ]
        }
    ]
};

@Injectable({providedIn: 'root'})
export class RoutineService {
    getRoutine(): Routine {
        return new Routine(HARDCODED_ROUTINE);
    }
}
