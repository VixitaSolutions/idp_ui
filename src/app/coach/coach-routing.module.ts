import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CourseAssignmentComponent } from './course-assignment/course-assignment.component';
import { CoursesAssignedComponent } from './courses-assigned/courses-assigned.component';
import { CoachComponent } from './coach.component';
import { CoursesComponent } from '../employee/courses/courses.component';
import { GoogleSearchComponent } from './google-search/google-search.component';

const routes: Routes = [
  {
    path: '',
    component: CoachComponent,
    children: [
      {path : 'home', component: HomeComponent},
      {path : 'assign-course', component: CourseAssignmentComponent},
      {path : 'courses', component: CoursesAssignedComponent},
      {path : 'self/courses', component: CoursesComponent},
      {path: 'searchInfo', component: GoogleSearchComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoachRoutingModule { }
