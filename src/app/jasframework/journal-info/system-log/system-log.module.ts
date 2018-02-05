import { CommonRequestService } from './../../../core/common-service/common-request.service';
import { MicroServiceService } from './micro-service/shared/micro-service.service';
import { ModalModule } from 'ng2-bootstrap/modal';
import { SystemLogRoutes } from './system-log.routing';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartModule, GrowlModule, DropdownModule, ConfirmationService, DataTableModule, SharedModule, MultiSelectModule, CalendarModule, ChipsModule, ConfirmDialogModule } from 'primeng/primeng';
import { JournalInfoService } from './../shared/journal-info.service';
import { CommonService } from './../../../core/common-service/common.service';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';

import { SystemLogComponent } from './system-log.component';
import { MicroServiceComponent } from './micro-service/micro-service.component';
import { MasterServiceComponent } from './master-service/master-service.component';
import { DockerServiceComponent } from './docker-service/docker-service.component';
import { TomcatContainerComponent } from './tomcat-container/tomcat-container.component';
import { NginxContainerComponent } from './nginx-container/nginx-container.component';
import { NgaModule } from './../../../theme/nga.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SystemLogRoutes,
    NgaModule,
    ChartModule, GrowlModule, DropdownModule, DataTableModule, SharedModule, MultiSelectModule, CalendarModule, ChipsModule, ConfirmDialogModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    SystemLogComponent,
    MicroServiceComponent,
    MasterServiceComponent,
    DockerServiceComponent,
    TomcatContainerComponent,
    NginxContainerComponent
  ],
  providers: [
    CommonService,
    ConfirmationService,
    CommonRequestMethodService,
    CommonRequestService,
    JournalInfoService,
    MicroServiceService,
  ]
})
export default class SystemLogModule { }
