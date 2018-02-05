import { FORMERR } from 'dns';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ng2-bootstrap/modal';
import { NgaModule } from './../../theme/nga.module';
import { DataTableModule, CalendarModule, DropdownModule, GrowlModule, ConfirmationService } from 'primeng/primeng';
import { DruidMonitor } from './druid-monitor/druid-monitor.component';
import { RedisMonitorComponent } from './redis-monitor/redis-monitor.component'
import { monitoringRoutes } from './monitoring-info.component.routing';
import { CommonModule } from '@angular/common';
import { MonitoringComponent } from './monitoring-info.component';
import { NgModule } from '@angular/core';
import { Ng2EchartsModule } from './../journal-info/ng2-echarts.module';
import { BaiduMapModule } from 'angular2-baidu-map';
import { DockerMonitorComponent } from './docker-monitor/docker-monitor.component';
import { RdsMonitorComponent } from './rds-monitor/rds-monitor.component';
import { CommonService } from './../../core/common-service/common.service';
import { CommonRequestMethodService } from './../../core/common-service/request-method.service';
import { CommonRequestService } from './../../core/common-service/common-request.service';

import{BalanceMonitorComponent} from './balance-monitor/balance-monitor.component';
import { MonitorService} from'./shared/monitor.service'
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    monitoringRoutes,
    DropdownModule,
    DataTableModule,
    CalendarModule,
    NgaModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    GrowlModule,
    Ng2EchartsModule,
    BaiduMapModule,
  ],
  declarations: [MonitoringComponent, DruidMonitor, RedisMonitorComponent, BalanceMonitorComponent, DockerMonitorComponent, RdsMonitorComponent],
  bootstrap: [MonitoringComponent],
  providers: [CommonService, ConfirmationService, CommonRequestMethodService, CommonRequestService,MonitorService]
})
export default class MonitoringModule { }
