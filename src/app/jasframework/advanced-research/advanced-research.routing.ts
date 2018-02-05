import { Routes, RouterModule } from '@angular/router';
import { advancedResearchComponent } from './advanced-research.component';
import { NgxCharts } from './charts-ngx-charts/charts-ngx-charts.component';
import { ngecharts } from './ng-echarts/echarts.component';
import { baiduMapComponent } from './baidu-map/baidu-map.component';
import { RealTimeDataComponent } from './real-time-data/real-time-data.component';
const routes: Routes = [
  {
    path: '',
    component: advancedResearchComponent,
    children: [
      {
        path: 'ngxcharts',
        component: NgxCharts,
      }, {
        path: 'ngecharts',
        component: ngecharts
      },
      {
        path: 'baidu-map',
        component: baiduMapComponent
      },
      {
        path: 'real-time',
        component: RealTimeDataComponent
      }

    ]
  },
];

export const advancedResearchRoutes = RouterModule.forChild(routes);
