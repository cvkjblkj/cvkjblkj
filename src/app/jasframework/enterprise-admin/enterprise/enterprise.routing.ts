import { EnterpriseComponent } from './enterprise.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    {
        path: '', 
        component: EnterpriseComponent,
       
    },
];

export const EnterpriseRoutes = RouterModule.forChild(routes);
