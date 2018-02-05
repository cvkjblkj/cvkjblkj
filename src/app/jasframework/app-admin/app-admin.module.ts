import { NgaModule } from './../../theme/nga.module';
import { DataTableModule, ConfirmDialogModule, GrowlModule } from 'primeng/primeng';
import { ModalModule } from 'ng2-bootstrap/modal';
import { AppAdminRoutes } from './app-admin.routing';
import { CommonModule } from '@angular/common';
import { AppAdminComponent } from './app-admin.component';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";


@NgModule({
  imports: [CommonModule, AppAdminRoutes, FormsModule, ModalModule.forRoot(), DataTableModule, ConfirmDialogModule, GrowlModule, NgaModule],
  declarations: [AppAdminComponent

  ],
  bootstrap: [AppAdminComponent]
})
export default class AppAdminModule {
}
