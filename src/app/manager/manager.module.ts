import { NgModule } from '@angular/core';

import { ManagerRoutingModule } from './manager-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { SharedModule } from '../shared/shared.module';
import { ManagerHomeComponent } from './manager-home.component';
import { OverallComponent } from './overall/overall.component';
import { CoachSummaryComponent } from './coach-summary/coach-summary.component';
import { EmployeeSummaryComponent } from './employee-summary/employee-summary.component';
import { CompetencySummaryComponent } from './competency-summary/competency-summary.component';
import { CoachComponent } from './manage/coach/coach.component';
import { EmployeeComponent } from './manage/employee/employee.component';
import { AddCoachComponent } from './manage/coach/add-coach/add-coach.component';
import { AddEmployeeComponent } from './manage/employee/add-employee/add-employee.component';


@NgModule({
  declarations: [
    OverviewComponent,
    ManagerHomeComponent,
    OverallComponent,
    CoachSummaryComponent,
    EmployeeSummaryComponent,
    CompetencySummaryComponent,
    CoachComponent,
    EmployeeComponent,
    AddCoachComponent,
    AddEmployeeComponent
  ],
  imports: [
    SharedModule,
    ManagerRoutingModule
  ]
})
export class ManagerModule { }
