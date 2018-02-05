// import { TimeSwitchComponent } from './statistic-analysis/timeSwitch/timeSwitch.component';
// import { FilterConditionComponent } from './statistic-analysis/filter-condition/filter-condition.component';
// import { StatisticAnalysisService } from './statistic-analysis/shared/statistic-analysis.service';
import { CommonRequestService } from './../../core/common-service/common-request.service';
import { CommonService } from './../../core/common-service/common.service';
import { CommonRequestMethodService } from './../../core/common-service/request-method.service';
import { NgaModule } from './../../theme/nga.module';
import { FormsModule } from '@angular/forms';
import { DropdownModule, DataTableModule, ConfirmationService, MultiSelectModule, ChipsModule, CalendarModule } from 'primeng/primeng';
// import { DetailListComponent } from './statistic-analysis/detail-list/detail-list.component';
// import { StatisticAnalysisComponent } from './statistic-analysis/statistic-analysis.component';

import { EnterpriseScalePipe } from './shared/enterprise-list.pipe';
import { EnterpriseAdminRoutes } from './enterprise-admin.routing';
import { EnterpriseAdminComponent } from './enterprise-admin.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [CommonModule, EnterpriseAdminRoutes, DropdownModule, FormsModule, DataTableModule, NgaModule, MultiSelectModule, ChipsModule, CalendarModule],
    declarations: [EnterpriseAdminComponent],
    bootstrap: [EnterpriseAdminComponent],
    providers: [ConfirmationService, CommonRequestMethodService, CommonService, CommonRequestService]
})
export default class EnterpriseAdminModule { }
