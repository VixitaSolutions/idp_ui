import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, RouterEvent } from '@angular/router';
import { Constants } from './_helpers/Constants';
import { Client } from './_models/admin';
import { ClientService } from './_services/client.service';

const addPath = (urlAndQuery: string[]) => urlAndQuery[0] ? '/' + urlAndQuery[0] : '';
const addQuery = (urlAndQuery: string[]) => urlAndQuery[1] ? '?' + urlAndQuery[1] : '';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'idp-ui';
  isBusy: boolean;
  // store current tenant
  private activeTenant: string;
  private tenants: Client[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router, private clientService: ClientService) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        if (event.url.includes('/error')) {
          return;
        }
        this.routeCheck(event);
      }
    });
  }
  private routeCheck(event): void{
    if (this.tenants.length === 0) {
      this.clientService.getClients({status: true}).subscribe(data => {
        if (data?.length > 0) {
          this.tenants = data;
          this.routingGuard(event);
        } else {
          console.log('error page');
        }
      }, error => {
        console.log('error page');
      });
    } else {
      this.routingGuard(event);
    }
  }
  private routingGuard(event): void {
        const url = event.url === '/' ? '' : event.url;
        const urlAndQuery = url.split('?');
        const pathMap = urlAndQuery[0].split('/');
        // first element is an empty string, second element of the path segments is the tenant
        const firstPathPart = pathMap[1];

        // a known tenant is in the url path (in case of a direct page load)
        if (this.tenants.findIndex(tenant => tenant.clientName.toLowerCase() === firstPathPart.toLowerCase()) !== -1
            || firstPathPart === Constants.DEFAULT_TENANT) {
            // if tenant has changed, store it
            if (firstPathPart !== this.activeTenant) {
              this.activeTenant = firstPathPart;
            }
            sessionStorage.setItem('tenant-id', this.tenants.find(t => t.clientName.toLowerCase() === firstPathPart.toLowerCase()).id);
        } else {
          // no tenant in the path, so add the stored activeTenant or default
          let prefix;
          if (this.activeTenant) {
            prefix = this.activeTenant;
          } else {
            // prefix = Constants.DEFAULT_TENANT;
            this.router.navigate([`/${firstPathPart}/error`], {relativeTo: this.activatedRoute});
            return;
          }

          // finally build url of tenant prefix, path and query params
          const redirectUrl = '/' + prefix + addPath(urlAndQuery) + addQuery(urlAndQuery);
          this.router.navigate([redirectUrl]);
        }
  }
}
