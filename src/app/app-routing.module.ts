import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ErrorComponent } from './error/error.component';
// import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_helpers';
import { Role } from './_models/role';

const routes: Routes = [
  { path: 'error', component: ErrorComponent },
  {
    path: ':tenant',
    children: [
      { path: 'error', component: ErrorComponent },
      {
        path: 'security',
        loadChildren: () => import('./common/security.module').then(m => m.SecurityModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin.module').then(m => m.AdminModule),
        canActivate: [AuthGuard], data: { roles: [Role.Admin] }
      },
      { path: 'manager',
        loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule),
        canActivate: [AuthGuard], data: { roles: [Role.Manager] }
      },
      { path: 'coach',
        loadChildren: () => import('./coach/coach.module').then(m => m.CoachModule),
        canActivate: [AuthGuard], data: { roles: [Role.Coach] }
      },
      { path: 'employee',
        loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
        canActivate: [AuthGuard], data: { roles: [Role.Manager, Role.EMPLOYEE] }
      },
      { path: '', redirectTo: '/security/login', pathMatch: 'full' }
    ]
  }];

@NgModule({
      imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
      exports: [RouterModule]
    })
export class AppRoutingModule { }
