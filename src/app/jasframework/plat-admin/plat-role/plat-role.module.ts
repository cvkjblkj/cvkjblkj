import { TreeModule } from 'angular-tree-component';
import { PlatRoleRoutes } from './plat-role.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PlatRoleComponent } from './plat-role.component';

import { NgaModule } from './../../../theme/nga.module';
import { ModalModule } from 'ng2-bootstrap';
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

@NgModule({
  imports: [
    CommonModule,
    PlatRoleRoutes,
    FormsModule,
    ReactiveFormsModule,

    NgaModule,
    ModalModule.forRoot(),

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
    GrowlModule,
    TreeTableModule,

    TreeModule,


  ],
  declarations: [PlatRoleComponent]
})
export default class PlatRoleModule { }
