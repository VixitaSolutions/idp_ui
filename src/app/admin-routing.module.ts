import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { CompetencyMappingComponent } from './competency-mapping/competency-mapping.component';
import { HomeComponent } from './home/home.component';
import { ManageAdminsComponent } from './manage-admins/manage-admins.component';
import { ManageClientsComponent } from './manage-clients/manage-clients.component';
import { ManageEmployeesComponent } from './manage-employees/manage-employees.component';
import { UploadCompetancyComponent } from './upload-competancy/upload-competancy.component';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { PreloadedDataComponent } from './preloaded-data/preloaded-data.component';
import { ManagePreloadeddataComponent } from './manage-preloadeddata/manage-preloadeddata.component';
import { AuthGuard } from './_helpers';
import { Role } from './_models/role';

const routes: Routes = [
// { path: 'manage-clients', component: ManageClientsComponent },
{
  path: '',
  component: HomeComponent,
  children: [
    {path : 'dashboard',
    component: AdminHomeComponent},
  {
   path : 'manage-clients',
   component: ManageClientsComponent
  },
  {path: 'manage-admins', component: ManageAdminsComponent},
  {path: 'manage-employees', component: ManageEmployeesComponent},
  {path: 'manage-preloadedData', component: ManagePreloadeddataComponent},
  {path: 'competency-mapping', component: CompetencyMappingComponent},
  {path: 'upload-employees', component: UploadDataComponent},
  {path: 'preloaded-data', component: PreloadedDataComponent},
  {path: 'upload-competency', component: UploadCompetancyComponent}]
},
// { path: '', redirectTo: 'admin', pathMatch: 'full' }
// { path: '', component: CommonComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
