import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
import { TreeTableModule, TreeModule, GrowlModule,ConfirmDialogModule,ToolbarModule,ConfirmationService} from 'primeng/primeng';
import { AppFuncRoutes } from './app-func.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFuncComponent } from './app-func.component';
import {NgaModule} from '../../../theme/nga.module';
import {CommonRequestMethodService} from './../../../core/common-service/request-method.service';
@NgModule({
  imports: [
    CommonModule,
    AppFuncRoutes,
    FormsModule,
    NgaModule,
    TreeTableModule,TreeModule,GrowlModule,ConfirmDialogModule,
    ToolbarModule,
    ModalModule.forRoot()
  ],
  providers:[CommonRequestMethodService,ConfirmationService],
  declarations: [AppFuncComponent]
})
export default class AppFuncModule { }
