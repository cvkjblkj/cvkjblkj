import { DataPrivilegeDemoComponent } from './../jasframework/advanced-research/data-privilege-demo/data-privilege-demo.component';
import { NgaModule } from './../theme/nga.module';
import { BaMsgCenter } from './../theme/components/baMsgCenter/baMsgCenter.component';
import { BaBackTop } from './baBackTop/baBackTop.component';
import { BaPageTop } from './baPageTop/baPageTop.component';
import { BaSidebar } from './baSidebar/baSidebar.component';
import { MenuItemComponent } from './menuItem/menuItem.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './home.routing';
import { ModalModule } from 'ng2-bootstrap/modal';

import { TreeTableModule, TreeNode, SharedModule, DialogModule, ConfirmDialogModule, ConfirmationService, DataTableModule, CalendarModule, SpinnerModule, ButtonModule, AccordionModule, GrowlModule } from 'primeng/primeng';
import { HomeComponent } from './home.component';
import { AuthGuard } from '../core/shared/auth-guard.service';
import { DropdownModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [CommonModule, routing,
    TreeTableModule, SharedModule, DialogModule, ConfirmDialogModule, DataTableModule, DropdownModule, AccordionModule,
    FormsModule, CalendarModule, SpinnerModule, ButtonModule, NgaModule, GrowlModule],
  declarations: [HomeComponent, BaPageTop, BaSidebar, MenuItemComponent, BaBackTop, DataPrivilegeDemoComponent],
  providers: [AuthGuard]
})
export class HomeModule {
}
