import { DataSourceRoutes } from './data-source.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSourceComponent } from './data-source.component';

@NgModule({
  imports: [
    CommonModule,
    DataSourceRoutes
  ],
  declarations: [DataSourceComponent]
})
export default class DataSourceModule { }