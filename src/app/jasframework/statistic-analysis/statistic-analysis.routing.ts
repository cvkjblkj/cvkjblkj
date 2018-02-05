import { StatisticAnalysisComponent } from './statistic-analysis.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: StatisticAnalysisComponent,
    children: [
      {
        path: '',
        redirectTo: 'indicator-statistic',
        pathMatch: 'full',
      },
      {
        path: 'indicator-statistic',
        loadChildren: () => System.import('./indicator-statistic/indicator-statistic.module.ts')
      },
      {
        path: 'event-analysis',
        loadChildren: () => System.import('./event-analysis/event-analysis.module.ts')
      }
    ]
  },
];

export const StatisticAnalysisRoutes = RouterModule.forChild(routes);
