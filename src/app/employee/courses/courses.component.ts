import { DatePipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { ModalDialogService } from 'src/app/modal-dialog/modal-dialog.service';
import { Task } from 'src/app/_models/task';
import { TaskStatus } from 'src/app/_models/taskStatus';
import { UserService } from 'src/app/_services/user.service';
import { CourseViewComponent } from '../course-view/course-view.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  manage = true;
  courseList: Task[] = [];
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

  constructor(
    private pipe: DatePipe,
    private modalService: NgbModal,
    private userService: UserService,
    private modalDialogService: ModalDialogService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    const obj = JSON.parse(sessionStorage.getItem('currentUser'));
    this.loggedInUserId = obj?.userId;
    this.selectedStatus.setValue(TaskStatus.NONE);
    this.getSelfCoursesByStatus(null);
    this.filter.valueChanges.subscribe(text => {
      this.rows = of(this.search(text, this.pipe));
    });
    this.selectedStatus.valueChanges.subscribe(val => {
      if (val) {
        this.getSelfCoursesByStatus(val !== TaskStatus.NONE ? val : null);
      }
    });
  }

  search(text: string, pipe: PipeTransform): any[] {
      return this.courseList.filter(client => {
        const term = text.toLowerCase();
        return client.taskName?.toLowerCase().includes(term);
            // || client.subscriptionStartDate ? pipe.transform(client.subscriptionStartDate).includes(term) : true
            // || client.subscriptionEndDate ? pipe.transform(client.subscriptionEndDate).includes(term) : true;
      });
  }
  getSelfCoursesByStatus(status): void {
    this.manage = true;
    this.isBusy = true;
    this.userService.getSelfCoursesByStatus(this.loggedInUserId, status).subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.courseList = data.data as Task[];
        this.collectionSize = this.courseList.length;
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
      this.clientDetails = this.courseList.filter(i => i.id === id)[0];
    }
  }
  acceptCourse(row: Task): void {
    if (row !== undefined) {
      row.taskStatus = TaskStatus.ACCEPTED;
      this.updateTaskStatus(row, TaskStatus.ACCEPTED);
    }
  }
  rejectCourse(row: Task): void {
    if (row !== undefined) {
      this.modalDialogService.confirm('', 'Are you sure want to Reject?', 'Yes', 'Cancel', 'lg', true)
      .then((confirmed: any) => {
        if (confirmed) {
          console.log('Deleted', confirmed);
          this.isBusy = true;
          row.taskStatus = TaskStatus.REJECTED;
          row.empComments = confirmed?.comments;
          this.updateTaskStatus(row, TaskStatus.REJECTED);
          return;
        }
      })
      .catch(() => {
        this.isBusy = false;
        this.toastrService.error(`Client Deletion failed`, 'Failure');
      });
    }
  }
  startProgress(row: Task): void {
    if (row !== undefined) {
      row.taskStatus = TaskStatus.INPROGRESS;
      this.updateTaskStatus(row, TaskStatus.INPROGRESS);
    }
  }
  completeCourse(row: Task): void {
    if (row !== undefined) {
      row.taskStatus = TaskStatus.COMPLETED;
      this.updateTaskStatus(row, TaskStatus.COMPLETED);
    }
  }
  submitCourse(row: Task): void {
    if (row !== undefined) {
      row.taskStatus = TaskStatus.SUBMITTED;
      this.updateTaskStatus(row, TaskStatus.SUBMITTED);
    }
  }
  private updateTaskStatus(row, status): void {
    this.isBusy = true;
    this.userService.saveTask(row).subscribe(data => {
      if (data.status === 'SUCCESS') {
        console.log(data);
        this.courseList.forEach(c => {
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

  viewCourseDetail(task): void {
    const modalRef = this.modalService.open(CourseViewComponent, { size: 'lg' });
    modalRef.componentInstance.task = task;
  }
  refresh(): void {
    this.rows = of(this.courseList
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize));
  }
}
