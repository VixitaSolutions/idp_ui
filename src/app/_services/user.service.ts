import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { Observable } from '../../../node_modules/rxjs';
import { catchError, map, tap } from '../../../node_modules/rxjs/operators';
import { Role } from '../_models/role';
import { env } from 'process';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<any> {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(): Observable<User> {
        return this.http.get<User>(`${environment.apiUrl}/api/v1/user/profile`)
        .pipe(map((data: any) => {
            return data.data;
        }), catchError((err: HttpErrorResponse) => {
            console.log(err);
            return null;
        }));
    }
    addAdmin(userId, roleId, status): Observable<any> {
        if (status === true) {
            return this.http.get(`${environment.apiUrl}/api/v1/userRole/add?userId=${userId}&roleId=${roleId}`);
        } else {
            return this.http.get(`${environment.apiUrl}/api/v1/userRole/remove?userId=${userId}&roleId=${roleId}`);
        }
    }

    uploadEmployees(tenantId: string, file: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();
        formData.append('fileToUpload', file);
        const req = new HttpRequest('POST', `${environment.apiUrl}/api/v1/userUpload/upload/${tenantId}`, formData, {
        reportProgress: true,
        responseType: 'json'
        });
        return this.http.request(req);
    }
    createUser(payload: User): Observable<any> {
        return this.http.post<User>(`${environment.apiUrl}/api/v1/user/create`, payload);
    }
    getEmployees(payload): Observable<any> {
        return this.http.post<User[]>(`${environment.apiUrl}/api/v1/user/userList`, payload);
    }
    getEmployeesByManager(role, userId): Observable<any> {
        return this.http.get(`${environment.apiUrl}/api/v1/usermap/allocated/${role}?userId=${userId}`);
    }
    getCoaches(role, userId): Observable<any> {
        return this.http.get(`${environment.apiUrl}/api/v1/usermap/allocated/${role}?userId=${userId}`);
    }
    userMapping(payload, link): Observable<any> {
        if (link) {
            return this.http.put(`${environment.apiUrl}/api/v1/usermap/link`, payload);
        } else {
            return this.http.put(`${environment.apiUrl}/api/v1/usermap/deLink`, payload);
        }
    }
    updateRole(userId, roleId): Observable<any> {
        return this.http.get(`${environment.apiUrl}/api/v1/userRole/add?userId=${userId}&roleId=${roleId}`);
    }
    saveTask(task): Observable<any> {
        if (task.id) {
            return this.http.post(`${environment.apiUrl}/api/v1/task/update`, task);
        } else {
            return this.http.post(`${environment.apiUrl}/api/v1/task/create`, task);
        }
    }
    getCoursesByStatus(coachId, taskStatus): Observable<any> {
        if (taskStatus) {
            return this.http.get(`${environment.apiUrl}/api/v1/task/getAllocatedTask/byCoachId?coachId=${coachId}&taskStatus=${taskStatus}`);
        } else {
            return this.http.get(`${environment.apiUrl}/api/v1/task/getAllocatedTask/byCoachId?coachId=${coachId}`);
        }
    }
    getSelfCoursesByStatus(employeeId, taskStatus): Observable<any> {
        if (taskStatus) {
            return this.http.get(`${environment.apiUrl}/api/v1/task/getAllocatedTask?employeeId=${employeeId}&taskStatus=${taskStatus}`);
        } else {
            return this.http.get(`${environment.apiUrl}/api/v1/task/getAllocatedTask?employeeId=${employeeId}`);
        }
    }
    getAssignedCoach(userId): Observable<any> {
        return this.http.get(`${environment.apiUrl}/api/v1/user/assignedUser/${userId}`);
    }
    /*
    private extractData(res: Response) {
        let body = res.json();
        if (body) {
            return body.data || body;
         } else {
            return {};
         }
     }
     */
}
