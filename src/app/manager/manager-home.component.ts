import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { merge, Observable, of} from 'rxjs';
import { first } from 'rxjs/operators';
import { Menu } from '../home/home.component';
import { Role } from '../_models/role';
import { SessionUser, User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { ClientService } from '../_services/client.service';
import { UserService } from '../_services/user.service';
import { RoutingNavService } from '../_services/routing-nav.service';

@Component({
  selector: 'app-manager-home',
  templateUrl: './manager-home.component.html',
  styleUrls: ['./manager-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManagerHomeComponent implements OnInit {

  loading = false;
  currentUser: SessionUser;
  userFromApi: User;
  menus: Menu[];
  isManageClient: boolean;
  isManageAdmin: boolean;
  isAdminHome: boolean;
  isCompetencyMapping: boolean;
  isManageEmployees: boolean;
  isUpload: boolean;
  header = 'Dashboard';
  active = 'home';
  loggedInUser: any;
  collapsed = true;
  defaultPage = true;
  showPwdResetPage = false;
  showProfilePage = false;
  role: string;
  drpdown = false;

  constructor(
      private userService: UserService,
      private authenticationService: AuthenticationService,
      private router: Router,
      private clientService: ClientService,
      private navService: RoutingNavService
  ) {
      this.currentUser = this.authenticationService.currentUserValue;
  }

  get getCurrent(): boolean { return true; }
  ngOnInit(): void {
      // this.loggedInUser = JSON.parse(sessionStorage.getItem('currentUser'));
      this.active = this.router?.url?.substring(this.router?.url?.lastIndexOf('/') + 1);
      this.setHeader();
      this.loading = true;
      this.clientService.getManagerMenus().subscribe(data => {
        this.menus = data;
      });
      this.userService.getById().pipe(first()).subscribe(user => {
          this.loading = false;
          this.userFromApi = user;
      });
  }

  getUserInfo(): void {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.role = Role.Manager === this.loggedInUser?.roleIds ? 'Manager' : undefined;
  }
  goTo(menu, url): void {
      this.header = menu;
      this.active = url;
      this.router.navigateByUrl(`manager/${url}`);
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigateByUrl('/security/login');
  }

  setPage(title: string): void {
    this.defaultPage = title === 'default';
    this.showProfilePage = title === 'profile';
    this.showPwdResetPage = title === 'resetPwd';
    if (this.showPwdResetPage) {
      sessionStorage.setItem('femail', this.userFromApi.userName);
    }
    if (this.defaultPage) {
      sessionStorage.removeItem('femail');
    }
  }
  setHeader(): void {
    switch (this.active) {
      case 'home':
        this.header = 'Home';
        break;
      case 'overall':
        this.header = 'Overall completion status';
        break;
      case 'cwise':
        this.header = 'Coach-wise summary';
        break;
      case 'cpwise':
        this.header = 'Competency-wise summary';
        break;
      case 'ewise':
        this.header = 'Participant-wise summary';
        break;
      case 'manage-coach':
        this.header = 'Manage Coach';
        break;
      case 'manage-participant':
        this.header = 'Manage Participant';
        break;
    }
  }

}
