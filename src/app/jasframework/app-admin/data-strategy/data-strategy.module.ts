import { CommonRequestService } from './../../../core/common-service/common-request.service';
import { AppAdminService } from './../shared/app-admin.service';
// import { TreeModule } from 'angular-tree-component';
import { DataStrategyService } from './shared/data-strategy.service';
import { CommonService } from './../../../core/common-service/common.service';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { ModalModule } from 'ng2-bootstrap';
import { DataTableModule, DialogModule, ConfirmDialogModule, GrowlModule, ConfirmationService, TreeModule } from 'primeng/primeng';
import { NgaModule } from './../../../theme/nga.module';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStrategyComponent } from './data-strategy.component';
import { DataRuleComponent } from './data-rule/data-rule.component';
import { RuleStrategyComponent } from './rule-strategy/rule-strategy.component';
import { DragPriorityStrategyComponent } from './drag-priority-strategy/drag-priority-strategy.component';
// import { NgZorroAntdModule } from 'ng-zorro-antd';
// import { TooltipModule } from "ng2-bootstrap";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: DataStrategyComponent,
      }
    ]),
    NgaModule,
    DataTableModule,
    ConfirmDialogModule,
    GrowlModule,
    ModalModule.forRoot(),
    DialogModule,
    TreeModule,
    // TooltipModule.forRoot(),
    // NG ZORRO  UI组件
    // NgZorroAntdModule

  ],
  declarations: [
    DataStrategyComponent,
    DataRuleComponent,
    RuleStrategyComponent,
    DragPriorityStrategyComponent
  ],
  providers: [CommonRequestMethodService, CommonService, DataStrategyService, ConfirmationService, AppAdminService, CommonRequestService]
})
export default class DataStrategyModule { }