import { UserAdminComponent } from './user-admin.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { 
    path:'',
    component:UserAdminComponent,
    children:[
      {
        path:'app-user',
        loadChildren:()=>System.import('./app-user/app-user.module.ts'),
      },
      {
        path:'enterprise-user',
        loadChildren:()=>System.import('./enterprise-user/enterprise-user.module.ts'),
      },
      {
        path:'user',
        loadChildren:()=>System.import('./user/user.module.ts'),
      }
    ]
   },
];

export const UserAdminRoutes = RouterModule.forChild(routes);
