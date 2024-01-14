import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { Observable } from '../../../node_modules/rxjs';
import { catchError, map, tap } from '../../../node_modules/rxjs/operators';

const GAPIKEY = 'AIzaSyC1OqVGZsC_-VWNpGPyoa7ClyavF4n8FqE';
const GAPIURL = 'https://www.googleapis.com/customsearch/v1';
const CHATGPT = 'http://35.154.15.64:4000/api/';
//const localData = 'http://http://35.154.15.64/:4000/api/';
let headers = new HttpHeaders()
.set('X-RapidAPI-Key', 'b7100fe224msha035ded6b2457ebp14416ejsn2d36f23b4136')
.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
.set('X-RapidAPI-Host', 'contextualwebsearch-websearch-v1.p.rapidapi.com')
.set('Content-Type', 'application/json')


@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<any> {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getGSearchResults(keyword: string): Observable<any>{
        return this.http.get<any>(`https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/WebSearchAPI?q=${keyword}&pageNumber=1&pageSize=10&autoCorrect=true`, {headers});
    }

    getChatGtpList(keywords: any): Observable<any>{
        const data = {
            "question":`learning resources of ${keywords} in JSON format {"Books":[{"Author": "","Publisher":"","PublishingYear":"","Title":"","URL":""}],"OnlineCourses":[{"Course":"","Description":"","URL":"","platform":"", imgUrl:""}],"Youtube":[{"Name":"","Description":"","URL":""}]}]}`
          }
        return this.http.post<any>(CHATGPT + 'find-competencies', data);
    }
    getPreloadedData(keywords: any): Observable<any>{
      // let newKeyword: any;
      // if(keywords.length > 2){
      //   newKeyword = keywords.split(' ')[0]+ ' '+ keywords.split(' ')[1]
      // }
      // else {
      //   newKeyword = keywords.split(' ')[0]
      // }
      return this.http.get<any>(CHATGPT + `search/${keywords}`);
    }
    getKeywordFromDb(keywords: any): Observable<any>{
      // const data = {
      //     "question":`learning resources of ${keywords} in JSON {"Books":[{"Author": "","Publisher":"","PublishingYear":"","Title":"","URL":""}],"OnlineCourses":[{"Course":"","Description":"","URL":"","platform":"", imgUrl:""}],"Youtube":[{"Name":"","Description":"","URL":""}]}]}`
      //   }
      return this.http.post<any>(CHATGPT + 'find-competencies', keywords);
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
    uploadCompetency(tenantId: string, file: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();
        formData.append('file', file);
        const req = new HttpRequest('POST', `${environment.apiUrl}/api/excel/upload/${tenantId}`, formData, {
        reportProgress: true,
        responseType: 'json'
        });
        return this.http.request(req);
    }

    uploadPreloadedData(file: File): Observable<HttpEvent<any>> {
      const formData: FormData = new FormData();
      formData.append('file', file);
      const req = new HttpRequest('POST', `${environment.apiUrl}/api/excel/uploadPreloadedData`, formData, {
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

     saveFeedback(feedback): Observable<any> {
          return this.http.post(`${environment.apiUrl}/api/v1/feedback/createFeedback`, feedback);
  }

}
