import { Competency } from './admin';
import { TaskStatus } from './taskStatus';
import { User } from './user';

export interface Task {
    id: number;
    taskName: string;
    duration: number;
    taskDescription: string;
    createdBy: number;
    createdOn: string;
    updatedOn: string;
    taskStatus: TaskStatus;
    employeeId: User;
    competency: Competency;
    empComments: string;
    coachComments: string;
    progress: number;
    referanceUrl: string;
}
