import { DirectiveModule } from './../shared/directive.module';
import { DropdownModule, DataTableModule, CalendarModule } from 'primeng/primeng';
import { EventAnalysisComponent } from './event-analysis.component';
import { EventAnalysisRoutes } from './event-analysis.routing';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event/event.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { EventUserListComponent } from './event-user-list/event-user-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EventAnalysisRoutes,
    DirectiveModule,
    DropdownModule,DataTableModule,CalendarModule
  ],
  declarations: [
    EventAnalysisComponent,
    EventComponent,
    UserInfoComponent,
    EventUserListComponent,
   
]
})
export default class EventAnalysisModule { }