import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { SessionUser, User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<SessionUser>;
    public currentUser: Observable<SessionUser>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<SessionUser>(JSON.parse(sessionStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public authenticate(username, password): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/api/auth/login`, {username, password});
    }

    public get currentUserValue(): SessionUser {
        return this.currentUserSubject.value;
    }
    public get currentTenantValue(): string {
        return sessionStorage.getItem('tenant-id');
    }
    public getById(): Observable<User> {
        return this.http.get<User>(`${environment.apiUrl}/api/v1/user/profile`)
        .pipe(map((data: any) => {
            return data.data;
        }));
    }

    login(body): any {
        // const  body = { username, password, loginType: 'byUserName' };
        return this.http.post<any>(`${environment.apiUrl}/api/auth/login`, body)
            .pipe(map((user: any) => {
                const result: SessionUser = user?.data;
                // login successful if there's a jwt token in the response
                if (result && result.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    // sessionStorage.setItem('currentUser', JSON.stringify(user.data));
                    this.currentUserSubject.next(result);
                    this.getById().subscribe((data: any) => {
                        // sessionStorage.setItem('id', data.userId);
                        result.firstName = data.firstName;
                        result.lastName = data.lastName;
                        result.userId = data.userId;
                        sessionStorage.setItem('currentUser', JSON.stringify(user.data));
                        this.currentUserSubject.next(result);
                    });
                }
                return user.data;
            }));
    }

    logout(): void {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('tenant-id');
        this.currentUserSubject.next(null);
    }

    sendOTP(email): Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/v1/login/send/otp`, {email: email.email, otpType: 'FORGOT_PASSWORD'});
    }

    verify(email, otp): Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/v1/login/verify/otp`, {email, otp, otpType: 'FORGOT_PASSWORD'});
    }

    createPassword(email, password): Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/v1/login/create/password`, {email, otp: password});
    }

    sendTemporaryPwd(email): Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/v1/login/send/temporaryPassword`, email);
    }
    verifyTemporaryPwd(email, otp): Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/v1/login/verify/temporaryPassword`, {email, otp, otpType: 'TEMPORARY_PASSWORD'});
    }
}
