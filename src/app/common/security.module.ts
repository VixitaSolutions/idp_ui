import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SecurityRoutingModule } from './security-routing.module';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { SharedModule } from '../shared/shared.module';
import { FirstTimeLoginComponent } from './first-time-login/first-time-login.component';


@NgModule({
  declarations: [LoginComponent, RegistrationComponent, ForgotPasswordComponent, OtpVerificationComponent, FirstTimeLoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SecurityRoutingModule,
    SharedModule
  ]
})
export class SecurityModule { }
