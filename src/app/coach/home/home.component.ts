import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from 'src/app/home/home.component';
import { Task } from 'src/app/_models/task';
import { TaskStatus } from 'src/app/_models/taskStatus';
import { ClientService } from 'src/app/_services/client.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  isBusy: boolean;
  @Input() menus: Menu[];
  @Output() component = new EventEmitter<string>();
  loggedInUserId: number;
  courses: Task[];
  groupByStatus: Task[];
  constructor(
    private clientService: ClientService,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    const obj = JSON.parse(sessionStorage.getItem('currentUser'));
    this.loggedInUserId = obj?.userId;
    this.clientService.getCoachMenus().subscribe((data: Menu[]) => {
      this.menus = data.filter(i => i.name === 'My Employees')[0].children;
    });
    this.getCoursesByStatus(null);
  }
  goTo(url): void {
    this.router.navigateByUrl(`coach/${url}`);
  }

  getCoursesByStatus(status): void {
    this.isBusy = true;
    this.userService.getCoursesByStatus(this.loggedInUserId, status).subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.courses = data.data as Task[];
        this.groupByStatus = data?.data.reduce((group, a) => {
          // group[a.taskStatus] = [...group[a.taskStatus] || [], a].length; return group; }, {});
          group[a.taskStatus] = group[a.taskStatus] ? group[a.taskStatus] + 1 : 1; return group; }, {});
      }
      this.isBusy = false;
    });
  }
}
