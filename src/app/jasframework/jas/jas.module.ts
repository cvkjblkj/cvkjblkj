import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from './../../theme/nga.module';
import { ModalModule } from 'ng2-bootstrap';
import { JasRoutes } from './jas.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JasComponent } from './jas.component';

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
  TreeTableModule, TreeNode, TreeModule
} from 'primeng/primeng';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    JasRoutes,

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
    TreeTableModule, TreeModule
  ],
  declarations: [JasComponent]
})
export default class JasModule { }
