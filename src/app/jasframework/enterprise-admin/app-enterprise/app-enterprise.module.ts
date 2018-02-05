import { ShareModule } from './../shared/shared.module';
// import { EnterpriseScalePipe } from './../shared/enterprise-list.pipe';
import { AppEnterpriseService } from './shared/app-enterprise.service';
import { AuthStatusPipe } from './enterprise-list/enterprise-list-show/enterprise-auth-list.pipe';

import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
import { NgaModule } from './../../../theme/nga.module';
import { GrowlModule, DataTableModule, ConfirmDialogModule, DialogModule, ConfirmationService } from 'primeng/primeng';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppEnterpriseComponent } from './app-enterprise.component';
import { AppEnterpriseRoutes } from './app-enterprise.routing';


import { EnterpriseListShowViewComponent } from './enterprise-list/enterprise-list-show-view/enterprise-list-show-view.component';
import { EnterpriseListShowComponent } from './enterprise-list/enterprise-list-show/enterprise-list-show.component';
import { AppEnterpriseApplicationService } from './shared/app-enterprise-application.service';
import {CommonRequestMethodService} from "../../../core/common-service/request-method.service";
import {CommonService} from "../../../core/common-service/common.service";
@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        AppEnterpriseRoutes,
        NgaModule,
        GrowlModule,
        DataTableModule,
        ConfirmDialogModule,
        DialogModule,
        // EnterpriseScalePipe,
        ModalModule.forRoot(),

        ShareModule,
    ],
    declarations: [
        AppEnterpriseComponent,

        EnterpriseListShowComponent,
        EnterpriseListShowViewComponent,

        AuthStatusPipe,
        // EnterpriseScalePipe
    ],
    providers:[
        AppEnterpriseService,
        ConfirmationService,
        AppEnterpriseApplicationService,
        CommonRequestMethodService,
        CommonService
    ]


})
// export  class AppEnterpriseModule{}
export default class AppEnterpriseModule {}
