import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Menu } from '../home/home.component';
import { SessionUser, User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { ClientService } from '../_services/client.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeComponent implements OnInit {
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
  header = 'Employee Dashboard';

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
      this.loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
      this.menus = [{ name: 'Home', url: 'home' },
                    {
                    name: 'My Courses', url: '',
                    children: [
                      { name: 'Courses', url: 'courses' },
                      { name: 'Achievements', url: 'achievements' }
                    ]
                  }];
    //   this.clientService.getEmployeeMenus().subscribe(data => {
    //       this.menus = data;
    //   });
      this.userService.getById().pipe(first()).subscribe(user => {
          this.loading = false;
          this.userFromApi = user;
      });
  }

  goTo(parent, menu): void {
    this.header = menu?.name;
    let url = 'employee/';
    url = url.concat(menu?.url);
    this.router.navigateByUrl(url);
    // this.router.navigateByUrl(`employee/${url}`);
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigateByUrl('/security/login');
  }
}
