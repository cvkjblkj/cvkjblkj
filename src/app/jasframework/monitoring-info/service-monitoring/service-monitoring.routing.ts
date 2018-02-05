import { servicetorComponent } from './service-monitoring.component';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: servicetorComponent
  },
];

export const ServiceRoutes = RouterModule.forChild(routes);
