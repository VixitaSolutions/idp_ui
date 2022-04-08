import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Role } from '../_models/role';
import { User } from '../_models/user';
import { ClientService } from '../_services/client.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit {

  @Input() adminDetails;
  @Output() closeEvent = new EventEmitter<boolean>();
  userList: User[];
  clients: any;
  id: number;
  addAdminForm: FormGroup;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  tenantId: string;
  title = 'Add Admin';
  disableName: boolean;
  isBusy: boolean;
  status = true;
  constructor(
    private clientService: ClientService,
    private userService: UserService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.isBusy = true;
    this.clientService.getClients({status: true}).subscribe(data => {
      if (data) {
        this.clients = data;
      }
      this.isBusy = false;
    });
    if (this.adminDetails !== undefined) {
      this.title = 'Edit Admin';
      this.id = this.adminDetails.id;
      this.firstName = this.adminDetails.firstName;
      this.lastName = this.adminDetails.lastName;
      this.mobile = this.adminDetails.mobile;
      this.email = this.adminDetails.email;
      this.tenantId = this.adminDetails.tenantId;
      this.disableName = true;
      this.getUserList(this.tenantId);
    }
    this.addAdminForm = new FormGroup({
      userId: new FormControl(this.id, [Validators.required]),
      mobile: new FormControl(this.mobile, [Validators.required]),
      email: new FormControl(this.email, [Validators.required]),
      tenantId: new FormControl(this.tenantId, [Validators.required]),
      status: new FormControl(this.status)
    });
    if (this.adminDetails === undefined) {
      this.addAdminForm.get('status').disable();
    } else {
      this.addAdminForm.get('tenantId').disable();
      this.addAdminForm.get('userId').disable();
      this.addAdminForm.get('email').disable();
      this.addAdminForm.get('mobile').disable();
    }
  }
  get f(): { [key: string]: AbstractControl } { return this.addAdminForm.controls; }

  get isDisable(): boolean { return this.disableName; }
  save(): void {
    if (this.addAdminForm.valid) {
      this.isBusy = true;
      console.log(this.addAdminForm.getRawValue());
      const payload = this.addAdminForm.getRawValue();
      this.userService.addAdmin(payload.userId, Role.Manager, payload.status).subscribe(data => {
        if (data.status === 'SUCCESS') {
          this.toastrService.success('Saved successfully', 'Success');
          this.closeEvent.emit(true);
        } else {
          this.toastrService.error(data.message, 'Failure');
        }
        this.isBusy = false;
      });
    }
  }
  setUsers(): void {
    this.isBusy = true;
    this.addAdminForm.get('userId').patchValue(undefined);
    this.addAdminForm.get('email').patchValue(undefined);
    this.addAdminForm.get('mobile').patchValue(undefined);
    if (this.addAdminForm.get('tenantId').value !== undefined) {
      this.getUserList(this.addAdminForm.get('tenantId').value);
    }
  }
  getUserList(tenantId): void {
    this.clientService.getUsers(tenantId, null).subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.userList = data.data;
        this.isBusy = false;
      }
    });
  }

  setEmail(): void {
    const userId = parseInt(this.addAdminForm.get('userId')?.value, 10);
    if (userId) {
      const user = this.userList.filter(u => u.id === userId)[0];
      if (user) {
        this.addAdminForm.get('email').patchValue(user?.email);
        this.addAdminForm.get('mobile').patchValue(user?.mobile);
        this.addAdminForm.get('email').disable();
        this.addAdminForm.get('mobile').disable();
      }
    }
  }
  reset(): void {
    this.addAdminForm.reset();
    this.addAdminForm.get('status').patchValue(true);
    this.userList = [];
  }
}
