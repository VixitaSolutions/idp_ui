import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
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

  default: boolean;
  header: string;
  userMail: string;
  pwdResetForm: FormGroup;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService) {
    this.header = 'Create Password';
    this.userMail = this.router.getCurrentNavigation()?.extras?.state?.email;
    if (!this.userMail) {
      this.userMail = localStorage.getItem('femail');
      localStorage.removeItem('femail');
    }
  }

  ngOnInit(): void {
    this.pwdResetForm = new FormGroup(
      {
        // currentPassword: new FormControl('', [Validators.required, Validators.pattern(passwordRegex)]),
        newPassword: new FormControl('', [Validators.required, Validators.pattern(passwordRegex)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.pattern(passwordRegex)])
      });
  }
  get f(): { [key: string]: AbstractControl } { return this.pwdResetForm.controls; }

  isPasswordMatch(): boolean {
    return this.pwdResetForm.get('newPassword').value === this.pwdResetForm.get('confirmPassword').value;
  }
  reset(): void {
    if (this.pwdResetForm.valid && this.userMail && this.isPasswordMatch()) {
      console.log(this.pwdResetForm.value);
      this.authService.createPassword(this.userMail, this.pwdResetForm.get('confirmPassword').value).subscribe(data => {
        if (data.status === 'SUCCESS') {
          this.toastrService.success('Password reset successfully !! Please Login!!!', 'Success');
          this.router.navigateByUrl('/security/login');
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
}
