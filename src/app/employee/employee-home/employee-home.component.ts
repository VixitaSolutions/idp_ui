import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from 'src/app/home/home.component';
import { Task } from 'src/app/_models/task';
import { ClientService } from 'src/app/_services/client.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-employee-home',
  templateUrl: './employee-home.component.html',
  styleUrls: ['./employee-home.component.scss']
})
export class EmployeeHomeComponent implements OnInit {
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
    const obj = JSON.parse(localStorage.getItem('currentUser'));
    this.loggedInUserId = obj?.userId;
    this.clientService.getEmployeeMenus().subscribe((data: Menu[]) => {
      this.menus = data.filter(i => i.name === 'My Courses')[0]?.children;
    });
    this.getCoursesByStatus(null);
  }
  goTo(url): void {
    this.router.navigateByUrl(`employee/${url}`);
  }
  getCoursesByStatus(status): void {
    this.isBusy = true;
    this.userService.getSelfCoursesByStatus(this.loggedInUserId, status).subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.courses = data.data as Task[];
        this.groupByStatus = data?.data.reduce((group, a) => {
          // group[a.taskStatus] = [...group[a.taskStatus] || [], a].length || 0; return group; }, {});
          group[a.taskStatus] = group[a.taskStatus] ? group[a.taskStatus] + 1 : 1; return group; }, {});
      }
      this.isBusy = false;
    });
  }

}
