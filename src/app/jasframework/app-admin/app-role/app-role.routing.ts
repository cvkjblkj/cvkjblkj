import { RoleListComponent } from './role-list/role-list.component';
import { AppRoleComponent } from './app-role.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { 
    path:'',
    component:AppRoleComponent,
    children:[
      {
        path:'list',
        component:RoleListComponent
      }
    ]
   },
];

export const AppRoleRoutes = RouterModule.forChild(routes);
