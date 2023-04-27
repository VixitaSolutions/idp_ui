import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { AuthenticationService } from '../../_services/authentication.service';
import { ToastrService } from '../../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-first-time-login',
  templateUrl: './first-time-login.component.html',
  styleUrls: ['./first-time-login.component.scss']
})
export class FirstTimeLoginComponent implements OnInit {

  userMail: string;
  registrationForm: FormGroup;
  temporaryForm: FormGroup;
  showError: string = undefined;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
    this.temporaryForm = new FormGroup({
      tempPwd: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
    });
  }
  get f(): { [key: string]: AbstractControl } { return this.registrationForm.controls; }
  get fr(): { [key: string]: AbstractControl } { return this.temporaryForm.controls; }
  register(): void {
    if (this.registrationForm.valid) {
      this.showError = undefined;
      this.temporaryForm.reset();
      this.userMail = this.registrationForm.value.email;
      this.authService.sendTemporaryPwd(this.registrationForm.value).subscribe(data => {
        if (data.status === 'SUCCESS') {
          this.registrationForm.reset();
          this.toastrService.success('OTP sent successfully', 'Success');
        } else {
          this.toastrService.error(`OTP sending failed, Error: ${data.message}`, 'Failure');
        }
      }, error => {
        this.toastrService.error(`OTP sending failed, Error: ${error}`, 'Failure');
      });
    } else {
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key).markAsTouched();
      });
    }
  }
  validate(): void {
    if (!this.userMail) {
      this.showError = 'Please Request for OTP';
      return;
    }
    if (this.temporaryForm.valid && this.userMail) {
      this.showError = undefined;
      this.authService.verifyTemporaryPwd(this.userMail, this.temporaryForm.value.tempPwd).subscribe((data: any) => {
        if (data.status === 'SUCCESS') {
          this.toastrService.success('OTP verified successfully', 'Success');
          if (this.userMail) {
            sessionStorage.setItem('femail', this.userMail);
          } 
          this.router.navigate(['/security/reset'], {state: {email: this.userMail}});
        } else {
          this.toastrService.error(`OTP verification failed, Error: Invalid OTP`, 'Failure');
        }
      }, error => {
        this.toastrService.error(`OTP verification failed, Error: ${error}`, 'Failure');
      });
    } else {
      Object.keys(this.temporaryForm.controls).forEach(key => {
        this.temporaryForm.get(key).markAsTouched();
      });
    }
  }
}
