import { BigDataRoutes } from './big-data.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BigDataComponent } from './big-data.component';

@NgModule({
  imports: [
    CommonModule,
    BigDataRoutes
  ],
  declarations: [BigDataComponent]
})
export default class BigDataModule { }