import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BusyIndicatorDirective } from '../_helpers/busy-indicator.directive';
import { LoadingComponent } from '../loading-component';
import { NgbdSortableHeaderDirective } from '../_directives/sortable.directive';
import { NgbAccordionModule, NgbDropdownModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { PasswordResetComponent } from '../common/password-reset/password-reset.component';



@NgModule({
  declarations: [BusyIndicatorDirective, LoadingComponent, NgbdSortableHeaderDirective, UserProfileComponent, PasswordResetComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NgbModalModule, NgbDropdownModule,
    NgbAccordionModule, NgbModule
  ],
  exports: [BusyIndicatorDirective, NgbdSortableHeaderDirective,
    CommonModule, FormsModule, ReactiveFormsModule, NgbModalModule, NgbDropdownModule,
    NgbAccordionModule, NgbModule, DatePipe, UserProfileComponent, PasswordResetComponent],
  entryComponents: [LoadingComponent],
  providers: [DatePipe]
})
export class SharedModule { }
