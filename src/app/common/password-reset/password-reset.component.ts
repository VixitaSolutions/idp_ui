import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../_services/authentication.service';
import { ToastrService } from '../../../../node_modules/ngx-toastr';

const passwordRegex = new RegExp(/^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/g);

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  @Input() emitValue: boolean;
  @Output() exitEmit = new EventEmitter<boolean>();
  default: boolean;
  header: string;
  userMail: string;
  pwdResetForm: FormGroup;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService) {
    this.header = 'Change Password';
    this.userMail = this.router.getCurrentNavigation()?.extras?.state?.email;
    if (!this.userMail) {
      this.userMail = sessionStorage.getItem('femail');
      sessionStorage.removeItem('femail');
    }
  }

  ngOnInit(): void {
    this.pwdResetForm = new FormGroup(
      {
        // currentPassword: new FormControl('', [Validators.required, Validators.pattern(passwordRegex)]),
        newPassword: new FormControl('', [Validators.required, Validators.pattern(passwordRegex)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.pattern(passwordRegex)])
      });
    if (this.emitValue) {
      this.pwdResetForm.addControl('currentPassword', new FormControl('', [Validators.required]));
    }
  }
  get f(): { [key: string]: AbstractControl } { return this.pwdResetForm.controls; }

  isPasswordMatch(): boolean {
    return this.pwdResetForm.get('newPassword').value === this.pwdResetForm.get('confirmPassword').value;
  }
  isCurrentPasswordMatch(): boolean {
    return (this.pwdResetForm.get('newPassword')?.value === this.pwdResetForm.get('currentPassword')?.value);
  }
  save(): void {
    if (this.pwdResetForm.valid && this.userMail && this.isPasswordMatch()) {
      if (this.pwdResetForm.get('currentPassword')?.value) {
        if (this.isCurrentPasswordMatch()) {
          this.toastrService.error(`New password must not be the current password`, 'Failure');
          return;
        }
      }
      this.authService.createPassword(this.userMail, this.pwdResetForm.get('confirmPassword').value,
      this.pwdResetForm.get('currentPassword')?.value).subscribe(data => {
        if (data.status === 'SUCCESS') {
          this.toastrService.success('Password reset successfully !! Please Login!!!', 'Success');
          if (!this.emitValue) {
            this.router.navigateByUrl('/security/login');
          } else {
            this.exitEmit.emit(true);
          }
        } else {
          this.toastrService.error(`Unable to reset the password, Error: ${data?.message}`, 'Failure');
        }
      }, error => {
        this.toastrService.error(`Unable to reset the password, Error: ${error}`, 'Failure');
      });
    } else {
      Object.keys(this.pwdResetForm.controls).forEach(key => {
        this.pwdResetForm.get(key).markAsTouched();
      });
      return;
    }
  }
  reset(): void {
    if (!this.emitValue) {
      this.router.navigateByUrl('/security/login');
    } else {
      this.exitEmit.emit(true);
    }
  }
}
