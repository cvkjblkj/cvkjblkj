import { EnterpriseAdminComponent } from './enterprise-admin.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    {
        path: '',
        component: EnterpriseAdminComponent,
        children: [
            {
                path: 'organization',
                loadChildren: () => System.import('./organization/organization.module.ts'),
            },
            {
                path: 'enterprise',
                loadChildren: () => System.import('./enterprise/enterprise.module.ts'),
            }, {
                path: 'app-enterprise',
                loadChildren: () => System.import('./app-enterprise/app-enterprise.module.ts'),
            }, {
                path: 'enterprise-auth',
                loadChildren: () => System.import('./enterprise-auth/enterprise-auth.module.ts'),
            },
        ]
    },
];

export const EnterpriseAdminRoutes = RouterModule.forChild(routes);
