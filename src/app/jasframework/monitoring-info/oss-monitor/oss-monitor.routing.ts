import { OssMonitorComponent } from './oss-monitor.component';
import { Routes, RouterModule } from '@angular/router';
import { HierarchyMonitorComponent } from './hierarchy-monitor/hierarchy-monitor.component';
import {BuketchyMonitorComponent} from './buketchy-monitor/buketchy-monitor.component'
const routes: Routes = [
  {
    path: '',
    component: OssMonitorComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'hierarchy-monitor'
      },
      {
        path: 'hierarchy-monitor',
        component: HierarchyMonitorComponent
      },
      {
        path: 'buketchy-monitor',
        component: BuketchyMonitorComponent

      }


    ]
  },
];

export const OssRoutes = RouterModule.forChild(routes);
