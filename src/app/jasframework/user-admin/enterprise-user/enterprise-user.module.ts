import { EnterpriseUserRoutes } from './enterprise-user.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnterpriseUserComponent } from './enterprise-user.component';

@NgModule({
  imports: [
    CommonModule,
    EnterpriseUserRoutes
  ],
  declarations: [EnterpriseUserComponent]
})
export default class EnterpriseUserModule { }