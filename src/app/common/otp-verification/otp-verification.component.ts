import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormGroup, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service';
import { Router } from '@angular/router';
import { ToastrService } from '../../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent implements OnInit {

  @Input() email;
  @Output() closed = new EventEmitter<string>();
  verificationForm: FormGroup;
  forgotEmail: string;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastrService: ToastrService) {
    // this.forgotEmail = this.router.getCurrentNavigation().extras.state.email;
    // this.email = this.forgotEmail;
  }

  ngOnInit(): void {
    this.verificationForm = new FormGroup({
      digit1: new FormControl('', [Validators.required, otpValidator]),
      digit2: new FormControl('', [Validators.required, otpValidator]),
      digit3: new FormControl('', [Validators.required, otpValidator]),
      digit4: new FormControl('', [Validators.required, otpValidator]),
      digit5: new FormControl('', [Validators.required, otpValidator]),
      digit6: new FormControl('', [Validators.required, otpValidator])
    });
  }

  verify(): void {
    if (this.verificationForm.valid) {
      console.log(this.verificationForm.value);
      const OTP = `${this.verificationForm.value.digit1}${this.verificationForm.value.digit2}${this.verificationForm.value.digit3}${this.verificationForm.value.digit4}${this.verificationForm.value.digit5}${this.verificationForm.value.digit6}`;
      this.authService.verify(this.email, OTP).subscribe(data => {
        if (data.status === 'SUCCESS') {
          this.toastrService.success('OTP verified successfully !!', 'Success');
          this.closed.emit('success');
        } else {
          this.toastrService.error(`OTP verification failed, Error: ${data?.message}`, 'Failure');
          this.closed.emit('fail');
        }
      }, error => {
        this.toastrService.error(`OTP verification failed, Error: ${error}`, 'Failure');
        this.closed.emit('fail');
      });
    } else {
      Object.keys(this.verificationForm.controls).forEach(key => {
        this.verificationForm.get(key).markAsTouched();
      });
      return;
    }
  }
  get f(): { [key: string]: AbstractControl } { return this.verificationForm.controls; }

  get error(): ValidationErrors {
    const invalid: ValidationErrors = (this.f.digit1.touched && this.f.digit1.errors)
      || (this.f.digit2.touched && this.f.digit2.errors) || (this.f.digit3.touched && this.f.digit3.errors)
      || (this.f.digit4.touched && this.f.digit4.errors);
    return invalid;
  }
}

export const otpValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (control.value !== '' && !control.value.match(/(?<!\S)\d(?!\S)/g)) {
    control.setValue('');
    return { otp: true };
  }
  return null;
};
