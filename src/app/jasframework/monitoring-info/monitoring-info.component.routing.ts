import { DruidMonitor } from './druid-monitor/druid-monitor.component';
import { LoadChildren } from '@angular/router/src/config';
import { Routes, RouterModule } from '@angular/router';
import { MonitoringComponent } from './monitoring-info.component';
import { RedisMonitorComponent } from './redis-monitor/redis-monitor.component';
import {DockerMonitorComponent} from './docker-monitor/docker-monitor.component';
import {RdsMonitorComponent} from './rds-monitor/rds-monitor.component';
import {BalanceMonitorComponent} from './balance-monitor/balance-monitor.component'
const routes: Routes = [
  {
    path: '',
    component: MonitoringComponent,
    children: [

      { path: 'service-monitoring', loadChildren: () => System.import('./service-monitoring/service-monitoring.module.ts') },
      { path: 'master-monitor', loadChildren: () => System.import('./master-monitor/master-monitor.module.ts') },
      { path: 'oss-monitor', loadChildren: () => System.import('./oss-monitor/oss-monitor.module') },
      {
        path: 'druid-monitor',
        component: DruidMonitor,
      },
      {
        path: 'redis-montior',
        component: RedisMonitorComponent
      },
      {
        path: 'balance-monitor',
        component: BalanceMonitorComponent
      },
      {
        path: 'docker-monitor',
        component: DockerMonitorComponent
      },
      {
        path: 'rds-monitor',
        component: RdsMonitorComponent
      },
      { path: '', redirectTo: 'service-monitoring', pathMatch: 'full' },
    ]
  }
]



export const monitoringRoutes = RouterModule.forChild(routes);
