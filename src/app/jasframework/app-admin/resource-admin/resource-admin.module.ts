
import { NgaModule } from './../../../theme/nga.module';
import { ModalModule } from 'ng2-bootstrap';
import { TabsModule } from 'ng2-bootstrap/tabs';

import { TreeTableModule, ToolbarModule, GrowlModule, ConfirmDialogModule, DataTableModule, TreeModule } from 'primeng/primeng';
import { AppFuncComponent } from './../app-func/app-func.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ResourceAdminComponent } from './resource-admin.component';
import { DataResourceComponent } from './data-resource/data-resource.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ResourceAdminComponent,
        // children: [
        //   {
        //     path: '',
        //     redirectTo: 'func',
        //   },
        //   {
        //     path: 'func',
        //     component: AppFuncComponent,
        //   },
        //   {
        //     path: 'data',
        //     component: DataResourceComponent,
        //   },

        // ]
      }
    ]),

    NgaModule,
    TreeTableModule,
    ToolbarModule,
    GrowlModule,
    ConfirmDialogModule,
    DataTableModule,

    TreeModule,

    TabsModule.forRoot(),
    ModalModule.forRoot(),

  ],
  declarations: [
    ResourceAdminComponent,
    DataResourceComponent,
    AppFuncComponent,
  ]
})
export default class ResourceAdminModule { }