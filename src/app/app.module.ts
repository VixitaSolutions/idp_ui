import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, ɵNgSelectMultipleOption } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { ToastrModule, ToastNoAnimationModule  } from 'ngx-toastr';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { DynamicModalService } from './dynamic-modal/dynamic-modal.service';
import { ConfirmationModalComponent } from './dynamic-modal/confirmation-modal.component';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';
import { ModalDialogService } from './modal-dialog/modal-dialog.service';
import { CompetencyMappingComponent } from './competency-mapping/competency-mapping.component';
import { ManageEmployeesComponent } from './manage-employees/manage-employees.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { SharedModule } from './shared/shared.module';
import { ErrorComponent } from './error/error.component';
import { UploadCompetancyComponent } from './upload-competancy/upload-competancy.component';
import { PreloadedDataComponent } from './preloaded-data/preloaded-data.component';
import { ManagePreloadeddataComponent } from './manage-preloadeddata/manage-preloadeddata.component';
@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ConfirmationModalComponent,
    ModalDialogComponent,
    CompetencyMappingComponent,
    ManageEmployeesComponent,
    AddEmployeeComponent,
    UploadDataComponent,
    PreloadedDataComponent,
    ErrorComponent,
    UploadCompetancyComponent,
    ManagePreloadeddataComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ToastrModule.forRoot(),
    ToastNoAnimationModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    SharedModule
  ],
  providers: [
    DynamicModalService,
    ModalDialogService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    // fakeBackendProvider
  ],
  exports: [NgbModule],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
