import { BusinessLogComponent } from './business-log/business-log.component';
import { LoginJournalComponent } from './login-journal/login-journal.component';
import { JournalInfoComponent } from './journal-info.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: JournalInfoComponent,
    children: [
      {
        path: 'login-journal',
        // loadChildren: () => System.import('./login-journal/login-journal.module.ts')
        component: LoginJournalComponent,
      },
      {
        path: 'business-log',
        // loadChildren: () => System.import('./business-log/business-log.module.ts')
        component: BusinessLogComponent,
      },
      {
        path: 'system-log',
        loadChildren: () => System.import('./system-log/system-log.module.ts')
      },
      {
        path: '',
        redirectTo: 'login-journal',
        pathMatch: 'full',
      }
    ]


  },
];

export const JournalInfoRoutes = RouterModule.forChild(routes);
