import { MasterMonitorComponent } from './master-monitor.component';
import { Routes, RouterModule } from '@angular/router';
import { BaseMonitorComponent } from './base-monitor/base-monitor.component';
import { HandleMonitorComponent } from './handle-monitor/handle-monitor.component';
const routes: Routes = [
  {
    path: '',
    component: MasterMonitorComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'base-monitor'
      },
      {
        path: 'base-monitor',
        component: BaseMonitorComponent
      },
      {
        path: 'handle-monitor',
        component: HandleMonitorComponent
      },

    ]
  },
];

export const MasterRoutes = RouterModule.forChild(routes);
