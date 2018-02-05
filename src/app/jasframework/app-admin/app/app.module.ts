import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ng2-bootstrap/modal';
import { TreeTableModule, TreeModule, GrowlModule, DataTableModule, ConfirmDialogModule, ToolbarModule, ConfirmationService } from 'primeng/primeng';
import { CommonModule } from '@angular/common';
import { AppRoutes } from './app.routing';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgaModule } from './../../../theme/nga.module'
import { AppInfoComponent } from './app-info/app-info.component';
import { AppListComponent } from './app-list/app-list.component';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppRoutes,
    NgaModule,
    TreeTableModule,
    TreeModule,
    GrowlModule,
    DataTableModule,
    ConfirmDialogModule,
    ToolbarModule,
    ModalModule.forRoot()

  ],
  declarations: [
    AppComponent,
    AppInfoComponent,
    AppListComponent
  ],
  providers: [ConfirmationService, CommonRequestMethodService]
})
export default class AppModule { }
