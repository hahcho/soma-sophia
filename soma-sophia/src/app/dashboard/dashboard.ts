import { signal, Component } from '@angular/core';

type SimpleExercise = {
    kind: 'simple';
    name: string;
}

type StaticExercise = {
    kind: 'static';
    name: 'string';
    holdTime: number;
}

type DynamicExercise = {
    kind: 'dynamic';
    name: 'string';
    repetitions: number;
}

type Exercise = SimpleExercise | StaticExercise | DynamicExercise;

type ExerciseSet = {
    kind: 'set',
    exercise: Exercise;
    repetitions?: number;
    restTime?: number;
}

type ExerciseSuperSet = {
    kind: 'superset',
    exercises: Exercise[];
    repetitions?: number;
    restTime?: number;
}

type Phase = {
    name: string;
    sets: (ExerciseSet | ExerciseSuperSet)[];
}

type Routine = {name: string; phases: Phase[];};

const HARDCODED_ROUTINE_JSON = {
    name: 'Morning Routine',
    phases: [
        {
            name: 'Warm up',
            sets: [
                {
                    kind: 'superset',
                    exercises: [
                        {kind: 'simple', name: 'Neck circles // check for better naming'},
                        {kind: 'simple', name: 'Cat/cow pose'},
                        {kind: 'simple', name: 'Wrist opposite palm circles'},
                        {kind: 'simple', name: 'Wrist top circles'},
                        {kind: 'simple', name: 'Ankle sitting'}
                    ]
                }
            ]
        },
        {
            name: 'Shoulder mobility',
            sets: [
                {
                    kind: 'superset',
                    exercises: [
                        {kind: 'simple', name: 'Foam roll scapula and triceps'},
                        {kind: 'simple', name: 'Elevated Straight arm push down 60s - 120s // check for better naming'},
                        {kind: 'simple', name: 'laying straight arm rows // check for better naming'}
                    ]
                }
            ]
        },
        {
            name: 'Hamstring/Pike',
            sets: [
                {
                    kind: 'superset',
                    exercises: [
                        {kind: 'simple', name: 'Chair seated hip hinge'},
                        {kind: 'simple', name: 'Downward facing dog'},
                        {kind: 'simple', name: 'Standing pike to squat and back'},
                        {kind: 'simple', name: 'Mckenzi push ups'},
                        {kind: 'simple', name: 'Seated pike'},
                    ]
                }
            ]
        },
        {
            name: 'Strength',
            sets: [
                {
                    kind: 'set',
                    exercise: {
                        kind: 'static',
                        name: 'bend leg v sit on floor',
                        holdTime: 30,
                    },
                    repetitions: 3,
                    restTime: 120,
                },
                {
                    kind: 'superset',
                    exercises: [
                        {kind: 'dynamic', name: 'push ups', repetitions: 10},
                        {kind: 'dynamic', name: 'chest to bar pull ups', repetitions: 5},
                        {kind: 'dynamic', name: 'compression work', repetitions: 12}
                    ],
                    repetitions: 3,
                    restTime: 120,
                },
                {
                    kind: 'superset',
                    exercises: [
                        {kind: 'static', name: 'reverse elevated plank', holdTime: 30},
                        {kind: 'static', name: 'ring holds', holdTime: 30}

                    ],
                    repetitions: 3,
                    restTime: 120,
                }
            ]
        }
    ]
};

@Component({
  selector: 'ss-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
    protected readonly routine = signal(HARDCODED_ROUTINE_JSON as Routine);
}
