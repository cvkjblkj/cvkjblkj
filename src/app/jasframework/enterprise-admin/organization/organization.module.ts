import { NgaModule } from './../../../theme/nga.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ng2-bootstrap/modal';
import { TreeTableModule, GrowlModule, ConfirmDialogModule, TreeModule, DialogModule, ToolbarModule,ConfirmationService } from 'primeng/primeng';
import { OrganizationAdminComponent } from './organization-admin/organization-admin.component';
import { OrganizationRoutes } from './organization.routing';
import { OrganizationComponent } from './organization.component';
import { NgModule } from '@angular/core';
import {CommonRequestMethodService} from './../../../core/common-service/request-method.service'

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    OrganizationRoutes,
    NgaModule,
    TreeTableModule,
    GrowlModule,
    ConfirmDialogModule,
    TreeModule,
    DialogModule,
    ToolbarModule,
    ModalModule.forRoot()
  ],
  declarations: [
    OrganizationComponent,
    OrganizationAdminComponent
  ],
  providers:[CommonRequestMethodService,ConfirmationService],
  bootstrap: [OrganizationComponent]
})
export default class OrganizationModule { }
