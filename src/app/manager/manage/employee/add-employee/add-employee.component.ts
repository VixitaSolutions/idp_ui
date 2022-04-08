import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Role } from 'src/app/_models/role';
import { ClientService } from 'src/app/_services/client.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  @Input() employeeDetails;
  addEmployeeForm: FormGroup;
  firstName: string;
  lastName: string;
  // clientName: string;
  tenantId: string;
  mobile: string;
  email: string;
  title = 'Add Employee';
  disableName: boolean;
  isBusy: boolean;
  employeesList: any[];
  coachId: number;
  active = true;
  userId: number = undefined;
  @Output() closeEvent = new EventEmitter<boolean>();

  constructor(
    private userService: UserService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    const obj = JSON.parse(localStorage.getItem('currentUser'));
    if (obj?.tenantId) {
      this.tenantId = obj.tenantId;
      // this.getUserList(obj.tenantId);
      this.getCoaches();
    }
    if (this.employeeDetails !== undefined) {
      this.title = 'Edit Employee';
      this.userId = this.employeeDetails.id;
      this.firstName = this.employeeDetails.firstName;
      this.lastName = this.employeeDetails.lastName;
      // this.clientName = this.employeeDetails.clientName;
      this.mobile = this.employeeDetails.mobile;
      this.email = this.employeeDetails.email;
      this.coachId = this.employeeDetails.coachId;
      this.disableName = true;
      this.active = this.employeeDetails.active;
      this.isBusy = true;
      this.userService.getAssignedCoach(this.userId).subscribe(data => {
        console.log(data);
        if (data.status === 'SUCCESS') {
          this.coachId = data?.data?.assignedCoachId;
          this.addEmployeeForm.get('coachId').setValue(this.coachId);
        }
        this.isBusy = false;
      });
    }
    this.addEmployeeForm = new FormGroup({
      id: new FormControl(this.userId, []),
      firstName: new FormControl(this.firstName, [Validators.required]),
      lastName: new FormControl(this.lastName, [Validators.required]),
      // clientName: new FormControl({value: this.clientName, disabled: this.isDisable}, [Validators.required]),
      tenantId: new FormControl(this.tenantId, []),
      mobile: new FormControl(this.mobile, [Validators.minLength(10), Validators.maxLength(10)]),
      email: new FormControl(this.email, [Validators.required, Validators.email]),
      coachId: new FormControl(this.coachId, [Validators.required]),
      role: new FormControl(Role.EMPLOYEE, []),
      active: new FormControl(this.active, [])
    });
  }
  get f(): { [key: string]: AbstractControl } { return this.addEmployeeForm.controls; }

  get isDisable(): boolean { return this.disableName; }
  save(): void {
    if (this.addEmployeeForm.valid) {
      console.log(this.addEmployeeForm.getRawValue());
      this.isBusy = true;
      this.userService.createUser(this.addEmployeeForm.getRawValue()).subscribe(data => {
        this.isBusy = false;
        if (data.status === 'SUCCESS') {
          this.toastrService.success('Participant added successfully', 'Success');
          this.closeEvent.emit(true);
        } else {
          this.toastrService.error(`${data?.message}`, 'Failure');
        }
      });
    }  else {
      Object.keys(this.addEmployeeForm.controls).forEach(control => {
        if (this.addEmployeeForm.get(control).invalid) {
          this.addEmployeeForm.get(control).markAsTouched();
        }
      });
    }
  }
  setEmail(): void {
    const userId = parseInt(this.addEmployeeForm.get('userId')?.value, 10);
    if (userId) {
      const user = this.employeesList.filter(u => u.id === userId)[0];
      if (user) {
        this.addEmployeeForm.get('email').patchValue(user?.email);
        this.addEmployeeForm.get('mobile').patchValue(user?.mobile);
        this.addEmployeeForm.get('email').disable();
        this.addEmployeeForm.get('mobile').disable();
      }
    }
  }

  // getUserList(tenantId): void {
  //   this.clientService.getUsers(tenantId, null).subscribe(data => {
  //     if (data.status === 'SUCCESS') {
  //       this.employeesList = data.data;
  //       this.isBusy = false;
  //     }
  //   });
  // }
  getCoaches(): void {
    this.isBusy = true;
    const payload = {roleId: Role.Coach, tenantId: this.tenantId};
    this.userService.getEmployees(payload).subscribe((data) => {
      if (data.status === 'SUCCESS') {
        this.employeesList = (data.message === 'User Not found') ? [] : data.data;
      }
      this.isBusy = false;
    });
  }
  // getCoaches(): void {
  //   this.isBusy = true;
  //   const obj = JSON.parse(localStorage.getItem('currentUser'));
  //   const loggedInUserId = obj?.userId;
  //   this.userService.getCoaches(Role.Coach, loggedInUserId).subscribe((data) => {
  //     if (data.status === 'SUCCESS') {
  //       this.employeesList = (data.message === 'User Not found') ? [] : data.data;
  //       this.isBusy = false;
  //     }
  //   });
  // }
}
