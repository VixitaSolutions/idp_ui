import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CourseAssignmentComponent } from './course-assignment/course-assignment.component';
import { CoursesAssignedComponent } from './courses-assigned/courses-assigned.component';
import { CoachComponent } from './coach.component';
import { CoursesComponent } from '../employee/courses/courses.component';

const routes: Routes = [
  {
    path: '',
    component: CoachComponent,
    children: [
      {path : 'home', component: HomeComponent},
      {path : 'assign-course', component: CourseAssignmentComponent},
      {path : 'courses', component: CoursesAssignedComponent},
      {path : 'self/courses', component: CoursesComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoachRoutingModule { }
