import { UserComponent } from './user.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { 
    path:'',
    component:UserComponent
   },
];

export const UserRoutes = RouterModule.forChild(routes);
