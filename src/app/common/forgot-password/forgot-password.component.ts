import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  default: boolean;
  userMail: string;
  forgotForm: FormGroup;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastrService: ToastrService) {
    this.default = true;
   }

  ngOnInit(): void {
    this.forgotForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }
  get f(): { [key: string]: AbstractControl } { return this.forgotForm.controls; }

  sendOTP(): void {
    if (this.forgotForm.valid) {
      console.log(this.forgotForm.value);
      this.userMail = this.forgotForm.value.email;
      this.authService.sendOTP(this.forgotForm.value).subscribe(data => {
        console.log('OTP sent successfully......');
        if (data.status === 'SUCCESS') {
          this.toastrService.success('OTP sent successfully', 'Success');
          this.default = false;
        } else {
          this.toastrService.error(`OTP sending failed, Error: ${data?.message}`, 'Failure');
          this.default = true;
        }
      }, error => {
        this.toastrService.error(`OTP sending failed, Error: ${error}`, 'Failure');
        this.default = true;
      });
    } else {
      Object.keys(this.forgotForm.controls).forEach(key => {
        this.forgotForm.get(key).markAsTouched();
      });
      return;
    }
  }

  next(value: string): void {
    if (value.toLocaleUpperCase() === 'SUCCESS') {
      localStorage.setItem('femail', this.userMail);
      this.router.navigate(['/security/reset'], {state: {email: this.userMail}});
    } else {

    }
  }
}
