import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { servicetorComponent } from './service-monitoring.component';
import { FormsModule } from '@angular/forms';
import { DurationDirective } from './duration.directive';
import { LayoutDirective } from './layout.directive';
import { NgaModule } from './../../../theme/nga.module';
import { ServiceRoutes } from './service-monitoring.routing';
import { ModalModule } from 'ng2-bootstrap/modal';
import { DropdownModule } from 'primeng/primeng';
import { CommonService } from './../../../core/common-service/common.service';

import {
  TreeTableModule, TreeNode, GrowlModule, SharedModule, DialogModule,
  DataTableModule, CalendarModule, SpinnerModule, ButtonModule, ConfirmationService
} from 'primeng/primeng';
@NgModule({
  imports: [

    CommonModule,
    ServiceRoutes,
    ModalModule.forRoot(),
    NgaModule,
    TreeTableModule, SharedModule, DialogModule, DataTableModule, DropdownModule,
    FormsModule, CalendarModule, SpinnerModule, ButtonModule, GrowlModule,

  ],
  declarations: [servicetorComponent, LayoutDirective, DurationDirective],
  providers: [ConfirmationService, CommonService, CommonRequestMethodService]
})
export default class ServiceMonitoringModule { }
