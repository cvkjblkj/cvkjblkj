import { CommonRequestService } from './../../../core/common-service/common-request.service';
import { CommonService } from './../../../core/common-service/common.service';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { PlatAdminService } from './../../plat-admin/shared/plat-admin.service';
import { AppAdminService } from './../shared/app-admin.service';
import { TreeModule } from 'angular-tree-component';
import { FormsModule } from '@angular/forms';
import { AppRoleRoutes } from './app-role.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoleComponent } from './app-role.component';
import { RoleListComponent } from './role-list/role-list.component';

import { TreeTableModule, TreeNode, SharedModule, ToolbarModule, GrowlModule, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { ModalModule } from 'ng2-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppRoleRoutes,

    TreeTableModule,
    ToolbarModule,
    GrowlModule,
    ConfirmDialogModule,

    TreeModule,

    TabsModule.forRoot(),
    ModalModule.forRoot(),

  ],
  declarations: [
    AppRoleComponent,
    RoleListComponent,
  ],
  providers: [
  ]
})
export default class AppRoleModule { }
