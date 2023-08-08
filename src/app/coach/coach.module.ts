import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

import { CoachRoutingModule } from './coach-routing.module';
import { CoachComponent } from './coach.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { CoursesAssignedComponent } from './courses-assigned/courses-assigned.component';
import { CourseAssignmentComponent } from './course-assignment/course-assignment.component';
import { GoogleSearchComponent } from './google-search/google-search.component';
import { PreloadedDataComponent } from './preloaded-data/preloaded-data.component';

@NgModule({
  declarations: [
    CoachComponent,
    HomeComponent,
    CoursesAssignedComponent,
    CourseAssignmentComponent,
    GoogleSearchComponent,
    PreloadedDataComponent
  ],
  imports: [
    CoachRoutingModule,
    SharedModule
  ],
  providers: [ DatePipe ]
})
export class CoachModule { }
