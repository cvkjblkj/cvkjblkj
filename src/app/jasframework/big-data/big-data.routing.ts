import { BigDataComponent } from './big-data.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { 
    path: '',
    component: BigDataComponent,
    children: [
      { path: '', redirectTo: 'data-source', pathMatch: 'full' },
      { path: 'data-source', loadChildren: () => System.import('../big-data/data-source/data-source.module') },
      { path: 'cluster-manager', loadChildren: () => System.import('../big-data/cluster-manager/cluster-manager.module') }
    ]
   },
];

export const BigDataRoutes = RouterModule.forChild(routes);
