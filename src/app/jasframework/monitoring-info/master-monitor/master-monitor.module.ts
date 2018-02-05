import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ng2-bootstrap/modal';
import { ChartModule, GrowlModule, DropdownModule, ConfirmationService, DataTableModule, SharedModule, MultiSelectModule, CalendarModule, ChipsModule, ConfirmDialogModule } from 'primeng/primeng';
import { NgaModule } from './../../../theme/nga.module';
import { CommonService } from './../../../core/common-service/common.service';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { CommonRequestService } from './../../../core/common-service/common-request.service';

import { MasterMonitorComponent } from './master-monitor.component';
import { MasterRoutes } from './master-monitor.routing';
import { HandleMonitorComponent } from './handle-monitor/handle-monitor.component';
import { EcsEchartsComponent } from './ecs-echarts/ecs-echarts.component';
import { BaseMonitorComponent } from './base-monitor/base-monitor.component';
import { Ng2EchartsModule } from "./../../journal-info/ng2-echarts.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2EchartsModule,
    NgaModule,
    ChartModule, GrowlModule, DropdownModule, DataTableModule, SharedModule, MultiSelectModule, CalendarModule, ChipsModule, ConfirmDialogModule,
    ModalModule.forRoot(), MasterRoutes
  ],
  declarations: [
    MasterMonitorComponent, HandleMonitorComponent, BaseMonitorComponent,
    EcsEchartsComponent

  ],
  providers: [
    CommonService,
    ConfirmationService,
    CommonRequestMethodService,
    CommonRequestService,


  ]
})
export default class MasterMonitorModule { }
