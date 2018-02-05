import { JournalInfoService } from './../../journal-info/shared/journal-info.service';
import { Ng2EchartsModule } from './../../journal-info/ng2-echarts.module';
import { IOTDataShowService } from './shared/IOT-data-show.service';
import { TreeModule } from 'angular-tree-component';
import { CommonRequestService } from './../../../core/common-service/common-request.service';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { CommonService } from './../../../core/common-service/common.service';
import { AddEchartsComponent } from './real-time-data/add-echarts/add-echarts.component';
import { AddDeviceComponent } from './real-time-data/add-device/add-device.component';
import { DropdownModule, ConfirmationService, DataTableModule, CalendarModule, MultiSelectModule } from 'primeng/primeng';
import { NgaModule } from './../../../theme/nga.module';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ng2-bootstrap';
import { IOTDataShowRoutes } from './IOT-data-show.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IOTDataShowComponent } from './IOT-data-show.component';
import { RealTimeDataComponent } from './real-time-data/real-time-data.component';
import { HistoryDataComponent } from './history-data/history-data.component';

@NgModule({
  imports: [
    CommonModule,
    IOTDataShowRoutes,
    FormsModule,
    NgaModule,

    // ModalModule.forRoot(),
    // DropdownModule,
    DataTableModule,
    CalendarModule,
    // MultiSelectModule,
    TreeModule,
    Ng2EchartsModule

  ],
  declarations: [
    IOTDataShowComponent,
    RealTimeDataComponent, // 实时数据组件
    HistoryDataComponent, // 历史数据组件
    // AddDeviceComponent, //新增设备的组件
    // AddEchartsComponent, //新增图表的组件
  ],
  providers: [CommonService, CommonRequestMethodService, CommonRequestService, ConfirmationService, IOTDataShowService,JournalInfoService]

})
export default class IOTDataShowModule { }