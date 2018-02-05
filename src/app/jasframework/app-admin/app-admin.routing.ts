import { DataPrivilegeDemoComponent } from './../advanced-research/data-privilege-demo/data-privilege-demo.component';
import { ResourceAdminComponent } from './resource-admin/resource-admin.component';
import { AppAdminComponent } from './app-admin.component';
import { Routes, RouterModule } from '@angular/router';



// 引入每个模块的路由

const routes: Routes = [
    {
        path: '',
        component: AppAdminComponent,
        children: [
            {
                path: 'app',
                loadChildren: () => System.import('./app/app.module.ts'),
            },
            // path:'app-func/:id',
            // {
            //     path: 'app-func',
            //     loadChildren: () => System.import('./app-func/app-func.module.ts'),
            // },
            {
                path: 'app-role',
                loadChildren: () => System.import('./app-role/app-role.module.ts'),
            },
            {
                path: 'app-view',
                loadChildren: () => System.import('./app-view/app-view.module.ts'),
            },
            {
                path: 'resource-admin',
                loadChildren: () => System.import('./resource-admin/resource-admin.module.ts'),
                // component: ResourceAdminComponent
            },
            {
                path: 'data-strategy',
                loadChildren: () => System.import('./data-strategy/data-strategy.module.ts'),
                // component: ResourceAdminComponent
            }
        ]
    },
];
export const AppAdminRoutes = RouterModule.forChild(routes)
