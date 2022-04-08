import { NgModule } from '@angular/core';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee.component';
import { SharedModule } from '../shared/shared.module';
import { EmployeeHomeComponent } from './employee-home/employee-home.component';
import { AchievementsComponent } from './achievements/achievements.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseViewComponent } from './course-view/course-view.component';


@NgModule({
  declarations: [
    EmployeeComponent,
    EmployeeHomeComponent,
    AchievementsComponent,
    CoursesComponent,
    CourseViewComponent
  ],
  imports: [
    SharedModule,
    EmployeeRoutingModule
  ]
})
export class EmployeeModule { }
