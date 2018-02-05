import { EnterpriseRoutes } from './enterprise.routing';
import { EnterpriseComponent } from './enterprise.component';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
    imports:      [ BrowserModule,EnterpriseRoutes ],
    declarations: [ EnterpriseComponent ],
    bootstrap:    [ EnterpriseComponent ]
})
export default class EnterpriseModule {  }