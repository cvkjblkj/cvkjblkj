import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeSwitchComponent } from './../timeSwitch/timeSwitch.component';
import { FilterConditionComponent } from './../filter-condition/filter-condition.component';
import { NgModule } from '@angular/core';

import { ConfirmationService, CalendarModule, DropdownModule, DataTableModule, MultiSelectModule, ChipsModule } from 'primeng/primeng';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        CalendarModule,
        DropdownModule,
        DataTableModule,
        MultiSelectModule,
        ChipsModule],
    exports: [FilterConditionComponent, TimeSwitchComponent],
    declarations: [FilterConditionComponent, TimeSwitchComponent],

})
export class DirectiveModule { }
