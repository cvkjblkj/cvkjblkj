import { AppFuncComponent } from './app-func.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    
    children: [
      {
        path: 'list',
        component: AppFuncComponent
      }

    ]
  },
];

export const AppFuncRoutes = RouterModule.forChild(routes);
