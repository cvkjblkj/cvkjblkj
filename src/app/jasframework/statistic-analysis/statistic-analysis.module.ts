import { FormsModule } from '@angular/forms';
// import { TimeSwitchComponent } from './timeSwitch/timeSwitch.component';
// import { FilterConditionComponent } from './filter-condition/filter-condition.component';
import { StatisticAnalysisService } from './shared/statistic-analysis.service';
import { NgaModule } from './../../theme/nga.module';
import { ConfirmationService, CalendarModule, DropdownModule, DataTableModule, MultiSelectModule, ChipsModule } from 'primeng/primeng';
import { CommonService } from './../../core/common-service/common.service';
import { CommonRequestService } from './../../core/common-service/common-request.service';
import { CommonRequestMethodService } from './../../core/common-service/request-method.service';
import { StatisticAnalysisRoutes } from './statistic-analysis.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticAnalysisComponent } from './statistic-analysis.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    StatisticAnalysisRoutes,
    NgaModule,
    CalendarModule,
    DropdownModule,
    DataTableModule,
    MultiSelectModule,
    ChipsModule,

  ],
  declarations: [StatisticAnalysisComponent, 

  ],
  providers: [CommonRequestMethodService, CommonRequestService, CommonService, ConfirmationService, StatisticAnalysisService]
})
export default class StatisticAnalysisModule { }