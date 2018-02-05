import { PlatAdminComponent } from './plat-admin.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    component:PlatAdminComponent,
    children:[
      {
        path:'plat-user',
        loadChildren:()=>System.import('./plat-user/plat-user.module.ts'),
      },
      {
        path:'plat-role',
        loadChildren:()=>System.import('./plat-role/plat-role.module.ts'),
      },
      {
        path:'',
        redirectTo:'plat-role',
        pathMatch:'full'
      }
    ]
  },
];

export const PlatAdminRoutes = RouterModule.forChild(routes);
