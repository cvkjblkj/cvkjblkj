import { EnterpriseListShowViewComponent } from './enterprise-list/enterprise-list-show-view/enterprise-list-show-view.component';
import { EnterpriseListShowComponent } from './enterprise-list/enterprise-list-show/enterprise-list-show.component';
import { AppEnterpriseComponent } from './app-enterprise.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    {
        path: '', 
        component: AppEnterpriseComponent,
        children:[
            {
                path:'list',
                component:EnterpriseListShowComponent,

            },{
                path:'list-view',
                component:EnterpriseListShowViewComponent,
            }
        ]
       
    },
];

export const AppEnterpriseRoutes = RouterModule.forChild(routes);
