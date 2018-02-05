import { PlatAdminRoutes } from './plat-admin.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatAdminComponent } from './plat-admin.component';

@NgModule({
  imports: [
    CommonModule,
    PlatAdminRoutes,
  ],
  declarations: [PlatAdminComponent]
})
export default class PlatAdminModule { }