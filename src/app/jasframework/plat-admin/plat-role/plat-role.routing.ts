import { PlatRoleComponent } from './plat-role.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { 
    path:'',
    component:PlatRoleComponent
   },
];

export const PlatRoleRoutes = RouterModule.forChild(routes);
