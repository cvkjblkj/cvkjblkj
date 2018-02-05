import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ng2-bootstrap/modal';
import { ChartModule, GrowlModule, DropdownModule, ConfirmationService, DataTableModule, SharedModule, MultiSelectModule, CalendarModule, ChipsModule, ConfirmDialogModule } from 'primeng/primeng';
import { NgaModule } from './../../../theme/nga.module';
import { CommonService } from './../../../core/common-service/common.service';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { CommonRequestService } from './../../../core/common-service/common-request.service';

import { OssMonitorComponent } from './oss-monitor.component';
import{HierarchyMonitorComponent} from './hierarchy-monitor/hierarchy-monitor.component';
import {BuketchyMonitorComponent} from './buketchy-monitor/buketchy-monitor.component'
import {OssRoutes} from './oss-monitor.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    NgaModule,
    ChartModule, GrowlModule, DropdownModule, DataTableModule, SharedModule, MultiSelectModule, CalendarModule, ChipsModule, ConfirmDialogModule,
    ModalModule.forRoot(),OssRoutes
  ], declarations: [
    OssMonitorComponent,HierarchyMonitorComponent,BuketchyMonitorComponent
  ],
  providers: [
    CommonService,
    ConfirmationService,
    CommonRequestMethodService,
    CommonRequestService,


  ]
})
export default class MasterMonitorModule { }
