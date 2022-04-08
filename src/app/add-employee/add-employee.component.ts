import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  @Input() employeeDetails;
  addEmployeeForm: FormGroup;
  employeeName: string;
  clientName: string;
  mobile: string;
  email: string;
  title = 'Add Employee';
  disableName: boolean;
  isBusy: boolean;

  constructor() { }

  ngOnInit(): void {
    if (this.employeeDetails !== undefined) {
      this.title = 'Edit Client';
      this.employeeName = this.employeeDetails.employeeName;
      this.clientName = this.employeeDetails.clientName;
      this.mobile = this.employeeDetails.clientNumber;
      this.email = this.employeeDetails.email;
      this.disableName = true;
    }
    this.addEmployeeForm = new FormGroup({
      employeeName: new FormControl({value: this.employeeName, disabled: this.isDisable}, [Validators.required]),
      clientName: new FormControl({value: this.clientName, disabled: this.isDisable}, [Validators.required]),
      mobile: new FormControl(this.mobile, [Validators.required]),
      email: new FormControl(this.email, [Validators.required])
    });
  }
  get f(): { [key: string]: AbstractControl } { return this.addEmployeeForm.controls; }

  get isDisable(): boolean { return this.disableName; }
  save(): void {
    if (this.addEmployeeForm.valid) {
      this.isBusy = true;
      setTimeout(() => {
        this.isBusy = false;
      }, 2000);
    }
  }
}
