import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { SessionUser, User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { UserService } from '../_services/user.service';
import { Router } from '../../../node_modules/@angular/router';
import { ClientService } from '../_services/client.service';
import { Role } from '../_models/role';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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
    loggedInUser: any;
    defaultPage = true;
    showPwdResetPage = false;
    showProfilePage = false;
    role: string;

    constructor(
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private router: Router,
        private clientService: ClientService,
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit(): void {
        this.loading = true;
        // this.loggedInUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.clientService.getMenus().subscribe(data => {
            this.menus = data;
        });
        this.userService.getById().pipe(first()).subscribe(user => {
            this.loading = false;
            this.userFromApi = user;
        });
    }

    getUserInfo(): void {
        this.loggedInUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.role = Role.Admin === this.loggedInUser?.roleIds ? 'Super Admin' : undefined;
    }

    goTo(name): void {
        this.isAdminHome = name === 'Home' ? true : false;
        this.isManageClient = name === 'Manage Clients' ? true : false;
        this.isManageAdmin = name === 'Manage Admins' ? true : false;
        this.isCompetencyMapping = name === 'Competency Mapping' ? true : false;
        this.isManageEmployees = name === 'All Employees Data' ? true : false;
        this.isUpload = (name === 'Upload Competency' || name === 'Upload Employees') ? true : false;
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

}
export class Menu {
name: string;
url?: string;
children?: Menu[];
}
