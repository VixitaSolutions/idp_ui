import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AchievementsComponent } from './achievements/achievements.component';
import { CoursesComponent } from './courses/courses.component';
import { EmployeeHomeComponent } from './employee-home/employee-home.component';
import { EmployeeComponent } from './employee.component';
import { MyidpComponent } from './myidp/myidp.component';

const routes: Routes = [
  { path: '', component: EmployeeComponent,
    children: [
      {path : 'home', component: EmployeeHomeComponent},
      { path: 'courses', component: CoursesComponent },
      {path : 'achievements', component: AchievementsComponent},
      {path : 'idp', component: MyidpComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
