import {inject} from '@angular/core';
import {Routes, ActivatedRouteSnapshot} from '@angular/router';
import {Dashboard} from './dashboard/dashboard'
import {RoutineFollowAlong} from './routine-follow-along/routine-follow-along'
import {RoutineCompleted} from './routine-completed/routine-completed';
import {CompletedRoutines} from './completed-routines/completed-routines';
import {Login} from './login/login';
import {AuthCallback} from './auth-callback/auth-callback';
import {RoutineService} from './routine.service';
import {authGuard} from './auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
        title: 'Sign In'
    },
    {
        path: 'auth/callback',
        component: AuthCallback,
    },
    {
        path: '',
        component: Dashboard,
        title: 'Dashboard',
        canActivate: [authGuard],
    },
    {
        path: 'follow-along',
        component: RoutineFollowAlong,
        title: 'Routine Follow Along',
        canActivate: [authGuard],
    },
    {
        path: 'completed',
        component: CompletedRoutines,
        resolve: {
            routines: () => inject(RoutineService).getAllCompletedRoutines(),
        },
        title: 'Completed Routines',
        canActivate: [authGuard],
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
        title: 'Routine Completed',
        canActivate: [authGuard],
    }
];
