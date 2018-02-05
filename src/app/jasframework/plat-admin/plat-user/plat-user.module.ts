import { NgaModule } from './../../../theme/nga.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { UserListComponent } from './user-list/user-list.component';
import { PlatUserRoutes } from './plat-user.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatUserComponent } from './plat-user.component';

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
import { TreeModule } from 'angular-tree-component';


@NgModule({
  imports: [
    CommonModule,
    PlatUserRoutes,
    ReactiveFormsModule,
    FormsModule,

    NgaModule,

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
  declarations: [PlatUserComponent,UserListComponent]
})
export default class PlatUserModule { }
