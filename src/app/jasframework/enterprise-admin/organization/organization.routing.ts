import { OrganizationAdminComponent } from './organization-admin/organization-admin.component';
import { OrganizationComponent } from './organization.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    {
        path: '', 
        component: OrganizationComponent,
        children:[
            {
                path:'list',
                component:OrganizationAdminComponent
            }
        ]
       
    },
];

export const OrganizationRoutes = RouterModule.forChild(routes);
