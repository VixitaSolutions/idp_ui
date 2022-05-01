import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service';
import { catchError } from '../../../../node_modules/rxjs/operators';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userName!: string;
  password!: string;
  rememberMe!: string;
  loginForm: FormGroup;
  submitted: boolean;
  showError: string;
  tenant: string;

  constructor(
      private authService: AuthenticationService,
      private router: Router) { }

  ngOnInit(): void {
    console.log(this.router.url);
    const url = this.router.url;
    if (url) {
      const tokens = url.split('/');
      console.log(tokens);
      if (tokens.length > 0) {
        if (url.startsWith('/')) {
          this.tenant = tokens[1];
        } else {
          this.tenant = tokens[0];
        }
      }
    }
    if (!this.tenant) {
      this.router.navigateByUrl('./security/login');
    }
    this.createForm();
  }
  get f(): { [key: string]: AbstractControl } { return this.loginForm.controls; }

  createForm(): void {
    this.loginForm = new FormGroup({
      userName: new FormControl(this.userName, [Validators.required, Validators.email]),
      password: new FormControl(this.password, [Validators.required])
    });
  }

  login(): void {
    this.submitted = true;
    this.showError = undefined;
    if (this.loginForm.valid && this.tenant) {
      const userName =  this.loginForm.get('userName').value;
      const pwd = this.loginForm.get('password').value;
      const  body = { username: userName, password: pwd, loginType: 'byUserName', tenant: this.tenant };
      this.authService.login(body).subscribe(data => {
        if (data?.tenantId) {
          if (data?.roleIds === 1) {
            this.router.navigateByUrl('/admin/dashboard');
          } else if (data?.roleIds === 2) {
            this.router.navigateByUrl('/manager/home');
          } else if (data?.roleIds === 4) {
            this.router.navigateByUrl('/coach/home');
          } else {
            this.router.navigateByUrl('/employee');
          }
        }
      }, error => {
        console.log(error);
        this.showError = 'Login Failed: Email or Password is Invalid';
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key).markAsTouched();
      });
      return;
    }
  }

}
