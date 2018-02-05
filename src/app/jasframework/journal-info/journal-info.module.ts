import { LoginJournalComponent } from './login-journal/login-journal.component';
import { BusinessLogComponent } from './business-log/business-log.component';
import { NgaModule } from './../../theme/nga.module';
import { ModalModule } from 'ng2-bootstrap';
import { BusinessLogServer } from './business-log/shared/business-log.service';
import { LoginJournalService } from './login-journal/shared/login-journal.service';
import { JournalInfoService } from './shared/journal-info.service';
import { CommonService } from './../../core/common-service/common.service';
import { CommonRequestMethodService } from './../../core/common-service/request-method.service';
import { CommonRequestService } from './../../core/common-service/common-request.service';
import { FormsModule } from '@angular/forms';
import { JournalInfoRoutes } from './journal-info.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalInfoComponent } from './journal-info.component';
import {Ng2EchartsModule} from './ng2-echarts.module';
import { ChartModule, GrowlModule, DropdownModule, DataTableModule, SharedModule, MultiSelectModule, ConfirmationService, ChipsModule, CalendarModule, ConfirmDialogModule } from 'primeng/primeng';
@NgModule({
  imports: [
    CommonModule,
    JournalInfoRoutes,
    FormsModule,

    ChartModule, GrowlModule, DropdownModule, DataTableModule, SharedModule, MultiSelectModule, ChipsModule, CalendarModule,ConfirmDialogModule,
    ModalModule.forRoot(),

    NgaModule,
    Ng2EchartsModule
  ],
  declarations: [JournalInfoComponent, BusinessLogComponent, LoginJournalComponent
  ],
  providers: [CommonRequestService, CommonRequestMethodService, CommonService, JournalInfoService, LoginJournalService, BusinessLogServer, ConfirmationService]
})
export default class JournalInfoModule { }
