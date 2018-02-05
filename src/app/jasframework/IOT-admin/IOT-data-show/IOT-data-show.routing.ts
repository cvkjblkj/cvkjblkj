import { HistoryDataComponent } from './history-data/history-data.component';
import { RealTimeDataComponent } from './real-time-data/real-time-data.component';
import { IOTDataShowComponent } from './IOT-data-show.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: IOTDataShowComponent,
    children: [
      {
        path: 'real-time',
        component: RealTimeDataComponent,
      },
      {
        path: 'history',
        component: HistoryDataComponent
      },
      {
        path: '',
        redirectTo: 'real-time',
        pathMatch: 'full',
      }
    ]
  },
];

export const IOTDataShowRoutes = RouterModule.forChild(routes);
