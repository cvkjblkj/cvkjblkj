import { LoadChildren } from '@angular/router/src/config';
import { PlatformRoleComponent } from './../admin-center/platform-admin/access-control/platform-role/platform-role.component';
import { JasComponent } from './jas.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: JasComponent,
    children: [

      { path: 'enterprise-admin', loadChildren: () => System.import('./../enterprise-admin/enterprise-admin.module.ts') },
      { path: 'user-admin', loadChildren: () => System.import('./../user-admin/user-admin.module.ts') },
      { path: 'plat-admin', loadChildren: () => System.import('./../plat-admin/plat-admin.module.ts') },
      { path: 'app-admin', loadChildren: () => System.import('./../app-admin/app-admin.module.ts') },
      { path: 'journal-info', loadChildren: () => System.import('./../journal-info/journal-info.module.ts') },
      { path: 'monitoring-info', loadChildren: () => System.import('./../monitoring-info/monitoring-info.component.module') },

      { path: 'statistic-analysis', loadChildren: () => System.import('./../statistic-analysis/statistic-analysis.module') },
      // { path:'platformUser',loadChildren:()=>System.import('./../admin-center/platform-admin/access-control/platform-user/platform-user.module.ts')},

      // { path:'platformRole',component:PlatformRoleComponent},
      { path: '', redirectTo: 'plat-admin', pathMatch: 'full' },


    ]
  },
];

export const JasRoutes = RouterModule.forChild(routes);
