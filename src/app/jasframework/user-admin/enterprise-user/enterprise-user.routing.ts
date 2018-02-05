import { EnterpriseUserComponent } from './enterprise-user.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {  
    path:'',
    component:EnterpriseUserComponent
  },
];

export const EnterpriseUserRoutes = RouterModule.forChild(routes);
