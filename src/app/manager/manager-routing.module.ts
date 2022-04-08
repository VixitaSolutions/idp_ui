import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoachSummaryComponent } from './coach-summary/coach-summary.component';
import { CompetencySummaryComponent } from './competency-summary/competency-summary.component';
import { EmployeeSummaryComponent } from './employee-summary/employee-summary.component';
import { CoachComponent } from './manage/coach/coach.component';
import { EmployeeComponent } from './manage/employee/employee.component';
import { ManagerHomeComponent } from './manager-home.component';
import { OverallComponent } from './overall/overall.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: ManagerHomeComponent,
    children: [
      { path: 'home', component: OverviewComponent},
      { path: 'overall', component: OverallComponent},
      { path: 'cwise', component: CoachSummaryComponent},
      { path: 'cpwise', component: CompetencySummaryComponent},
      { path: 'ewise', component: EmployeeSummaryComponent},
      { path: 'manage-participant', component: EmployeeComponent},
      { path: 'manage-coach', component: CoachComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
