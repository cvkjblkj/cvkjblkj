import { ButtonModule, ConfirmDialogModule, DropdownModule, GrowlModule, TreeTableModule, ToolbarModule } from 'primeng/primeng';

import { AppViewComponent } from './app-view.component';
import { AppViewRoutes } from './app-view.routing';
import { AppViewService } from './shared/app.view.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
import { NgModule } from '@angular/core';
import { TreeModule } from 'angular-tree-component';
import { ViewManagerComponent } from './view-manager/view-manager.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppViewRoutes,

    TreeTableModule, GrowlModule,TreeModule,DropdownModule,ButtonModule,ConfirmDialogModule, ToolbarModule,
    ModalModule.forRoot(),

  ],
  declarations: [AppViewComponent, ViewManagerComponent],
  providers:[
    {
        provide:'view',useClass:AppViewService
      }
  ]
})
export default class AppViewModule { }
