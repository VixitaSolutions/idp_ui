import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SecurityRoutingModule } from './security-routing.module';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';




@NgModule({
  declarations: [LoginComponent, RegistrationComponent, ForgotPasswordComponent, OtpVerificationComponent, PasswordResetComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SecurityRoutingModule
  ]
})
export class SecurityModule { }
