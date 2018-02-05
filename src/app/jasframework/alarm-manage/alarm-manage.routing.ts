import { Routes, RouterModule } from '@angular/router';
import { AlarmManageComponent } from './alarm-manage.component';
import { CreateRuleComponent } from './create-rule/create-rule.component';
import { LoadChildren } from '@angular/router/src/config';
import { EditRuleComponent } from './edit-rule/edit-rule.component'
const routes: Routes = [
  {
    path: '',
    component: AlarmManageComponent,
    children: [
      { path: 'alarm', loadChildren: () => System.import('./alarm/alarm.module.ts') },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'alarm'
      },
      {
        path: 'create-rule',
        component: CreateRuleComponent

      },
      {
        path: 'edit-rule',
        component: EditRuleComponent

      },

    ]
  }
]



export const AlarmRoutes = RouterModule.forChild(routes);
