import { UserListComponent } from './user-list/user-list.component';
import { PlatUserComponent } from './plat-user.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PlatUserComponent,
    children: [
      {
        path: 'detail',
        loadChildren: () => System.import('./user-detail/user-detail.module.ts'),

      },
      {
        path: 'list',
        component: UserListComponent,
      },
      // {
      //   path: '',
      //   redirectTo: 'list',
      //   pathMatch: 'full',
      // }
    ]
  },
];

export const PlatUserRoutes = RouterModule.forChild(routes);
