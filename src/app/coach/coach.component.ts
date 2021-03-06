import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { merge } from 'rxjs';
import { first } from 'rxjs/operators';
import { Menu } from '../home/home.component';
import { Role } from '../_models/role';
import { SessionUser, User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { ClientService } from '../_services/client.service';
import { UserService } from '../_services/user.service';

@Component({
    selector: 'app-coach',
    templateUrl: './coach.component.html',
    styleUrls: ['./coach.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CoachComponent implements OnInit {
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
    header = 'Coach Dashboard';
    loggedInUser: any;
    currentMenu: string = undefined;
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
        const paths = this.router?.url && this.router.url?.split('/');
        this.currentMenu = paths && paths[paths.length - 1];
        // this.loggedInUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.loading = true;
        const mgrmenu$ = this.clientService.getCoachMenus();
        const empmenu$ = this.clientService.getEmployeeMenus();
        this.menus = [];
        merge(mgrmenu$, empmenu$).subscribe((data: Menu[]) => {
            this.menus.push(...data);
        });
        const index = this.menus.reverse().findIndex(x => x.name.toLowerCase() === 'home');
        const count = this.menus.length - 1;
        const lastIndex = index >= 0 ? count - index : index;
        this.menus.reverse();
        this.menus.splice(lastIndex, 1);
        this.userService.getById().pipe(first()).subscribe(user => {
            this.loading = false;
            this.userFromApi = user;
        });
    }

    getUserInfo(): void {
        this.loggedInUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.role = Role.Coach === this.loggedInUser?.roleIds ? 'Coach' : undefined;
    }

    goTo(parent, menu): void {
        this.header = menu?.name;
        let url = 'coach/';
        if (parent && parent.name === 'My Courses') {
            url = url.concat('self/');
        }
        url = url.concat(menu?.url);
        this.router.navigateByUrl(url);
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
