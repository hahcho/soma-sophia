import {inject} from '@angular/core';
import {Routes} from '@angular/router';
import {Dashboard} from './dashboard/dashboard'
import {RoutineFollowAlong} from './routine-follow-along/routine-follow-along'
import {RoutineCompleted} from './routine-completed/routine-completed';
import {RoutineService} from './routine.service';

export const routes: Routes = [
    {
        path: '',
        component: Dashboard,
        title: 'Dashbord'
    },
    {
        path: 'follow-along',
        component: RoutineFollowAlong,
        title: 'Routine Follow Along'
    },
    {
        path: 'completed',
        component: RoutineCompleted,
        resolve: {
            routine: () => {
                return inject(RoutineService).getLastCompletedRoutine();
            }
        },
        title: 'Routine Completed'
    }
];
