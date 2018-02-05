import { DataSourceComponent } from './data-source.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { 
    path: '',
    component: DataSourceComponent
   },
];

export const DataSourceRoutes = RouterModule.forChild(routes);
