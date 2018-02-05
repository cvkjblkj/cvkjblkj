import { IOTDataShowComponent } from './IOT-data-show/IOT-data-show.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'data-show',
        loadChildren: () => System.import('./IOT-data-show/IOT-data-show.module')
      }
    ]
  },
];

export const IOTAdminRoutes = RouterModule.forChild(routes);
