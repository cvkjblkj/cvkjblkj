import { AppInfoComponent } from './app-info/app-info.component';
import { AppListComponent } from './app-list/app-list.component';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'list',
        component: AppListComponent
      },
      {
        path: 'info',
        component: AppInfoComponent
      }, {
        path: '',
        redirectTo: "list",
        pathMatch: 'full'
      }
    ]
  },
];

export const AppRoutes = RouterModule.forChild(routes);
