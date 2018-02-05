import { ViewManagerComponent } from './view-manager/view-manager.component';
import { AppViewComponent } from './app-view.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { 
    path:'',
    component:AppViewComponent,
    children:[
      { 
        path:'list',
        component:ViewManagerComponent
      }
     
    ]

   },
];

export const AppViewRoutes = RouterModule.forChild(routes);
