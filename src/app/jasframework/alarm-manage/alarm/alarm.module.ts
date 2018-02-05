import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ng2-bootstrap/modal';
import { NgaModule } from './../../../theme/nga.module';
import { DataTableModule, CalendarModule, DropdownModule, GrowlModule, ConfirmationService, MultiSelectModule, ChipsModule, ConfirmDialogModule, SpinnerModule, PickListModule } from 'primeng/primeng';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Ng2EchartsModule } from './../../journal-info/ng2-echarts.module';
import { CommonService } from './../../../core/common-service/common.service';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { CommonRequestService } from './../../../core/common-service/common-request.service'
import { AlarRoutes } from './alarm.routing';
import { AlarmRuleComponent } from './../alarm-rule/alarm-rule.component';
import { AlarmHistoryComponent } from './../alarm-history/alarm-history.component';
import { AlarmComponent } from './alarm.component';
import { MonitorService } from './../../monitoring-info/shared/monitor.service';
import { FilterConditionComponent } from './../filter-condition/filter-condition.component';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DropdownModule,
    DataTableModule,
    CalendarModule,
    NgaModule,
    ModalModule.forRoot(),
    GrowlModule,
    Ng2EchartsModule,
    AlarRoutes,
    CalendarModule, ChipsModule, ConfirmDialogModule, MultiSelectModule, SpinnerModule, PickListModule

  ],
  declarations: [AlarmComponent, AlarmRuleComponent, AlarmHistoryComponent, FilterConditionComponent],
  bootstrap: [AlarmComponent],
  providers: [CommonService, ConfirmationService, CommonRequestMethodService, CommonRequestService, MonitorService]
})
export default class AlarmModule { }
