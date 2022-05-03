import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { Client, Competency } from 'src/app/_models/admin';
import { Role } from 'src/app/_models/role';
import { TaskStatus } from 'src/app/_models/taskStatus';
import { User } from 'src/app/_models/user';
import { ClientService } from 'src/app/_services/client.service';
import { UserService } from 'src/app/_services/user.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-course-assignment',
  templateUrl: './course-assignment.component.html',
  styleUrls: ['./course-assignment.component.scss']
})
export class CourseAssignmentComponent implements OnInit {

  userList: User[];
  collectionSize = 0;
  taskForm: FormGroup;
  id: string;
  clientName: string;
  clientDescription: string;
  mobile: string;
  email: string;
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  status: boolean;
  title = 'Create Task';
  disableName: boolean;
  isBusy: boolean;
  loggedInUserId: number = undefined;
  rows: Observable<Client[]>;
  competencyList: any = {};
  keywords: string;
  competencyLevels: Competency[];
  Object = Object;
  gcsesearch: SafeHtml;
  ss: boolean;

  constructor(
    private clientService: ClientService,
    private toastrService: ToastrService,
    private userService: UserService,
    private router: Router,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const obj = JSON.parse(sessionStorage.getItem('currentUser'));
    this.loggedInUserId = obj?.userId;
    this.getReportingEmployees();
    this.clientService.getCompetencies().subscribe(data => {
      this.competencyList = data.data.reduce((group, a) => { group[a.name] = [...group[a.name] || [], a]; return group; }, {});
      console.log(this.competencyList);
    });
    this.taskForm = new FormGroup({
      taskId: new FormControl(null),
      employeeId: new FormControl('', [Validators.required]),
      competencyId: new FormControl('', [Validators.required]),
      taskName: new FormControl('', [Validators.required]),
      taskDescription: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      taskStatus: new FormControl(TaskStatus.OPEN, [Validators.required])
    });
    this.gSearch();
  }
  gSearch(): void {
    this.gcsesearch = this.sanitizer.bypassSecurityTrustHtml('<gcse:search></gcse:search>');

    const cx = '87e78356c6a4c4a69';
    const gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = `https://cse.google.com/cse.js?cx=${cx}`;
    // gcse.src = 
    // 'https://cse.google.com/cse/element/v1?rsz=filtered_cse&num=10&hl=en&source=gcsc&gss=.com&cselibv=3e1664f444e6eb06&cx=87e78356c6a4c4a69&q=java%20oops%20concepts&safe=active&cse_tok=AJvRUv2Wn-FQiUJqsYJsWhBI3Mm8:1649593220674&sort=&exp=csqr,cc,4618906&oq=java%20oops&gs_l=partner-web.12.0.0i512i433j0i512l9.1540.3617.13.6778.9.9.0.0.0.0.240.1060.5j2j2.9.0.csems%2Cnrl%3D13...0.3474j3045104j10...1.34.partner-web..4.9.883.EhNMKwm1FhA&callback=google.search.cse.api17813';
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);
  }

  get f(): { [key: string]: AbstractControl } { return this.taskForm.controls; }

  get isDisable(): boolean { return this.disableName; }
  formatToNgbDate(date): NgbDate {
    if (date !== undefined && date !== '' && date !== null) {
      const d = new Date(date);
      return new NgbDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
    }
    return null;
  }
  save(): void {
    if (this.taskForm.valid) {
      this.isBusy = true;
      const payload = this.taskForm.getRawValue();
      this.userService.saveTask(payload).subscribe((data) => {
        if (data.status === 'SUCCESS') {
          this.toastrService.success('Task created successfully', 'Success');
          this.router.navigateByUrl('/coach/courses');
        } else {
          this.toastrService.error(`${data?.message}`, 'Failure');
        }
        this.isBusy = false;
      });
    } else {
      Object.keys(this.taskForm.controls).forEach(control => {
        if (this.taskForm.get(control).invalid) {
          this.taskForm.get(control).markAsTouched();
        }
      });
    }
  }
  formatDate(event): Date {
    if (event?.year && event?.day && event?.month) {
      return this.subscriptionStartDate = new Date(event?.year, parseInt(event?.month, 10) - 1, event?.day);
    }
    return undefined;
  }
  getReportingEmployees(): void {
    this.userService.getEmployeesByManager(Role.EMPLOYEE, this.loggedInUserId).subscribe((data) => {
      if (data.status === 'SUCCESS') {
        this.userList = (data.message === 'User Not found') ? [] : data.data;
      }
      this.isBusy = false;
    });
  }
  gotoGoogle(): void {
    this.ss = true;
    window.open('./search-results.html');
   // window.open(`https://www.google.com/search?q=${this.keywords}`, '_blank');
  //  this.gSearch();
  }
  setLevels(competency): void {
    this.keywords = undefined;
    if (competency) {
      this.competencyLevels = this.competencyList[competency];
    }
    console.log(Object.keys(this.competencyList).filter(c => c === competency));
  }
  setKeywords(data): void {
    if (data) {
      const gCompetency = this.competencyLevels.filter(competency => competency.id === +data).map(c => c.globalCompetency);
      if (gCompetency.length > 0 && gCompetency[0]?.keywords) {
        const keywords = gCompetency[0]?.keywords;
        let keysList = keywords && keywords.split(',') || null;
        keysList = keysList.map(m => m.trim());
        this.keywords = keysList.join('+');
      }
    }
  }
}
