// import { Ng2EchartsModule } from './../journal-info/ng2-echarts.module';
import { IOTAdminRoutes } from './IOT-admin.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IOTAdminComponent } from './IOT-admin.component';

@NgModule({
  imports: [
    CommonModule,
    IOTAdminRoutes,
    // Ng2EchartsModule

  ],
  declarations: [IOTAdminComponent]
})
export default class IOTAdminModule { }