import { UserAdminRoutes } from './user-admin.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAdminComponent } from './user-admin.component';

@NgModule({
  imports: [
    CommonModule,
    UserAdminRoutes
  ],
  declarations: [UserAdminComponent]
})
export default class UserAdminModule { }