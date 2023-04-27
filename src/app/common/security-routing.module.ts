import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { FirstTimeLoginComponent } from './first-time-login/first-time-login.component';

const routes: Routes = [
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegistrationComponent },
{ path: 'forgot', component: ForgotPasswordComponent },
{ path: 'verify', component: OtpVerificationComponent },
{ path: 'reset', component: PasswordResetComponent },
{ path: 'firstLogin', component: FirstTimeLoginComponent}
// { path: '', component: CommonComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
