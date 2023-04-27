import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Menu } from '../home/home.component';
import { Client, Competency } from '../_models/admin';

@Injectable({ providedIn: 'root' })
export class ClientService {

  menus = [{ name: 'Home', url: 'dashboard' },
            { name: 'Manage Clients', url: 'manage-clients' },
            { name: 'Manage Admins', url: 'manage-admins' },
            { name: 'Competency Mapping', url: 'competency-mapping' },
            { name: 'All Employees Data', url: 'manage-employees' },
            { name: 'Upload Competency Framework', url: 'upload-competency' },
            { name: 'Upload Employees data', url: 'upload-employees' }];
  managerMenus = [{ name: 'Home', url: 'home' },
                  { name: 'Overall completion status', url: 'overall' },
                  { name: 'Coach-wise summary', url: 'cwise' },
                  { name: 'Participant-wise summary', url: 'ewise' },
                  { name: 'Competency-wise summary', url: 'cpwise' },
            {
              name: 'Controls', url: '',
              children: [
                { name: 'Manage Coach', url: 'manage-coach' },
                { name: 'Manage Participant', url: 'manage-participant' }
              ]
            }];
  coachMenus = [{ name: 'Home', url: 'home' },
                  {
                    name: 'My Employees', url: '',
                    children: [
                      // { name: 'Pending Request Approvals', url: 'courses-approval' },
                      // { name: 'Courses Assigned', url: 'courses-assigned' },
                      // { name: 'Employee Courses in Progress', url: 'course-in-progress' },
                      // { name: 'Courses Terminated', url: 'courses-terminated' },
                      { name: 'Courses', url: 'courses' },
                      { name: 'Create Task', url: 'assign-course' }
                    ]
                  }];
  employeeMenus = [{ name: 'Home', url: 'home' },
                  {
                    name: 'My Courses', url: '',
                    children: [
                      // { name: 'Courses Enrolled', url: 'courses-enrolled' },
                      // { name: 'Courses in Progress', url: 'course-in-progress' },
                      // { name: 'Courses Completed', url: 'courses-completed' },
                      // { name: 'Courses Terminated', url: 'courses-terminated' },
                      { name: 'Courses', url: 'courses' },
                      { name: 'Achievements', url: 'achievements' }
                    ]
                  }];

  constructor(private httpClient: HttpClient) { }
  clients: Client[] = [];
  clientInfo: any[] = [];
  getMenus(): Observable<Menu[]> {
    return of(this.menus);
  }
  getManagerMenus(): Observable<Menu[]> {
    return of(this.managerMenus);
  }
  getCoachMenus(): Observable<Menu[]> {
    return of(this.coachMenus);
  }
  getEmployeeMenus(): Observable<Menu[]> {
    return of(this.employeeMenus);
  }
  getClients(status, isForce: boolean = false): Observable<Client[]> {
    if (isForce || this.clients.length === 0) {
      return this.httpClient.post(`${environment.apiUrl}/api/v1/tenant/get`, status)
      .pipe(map((data: any) => {
        this.clients = data?.data;
        return data?.data;
      }));
    } else {
      return of(this.clients);
    }
  }

  saveClient(payload: any): Observable<any> {
    if (payload.id !== undefined && payload.id !== null) {
      return this.httpClient.post(`${environment.apiUrl}/api/v1/tenant/update`, payload);
    }
    return this.httpClient.post(`${environment.apiUrl}/api/v1/tenant/create`, payload);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/api/v1/tenant/delete/${id}`);
  }

  getActiveClients(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/api/v1/tenant/getClients`);
  }

  getUsers(tenantId, roleId): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/api/v1/user/userList`, { tenantId, roleId });
  }
  // getUsersByClientId(tenantId): Observable<any> {
  //   return this.httpClient.post(`${environment.apiUrl}/api/v1/user/userList`, {tenantId});
  // }

  // getUsersByRoleId(roleId): Observable<any> {
  //   return this.httpClient.post(`${environment.apiUrl}/api/v1/user/userList`, {roleId});
  // }
  // getCompetencies(): Observable<any> {
  //   return this.httpClient.get(`${environment.apiUrl}/api/v1/competency/all`);
  // }
  getCompetencies(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/api/excel/competency`).pipe(
      map((comp:any[])=>{
        if(comp){
          for(let i = 0; i<comp.length; i++){
            if(sessionStorage.getItem('tenant-id') == comp[i].tenantId){
              this.clientInfo.push(comp[i]);
            }
          }
        }
        return this.clientInfo;
      })
    );
  }
}
