import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { Client, Competency } from 'src/app/_models/admin';
import { Role } from 'src/app/_models/role';
import { TaskStatus } from 'src/app/_models/taskStatus';
import { User } from 'src/app/_models/user';
import { ClientService } from 'src/app/_services/client.service';
import { UserService } from 'src/app/_services/user.service';
import { GoogleSearchComponent } from '../google-search/google-search.component';
import { PreloadedDataComponent } from '../preloaded-data/preloaded-data.component';

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
  gdata: any[];
  competencyDropdown: Array<any> = [];
  selectedcomptny:any;
  loading: boolean;
  preloadedData:any;
  constructor(
    private clientService: ClientService,
    private toastrService: ToastrService,
    private userService: UserService,
    private modalService: NgbModal,
    private router: Router) {
    }

  ngOnInit(): void {
    //  this.userService.getPreloadedData().subscribe(resp => {
    //   this.preloadedData = resp;
    //  });
    const obj = JSON.parse(sessionStorage.getItem('currentUser'));
    this.loggedInUserId = obj?.userId;
    this.getReportingEmployees();
    this.clientService.getCompetencies().subscribe(data => {
      // this.competencyList = data.data.reduce((group, a) => { group[a.name] = [...group[a.name] || [], a]; return group; }, {});
      // console.log(this.competencyList);
      this.competencyList = data;
      console.log(this.competencyList);
      this.competencyList.forEach(resp => {
        this.competencyDropdown.push(resp.cName);
      })

      this.competencyDropdown = this.removeDuplicates(this.competencyDropdown);
    });

    this.taskForm = new FormGroup({
      taskId: new FormControl(null),
      employeeId: new FormControl('', [Validators.required]),
      competencyId: new FormControl('', [Validators.required]),
      taskName: new FormControl('', [Validators.required]),
      taskDescription: new FormControl('', [Validators.required]),
      referanceUrl: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      taskStatus: new FormControl(TaskStatus.OPEN, [Validators.required])
    });
  }
  removeDuplicates(array: any[]): any[] {
    return array = [...new Set(array)];
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
      // payload.competencyId = parseInt(payload.competencyId.replace('L',''))
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

  /**
   *
   * @param competency
   * COMMENTED USING THE CHATGTP
   */
//   gotoGoogle(): void {
//     this.userService.getGSearchResults(this.keywords).subscribe(data=>{
//       const modalRef = this.modalService.open(GoogleSearchComponent, { size: 'lg' });
//        modalRef.componentInstance.gInfo = data;
//        modalRef.result.then((result) => {
//         console.log(result);
//         // this.taskForm.setValue()
//         this.taskForm.controls.referanceUrl.setValue(result['url']);
//       }, (reason) => {
//       });
//   //  window.open(`https://www.google.com/search?q=${this.keywords}`, '_blank');
//   });
// }

gotoGoogle(): void {
  this.loading = true;
  this.userService.getChatGtpList(this.keywords).subscribe(data=>{
          let resp = data.message;
          console.log(resp);
          console.log(typeof resp);
          //resp = JSON.stringify(resp);
         if(resp !== ''){
          resp = JSON.parse(resp);
          this.loading = false;
          const modalRef = this.modalService.open(GoogleSearchComponent, { size: 'lg' });
          modalRef.componentInstance.gInfo = resp;
          modalRef.result.then((result) => {
            console.log(result);
            // this.taskForm.setValue()
            this.taskForm.controls.referanceUrl.setValue(result.toString());
          }, (reason) => {
          });
         }
         else {
          this.toastrService.error('Returns Empty Response');
         }
      //  window.open(`https://www.google.com/search?q=${this.keywords}`, '_blank');
      });
}

fetchDataFromdb(){
  const key = this.keywords.split(' ');
  this.userService.getPreloadedData(this.keywords).subscribe(resp =>{
    const modalRef = this.modalService.open(PreloadedDataComponent, { size: 'lg' });
    modalRef.componentInstance.gInfo = resp;
    modalRef.result.then((result) => {
     console.log(result);
     // this.taskForm.setValue()
     this.taskForm.controls.referanceUrl.setValue(result.toString());
   }, (reason) => {
   });
  })
  // const result = this.preloadedData.filter(item => item.cName.toLowerCase() === key[0].toLowerCase());

}
  setLevels(competency): void {
    this.competencyLevels = [];
    console.log(competency);
    this.keywords = undefined;
    this.competencyLevels = this.competencyList.filter(event =>{
      if(event.cName.includes(competency)){
        return event;
      }
    })
    this.competencyLevels = this.removeDuplicates(this.competencyLevels);
    // if (competency) {
    //   this.competencyLevels = this.competencyList[competency];
    // }
    // console.log(Object.keys(this.competencyList).filter(c => c === competency));
  }
  setKeywords(data): void {
    console.log(data);
    console.log(JSON.stringify(data));
    if(data)
    {
      const cLevel = this.competencyLevels.filter((event: any) => {
        if(event.cLevel == data){
          return event.keywords;
        }
      })
      this.keywords = cLevel[0].keywords;
    }
    // if (data) {
    //   const gCompetency = this.competencyLevels.filter(competency => competency.id === +data).map(c => c.globalCompetency);
    //   if (gCompetency.length > 0 && gCompetency[0]?.keywords) {
    //     const keywords = gCompetency[0]?.keywords;
    //     let keysList = keywords && keywords.split(',') || null;
    //     keysList = keysList.map(m => m.trim());
    //     this.keywords = keysList.join('+');
    //   }
    // }
  }
}
