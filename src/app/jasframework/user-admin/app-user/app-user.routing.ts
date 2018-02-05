import { UserListComponent } from './user-list/user-list.component';
import { AppUserComponent } from './app-user.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { 
    path:'',
    component:AppUserComponent,
    children:[
      {
        path:'list',
        component:UserListComponent
      }
    ]
   },
];

export const AppUserRoutes = RouterModule.forChild(routes);
