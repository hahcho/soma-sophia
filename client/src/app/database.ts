import Dexie, {type EntityTable} from 'dexie';
import {type Phase} from './routine.service';

export type CompletedRoutine = {
    id?: number;
    name: string;
    phases: Phase[];
    completedAt: Date;
};

const db = new Dexie('soma-sophia') as Dexie & {
    completedRoutines: EntityTable<CompletedRoutine, 'id'>;
};

db.version(1).stores({
    completedRoutines: '++id, completedAt',
});

export {db};
