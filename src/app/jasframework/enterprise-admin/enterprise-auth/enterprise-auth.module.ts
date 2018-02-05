import { CommonRequestService } from './../../../core/common-service/common-request.service';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { ShareModule } from './../shared/shared.module';
// import { EnterpriseScalePipe } from './../shared/enterprise-list.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { NgaModule } from './../../../theme/nga.module';

import { EnterpriseAuthRoutes } from './enterprise-auth.routing';

import { EnterpriseAuthComponent } from './enterprise-auth.component';
import { EnterpriseAuthListComponent } from './enterprise-auth-list/enterprise-auth-list.component';
import { EnterpriseAuthApproveComponent } from './enterprise-auth-approve/enterprise-auth-approve.component';
import { EnterpriseAuthedApproveComponent } from './enterprise-authed-approve/enterprise-authed-approve.component';

import { EnterpriseAdminService } from './shared/enterprise-admin.service';

import { ModalModule } from 'ng2-bootstrap/modal';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { DataTableModule, GrowlModule, ToolbarModule, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EnterpriseAuthRoutes,

    NgaModule,
    DataTableModule,
    GrowlModule,
    ToolbarModule,
    ConfirmDialogModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),

    ShareModule,

  ],
  declarations: [
    EnterpriseAuthComponent,
    EnterpriseAuthListComponent,
    EnterpriseAuthApproveComponent,
    EnterpriseAuthedApproveComponent,

    // EnterpriseScalePipe

  ],
  bootstrap: [EnterpriseAuthComponent],
  providers: [EnterpriseAdminService, ConfirmationService, CommonRequestMethodService, CommonRequestService]
})
export default class EnterpriseAuthModule { }

// export class EnterpriseAuthModule { }
