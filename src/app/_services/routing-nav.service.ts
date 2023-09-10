import { Injectable } from '@angular/core';
import { Router, RoutesRecognized, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RoutingNavService {
  private previousUrl: string = undefined;
  private currentUrl: string = undefined;

  constructor(private router : Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        console.log(this.currentUrl);
        console.log(this.previousUrl);
      };
    });
  }

  public getPreviousUrl(){
    return this.previousUrl;
  }
}
