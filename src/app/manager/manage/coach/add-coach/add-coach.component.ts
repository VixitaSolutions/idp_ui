import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Role } from 'src/app/_models/role';
import { ClientService } from 'src/app/_services/client.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-add-coach',
  templateUrl: './add-coach.component.html',
  styleUrls: ['./add-coach.component.scss']
})
export class AddCoachComponent implements OnInit {

  @Input() coachDetails;
  addCoachForm: FormGroup;
  employeeName: string;
  clientName: string;
  mobile: string;
  email: string;
  title = 'Add Coach';
  disableFields = false;
  isBusy: boolean;
  employeesList: any[];
  tenantId: string;
  firstName: string;
  lastName: string;
  userId: number = undefined;
  active = true;
  loggedInUserId: number;
  @Output() closeEvent = new EventEmitter<boolean>();

  constructor(
    private clientService: ClientService,
    private userService: UserService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    const obj = JSON.parse(sessionStorage.getItem('currentUser'));
    this.loggedInUserId = Number.parseInt(obj.userId, 10);
    if (obj?.tenantId) {
      this.tenantId = obj.tenantId;
    }
    if (this.coachDetails !== undefined) {
      this.title = 'Edit Coach';
      this.userId = this.coachDetails.id;
      this.firstName = this.coachDetails.firstName;
      this.lastName = this.coachDetails.lastName;
      this.mobile = this.coachDetails.mobile;
      this.email = this.coachDetails.email;
      this.disableFields = true;
      this.active = true;
      this.employeesList = [this.coachDetails];
    } else {
      this.getUserList(obj.tenantId);
    }
    this.addCoachForm = new FormGroup({
      id: new FormControl({value: this.userId, disabled: this.disableFields}, []),
      // firstName: new FormControl(this.firstName, [Validators.required]),
      // lastName: new FormControl(this.lastName, [Validators.required]),
      tenantId: new FormControl(this.tenantId, []),
      mobile: new FormControl({value: this.mobile, disabled: this.disableFields}, [Validators.minLength(10), Validators.maxLength(10)]),
      email: new FormControl({value: this.email, disabled: this.disableFields}, [Validators.required, Validators.email]),
      role: new FormControl(Role.Coach, []),
      active: new FormControl(this.active, [])
    });
  }
  get f(): { [key: string]: AbstractControl } { return this.addCoachForm.controls; }

  get isDisable(): boolean { return this.disableFields; }
  save(): void {
    if (this.addCoachForm.valid) {
      console.log(this.addCoachForm.getRawValue());
      const payload = {fromRoleId: Role.Manager, toRoleId: Role.Coach,
          fromUserId: this.loggedInUserId, toUserId: [this.addCoachForm.getRawValue().id]};
      console.log(payload);
      this.isBusy = true;
      const role: Role = this.addCoachForm.getRawValue().active ? Role.Coach : Role.EMPLOYEE;
      // this.userService.updateRole(payload, this.addCoachForm.getRawValue().active).subscribe(data => {
      this.userService.updateRole(this.addCoachForm.getRawValue().id, role).subscribe(data => {
        this.isBusy = false;
        if (data.status === 'SUCCESS') {
          this.toastrService.success(data?.message, 'Success');
          this.closeEvent.emit(true);
        } else {
          this.toastrService.error(`${data?.message}`, 'Failure');
        }
      });
    }  else {
      Object.keys(this.addCoachForm.controls).forEach(control => {
        if (this.addCoachForm.get(control).invalid) {
          this.addCoachForm.get(control).markAsTouched();
        }
      });
    }
  }
  setEmail(): void {
    const userId = parseInt(this.addCoachForm.get('id')?.value, 10);
    if (userId) {
      const user = this.employeesList.filter(u => u.id === userId)[0];
      if (user) {
        this.addCoachForm.get('email').patchValue(user?.email);
        this.addCoachForm.get('mobile').patchValue(user?.mobile);
        this.addCoachForm.get('email').disable();
        this.addCoachForm.get('mobile').disable();
      }
    }
  }

  getUserList(tenantId): void {
    this.clientService.getUsers(tenantId, Role.EMPLOYEE).subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.employeesList = data.data;
        this.isBusy = false;
      }
    });
  }

}
