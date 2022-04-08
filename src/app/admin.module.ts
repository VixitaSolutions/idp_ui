import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';
import { ManageClientsComponent } from './manage-clients/manage-clients.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ManageAdminsComponent } from './manage-admins/manage-admins.component';
import { AddClientComponent } from './add-client/add-client.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
    declarations: [
        HomeComponent,
        AdminHomeComponent,
        ManageClientsComponent,
        ManageAdminsComponent,
        AddClientComponent,
        AddAdminComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AdminRoutingModule,
        NgbModule,
        SharedModule
    ],
    entryComponents: [ ]
})
export class AdminModule { }
