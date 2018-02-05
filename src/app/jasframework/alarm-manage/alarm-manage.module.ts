
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ng2-bootstrap/modal';
import { NgaModule } from './../../theme/nga.module';
import { DataTableModule, CalendarModule, DropdownModule, GrowlModule, ConfirmationService, ChipsModule, SpinnerModule, PickListModule, MultiSelectModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Ng2EchartsModule } from './../journal-info/ng2-echarts.module';
import { CommonService } from './../../core/common-service/common.service';
import { CommonRequestMethodService } from './../../core/common-service/request-method.service';
import { CommonRequestService } from './../../core/common-service/common-request.service';
import { AlarmManageComponent } from './alarm-manage.component';
import { AlarmRoutes } from './alarm-manage.routing';
import { CreateRuleComponent } from './create-rule/create-rule.component';
import { AppList } from './child.component';
import { AlarmService } from './shared/alarmService';
import {EditRuleComponent} from './edit-rule/edit-rule.component'
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ChipsModule,
    DropdownModule,
    DataTableModule,
    CalendarModule,
    AutoCompleteModule,
    NgaModule,
    SpinnerModule,
    PickListModule,
    ModalModule.forRoot(),
    GrowlModule,
    Ng2EchartsModule,
    AlarmRoutes,
    MultiSelectModule

  ],
  declarations: [AlarmManageComponent, CreateRuleComponent,EditRuleComponent],

  bootstrap: [AlarmManageComponent],
  providers: [CommonService, ConfirmationService, CommonRequestMethodService, CommonRequestService, AlarmService]
})
export default class AlarmManageModule { }
