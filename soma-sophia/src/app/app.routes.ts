import {Routes} from '@angular/router';
import {Dashboard} from './dashboard/dashboard'
import {RoutineFollowAlong} from './routine-follow-along/routine-follow-along'

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
    }
];
