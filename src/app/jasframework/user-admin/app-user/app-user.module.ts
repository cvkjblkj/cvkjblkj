import { CommonRequestService } from './../../../core/common-service/common-request.service';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { CommonService } from './../../../core/common-service/common.service';
import { UserAdminService } from './shared/user-admin.service';
import { PlatAdminService } from './../../plat-admin/shared/plat-admin.service';
import { NgaModule } from './../../../theme/nga.module';
import { TreeModule } from 'angular-tree-component';
import { AppUserRoutes } from './app-user.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUserComponent } from './app-user.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { OrganizationComponent } from './organization/organization.component';
import { UserListComponent } from './user-list/user-list.component';
import {
  CalendarModule,
  ConfirmDialogModule,
  ConfirmationService,
  DataTableModule,
  DialogModule,
  DropdownModule,
  MessagesModule,
  PaginatorModule,
  PickListModule,
  SharedModule,
  TabViewModule,
  ToolbarModule,
  GrowlModule
} from 'primeng/primeng';

import { ModalModule } from 'ng2-bootstrap';
@NgModule({
  imports: [
    CommonModule,
    AppUserRoutes,
    ReactiveFormsModule, FormsModule,

    NgaModule,
    CalendarModule,
    ConfirmDialogModule,
    DataTableModule,
    DialogModule,
    DropdownModule,
    MessagesModule,
    PaginatorModule,
    PickListModule,
    SharedModule,
    TabViewModule,
    ToolbarModule,
    GrowlModule,

    ModalModule.forRoot(),
    TreeModule
  ],
  declarations: [AppUserComponent, OrganizationComponent, UserListComponent],
  providers: [PlatAdminService, ConfirmationService, UserAdminService, CommonService, CommonRequestMethodService, CommonRequestService]
})
export default class AppUserModule { }
