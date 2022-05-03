import { DatePipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { CourseViewComponent } from 'src/app/employee/course-view/course-view.component';
import { ModalDialogService } from 'src/app/modal-dialog/modal-dialog.service';
import { Role } from 'src/app/_models/role';
import { Task } from 'src/app/_models/task';
import { TaskStatus } from 'src/app/_models/taskStatus';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-courses-assigned',
  templateUrl: './courses-assigned.component.html',
  styleUrls: ['./courses-assigned.component.scss']
})
export class CoursesAssignedComponent implements OnInit {
  manage = true;
  coursesAccepted: Task[] = [];
  clientDetails: any;
  searchTerm: string;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  rows: Observable<Task[]>;
  filter = new FormControl('');
  selectedStatus = new FormControl('');
  isBusy: boolean;
  loggedInUserId: number;
  statuses = TaskStatus;
  userList: Observable<User[]>;
  selectedEmployee =  new FormControl('');

  constructor(
    private pipe: DatePipe,
    private modalDialogService: ModalDialogService,
    private userService: UserService,
    private toastrService: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    const obj = JSON.parse(sessionStorage.getItem('currentUser'));
    this.loggedInUserId = obj?.userId;
    this.selectedStatus.setValue(TaskStatus.NONE);
    this.selectedEmployee.setValue('ALL');
    this.getCoursesByStatus(null);
    this.getReportingEmployees();
    this.filter.valueChanges.subscribe(text => {
      this.rows = of(this.search(text, this.pipe));
    });
    this.selectedStatus.valueChanges.subscribe(val => {
      if (val) {
        if (val !== 'ALL') {
          if (this.selectedEmployee.value !== 'ALL') {
            this.getEmployeeCoursesByStatus(this.selectedEmployee.value);
          } else {
            this.getCoursesByStatus(val !== TaskStatus.NONE ? val : null);
          }
        } else {
          if (this.selectedEmployee.value !== 'ALL') {
            this.getEmployeeCoursesByStatus(this.selectedEmployee.value);
          } else {
            this.getCoursesByStatus(val !== TaskStatus.NONE ? val : null);
          }
        }
      }
    });
    this.selectedEmployee.valueChanges.subscribe(val => {
      if (val) {
        if (val !== 'ALL') {
          this.getEmployeeCoursesByStatus(val);
        } else {
          this.getCoursesByStatus(val !== TaskStatus.NONE ? val : null);
        }
      }
    });
  }

  search(text: string, pipe: PipeTransform): any[] {
      return this.coursesAccepted.filter(client => {
        const term = text.toLowerCase();
        return client.taskName?.toLowerCase().includes(term);
            // || client.subscriptionStartDate ? pipe.transform(client.subscriptionStartDate).includes(term) : true
            // || client.subscriptionEndDate ? pipe.transform(client.subscriptionEndDate).includes(term) : true;
      });
  }
  getCoursesByStatus(status): void {
    this.manage = true;
    this.isBusy = true;
    this.userService.getCoursesByStatus(this.loggedInUserId, status).subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.coursesAccepted = data.data as Task[];
        this.collectionSize = this.coursesAccepted.length;
        this.refresh();
        this.isBusy = false;
      } else {
        this.isBusy = false;
      }
    });
  }
  edit(id): void {
    if (id !== undefined) {
      this.manage = false;
      this.clientDetails = this.coursesAccepted.filter(i => i.id === id)[0];
    }
  }
  approveCourse(row: Task): void {
    if (row !== undefined) {
      row.taskStatus = TaskStatus.APPROVED;
      this.updateTaskStatus(row, TaskStatus.APPROVED);
    }
  }
  private updateTaskStatus(row, status): void {
    this.isBusy = true;
    this.userService.saveTask(row).subscribe(data => {
      if (data.status === 'SUCCESS') {
        console.log(data);
        this.coursesAccepted.forEach(c => {
          if (c.id === row.id) {
            c.taskStatus = status;
          }
        });
        this.refresh();
        this.toastrService.success('Task updated successfully', 'Success');
      } else {
        this.toastrService.error('Client update failed', 'Failure');
      }
      this.isBusy = false;
    });
  }
  rejectCourse(row: Task): void {
    if (row !== undefined) {
      this.modalDialogService.confirm('', 'Are you sure want to Decline?', 'Yes', 'Cancel', 'lg', true)
      .then((confirmed: any) => {
        if (confirmed) {
          console.log('Deleted', confirmed);
          this.isBusy = true;
          row.taskStatus = TaskStatus.DECLINED;
          row.coachComments = confirmed?.comments;
          this.updateTaskStatus(row, TaskStatus.DECLINED);
          return;
        }
      })
      .catch(() => {
        this.isBusy = false;
        this.toastrService.error(`Client Deletion failed`, 'Failure');
      });
    }
  }
  refresh(): void {
    this.rows = of(this.coursesAccepted
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize));
  }
  viewCourseDetail(task): void {
    const modalRef = this.modalService.open(CourseViewComponent, { size: 'lg' });
    modalRef.componentInstance.task = task;
  }
  getReportingEmployees(): void {
    this.isBusy = true;
    this.userService.getEmployeesByManager(Role.EMPLOYEE, this.loggedInUserId).subscribe((data) => {
      if (data.status === 'SUCCESS') {
        this.userList = (data.message === 'User Not found') ? of([]) : of(data.data);
      }
      this.isBusy = false;
    });
  }
  getEmployeeCoursesByStatus(employeeId): void {
    this.manage = true;
    this.isBusy = true;
    this.userService.getSelfCoursesByStatus(employeeId,
      this.selectedStatus.value !== 'ALL' ? this.selectedStatus.value : null).subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.coursesAccepted = data.data as Task[];
        this.collectionSize = this.coursesAccepted.length;
        this.refresh();
        this.isBusy = false;
      } else {
        this.isBusy = false;
      }
    });
  }
}
