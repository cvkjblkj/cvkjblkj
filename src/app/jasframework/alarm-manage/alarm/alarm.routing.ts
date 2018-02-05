import { Routes, RouterModule } from '@angular/router';
import { AlarmRuleComponent } from './../alarm-rule/alarm-rule.component';
import { AlarmHistoryComponent } from './../alarm-history/alarm-history.component';
import { AlarmComponent } from './alarm.component';


const routes: Routes = [
  {
    path: '',
    component: AlarmComponent,
    children: [
      {
        path: 'alarm-rule',
        component: AlarmRuleComponent
      },
      {
        path: 'alarm-history',
        component: AlarmHistoryComponent

      },


      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'alarm-rule'
      },
    ]
  }
]



export const AlarRoutes = RouterModule.forChild(routes);
