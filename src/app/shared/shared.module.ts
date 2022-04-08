import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BusyIndicatorDirective } from '../_helpers/busy-indicator.directive';
import { LoadingComponent } from '../loading-component';
import { NgbdSortableHeaderDirective } from '../_directives/sortable.directive';
import { NgbAccordionModule, NgbDropdownModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [BusyIndicatorDirective, LoadingComponent, NgbdSortableHeaderDirective],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NgbModalModule, NgbDropdownModule,
    NgbAccordionModule, NgbModule
  ],
  exports: [BusyIndicatorDirective, NgbdSortableHeaderDirective,
    CommonModule, FormsModule, ReactiveFormsModule, NgbModalModule, NgbDropdownModule,
    NgbAccordionModule, NgbModule, DatePipe],
  entryComponents: [LoadingComponent],
  providers: [DatePipe]
})
export class SharedModule { }
