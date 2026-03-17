import {inject} from '@angular/core';
import {Routes, ActivatedRouteSnapshot} from '@angular/router';
import {Dashboard} from './dashboard/dashboard'
import {RoutineFollowAlong} from './routine-follow-along/routine-follow-along'
import {RoutineCompleted} from './routine-completed/routine-completed';
import {CompletedRoutines} from './completed-routines/completed-routines';
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
        component: CompletedRoutines,
        resolve: {
            routines: () => inject(RoutineService).getAllCompletedRoutines(),
        },
        title: 'Completed Routines'
    },
    {
        path: 'completed/:id',
        component: RoutineCompleted,
        resolve: {
            routine: (route: ActivatedRouteSnapshot) => {
                const id = Number(route.paramMap.get('id'));
                return inject(RoutineService).getCompletedRoutineById(id);
            }
        },
        title: 'Routine Completed'
    }
];
