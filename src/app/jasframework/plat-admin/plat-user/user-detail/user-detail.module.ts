import { PlatAdminService } from './../../shared/plat-admin.service';
import { CommonRequestService } from './../../../../core/common-service/common-request.service';
import { CommonRequestMethodService } from './../../../../core/common-service/request-method.service';
import { CommonService } from './../../../../core/common-service/common.service';
import { TreeModule } from 'angular-tree-component';
import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserDetailRoutes } from './user-detail.routing';
import { UserDetailComponent } from './user-detail.component';
import { RolePolicyComponent } from './role-policy/role-policy.component';
import { DetailInfoComponent } from './detail-info/detail-info.component';

import {
    CalendarModule,
    ConfirmDialogModule,
    ConfirmationService,
    DataTableModule,
    DropdownModule,
    DialogModule,
    MessagesModule,
    PaginatorModule,
    SharedModule,
    TabViewModule,
    ToolbarModule,
    TreeTableModule, TreeNode,
    GrowlModule
} from 'primeng/primeng';
import { ModalModule } from 'ng2-bootstrap';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        UserDetailRoutes,

        CalendarModule,
        ConfirmDialogModule,
        DataTableModule,
        DropdownModule,
        DialogModule,
        MessagesModule,
        PaginatorModule,
        SharedModule,
        TabViewModule,
        ToolbarModule,
        TreeTableModule,
        GrowlModule,

        TreeModule,

        ModalModule.forRoot()
    ],
    declarations: [
        UserDetailComponent,
        DetailInfoComponent,
        RolePolicyComponent
    ],
      providers:[CommonService,CommonRequestMethodService,CommonRequestService,ConfirmationService,PlatAdminService]
})
export default class UserDetailModule { }
// PlatAdminService, ConfirmationService, CommonService
