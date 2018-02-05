import { DataPrivilegeDemoComponent } from './../jasframework/advanced-research/data-privilege-demo/data-privilege-demo.component';

import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AuthGuard } from '../core/shared/auth-guard.service';

const routes: Routes = [
  {
    path: 'login',    //用户登陆页面
    loadChildren: () => System.import('../core/login/login.module')
  },
  {
    path: 'register',  //用户注册组件
    // path: 'register',  //用户注册组件
    loadChildren: () => System.import('../core/register/register.module')
  },
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'jas', loadChildren: () => System.import('../jasframework/jas/jas.module.ts'), canLoad: [AuthGuard] },
      { path: 'dashboard', loadChildren: () => System.import('../core/dashboard/dashboard.module'), canLoad: [AuthGuard] },
      { path: 'advanced-research', loadChildren: () => System.import('../jasframework/advanced-research/advanced-research.module') },
      { path: 'IOT', loadChildren: () => System.import('../jasframework/IOT-admin/IOT-admin.module') },
      { path: 'alarm-manage', loadChildren: () => System.import('../jasframework/alarm-manage/alarm-manage.module') },
      { path: 'gis-service', loadChildren: () => System.import('../jasframework/gis-service/gis-service.module') },
      // 测试
      { path: 'monitoring-info', loadChildren: () => System.import('./../jasframework/monitoring-info/monitoring-info.component.module') },

      {
        path: 'data-privilege-demo',
        component: DataPrivilegeDemoComponent
      },
      {
        path: 'big-data',
        loadChildren: () => System.import('../jasframework/big-data/big-data.module')
      },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
