import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../_services/authentication.service';
import { Constants } from './Constants';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.tenantId) {
            request = request.clone({headers: request.headers.set('tenant-id', this.authenticationService.currentUserValue.tenantId)});
        }
        // request = request.clone({headers: request.headers.set('tenant-id', Constants.TENANT_ID)});
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].indexOf(err.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                this.authenticationService.logout();
                // location.reload(true);
            }
            return this.handleError(err);
            // const error = err.error.message || err.statusText;
            // return throwError(error);
        }));
    }

    handleError(error): Observable<never> {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else if (error?.error?.message) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }
}