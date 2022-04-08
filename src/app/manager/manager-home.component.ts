import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { merge } from 'rxjs';
import { first } from 'rxjs/operators';
import { Menu } from '../home/home.component';
import { SessionUser, User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { ClientService } from '../_services/client.service';
import { UserService } from '../_services/user.service';

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
  active;
  loggedInUser: any;
  collapsed = true;

  constructor(
      private userService: UserService,
      private authenticationService: AuthenticationService,
      private router: Router,
      private clientService: ClientService,
  ) {
      this.currentUser = this.authenticationService.currentUserValue;
  }

  get getCurrent(): boolean { return true; }
  ngOnInit(): void {
      this.loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
      this.active = this.router?.url?.substring(this.router?.url?.lastIndexOf('/') + 1);
      this.loading = true;
      this.clientService.getManagerMenus().subscribe(data => {
        this.menus = data;
      });
    //   this.menus.forEach(m => {
    //     if (m.name === 'My Courses') {
    //         m.children.forEach(x => x.url = `employee/${x.url}`);
    //     }
    // });
      // const index = this.menus.reverse().findIndex(x => x.name.toLowerCase() === 'home');
      // const count = this.menus.length - 1;
      // const lastIndex = index >= 0 ? count - index : index;
      // console.log(lastIndex);
      // this.menus.reverse();
      // this.menus.splice(lastIndex, 1);
      this.userService.getById().pipe(first()).subscribe(user => {
          this.loading = false;
          this.userFromApi = user;
      });
  }

  goTo(menu): void {
      this.header = menu?.name;
      this.router.navigateByUrl(`manager/${menu?.url}`);
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigateByUrl('/security/login');
  }

}
