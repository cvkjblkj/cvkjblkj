import { Ng2EchartsModule } from './../../journal-info/ng2-echarts.module';
import { JournalInfoService } from './../../journal-info/shared/journal-info.service';
import { CommonModule } from '@angular/common';
// import { TimeSwitchComponent } from './../timeSwitch/timeSwitch.component';
// import { FilterConditionComponent } from './../filter-condition/filter-condition.component';
import { DirectiveModule } from './../shared/directive.module';
import { DetailListComponent } from './detail-list/detail-list.component';
import { StatisticAnalysisService } from './../shared/statistic-analysis.service';
import { CommonService } from './../../../core/common-service/common.service';
import { CommonRequestService } from './../../../core/common-service/common-request.service';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { IndicatorStatisticRoutes } from './indicator-statistic.routing';
import { NgaModule } from './../../../theme/nga.module';
import { FormsModule } from '@angular/forms';
import { IndicatorStatisticComponent } from './indicator-statistic.component';
import { NgModule } from '@angular/core';
import { ConfirmationService, CalendarModule, DropdownModule, DataTableModule, MultiSelectModule, ChipsModule } from 'primeng/primeng';
import { IndicatorComponent } from './indicator/indicator.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        NgaModule,
        IndicatorStatisticRoutes,
        NgaModule,
        CalendarModule,
        DropdownModule,
        DataTableModule,
        MultiSelectModule,
        ChipsModule,
        DirectiveModule,

        Ng2EchartsModule

    ],
    declarations: [IndicatorComponent, IndicatorStatisticComponent, DetailListComponent],
    providers: [CommonRequestMethodService, CommonRequestService, CommonService, ConfirmationService, StatisticAnalysisService,JournalInfoService]
})
export default class IndicatorModule { }
