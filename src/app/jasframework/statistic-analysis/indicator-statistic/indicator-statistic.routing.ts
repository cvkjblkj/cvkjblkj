import { DetailListComponent } from './detail-list/detail-list.component';
import { IndicatorComponent } from './indicator/indicator.component';
import { IndicatorStatisticComponent } from './indicator-statistic.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: IndicatorStatisticComponent,
    children: [
      { path: '', redirectTo: 'indicator', pathMatch: 'full' },
      {
        path: 'indicator',
        component: IndicatorComponent,
      },
      { path: 'list', component: DetailListComponent },
    ]
  },
];

export const IndicatorStatisticRoutes = RouterModule.forChild(routes);
