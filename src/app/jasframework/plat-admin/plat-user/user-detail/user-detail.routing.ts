import { Routes, RouterModule } from '@angular/router';

import { UserDetailComponent } from './user-detail.component';
import { RolePolicyComponent } from './role-policy/role-policy.component';
import { DetailInfoComponent } from './detail-info/detail-info.component';

const routes: Routes = [
    {
        path: '',
        component: UserDetailComponent,
        children: [
            {
                path: 'info',
                component: DetailInfoComponent,
            },
            {
                path: 'roleAssign',
                component: RolePolicyComponent
            },
            {
                path: '',
                redirectTo: 'info',
                pathMatch: 'full',
            }

        ]
    }

];

export const UserDetailRoutes = RouterModule.forChild(routes);
