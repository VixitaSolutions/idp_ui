import { Injectable } from '@angular/core';
import { Router, RoutesRecognized, ActivatedRoute } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RoutingNavService {
  previousRoute: any;

  constructor(private router: Router,private authService: AuthenticationService, private activatedRoute: ActivatedRoute) {
    router.events
      .pipe(
        filter(event => event instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((e: any) => {
        this.previousRoute = e[0].urlAfterRedirects;
        if(this.previousRoute == undefined){
          this.authService.logout();
          this.router.navigateByUrl('OVERSOUL/security/login');
        }
      });
  }

  navToLoginPage(){
    if(this.previousRoute == undefined){
      this.authService.logout();
      this.router.navigateByUrl('/security/login');
    }
  }
}
