import { EnterpriseAuthedApproveComponent } from './enterprise-authed-approve/enterprise-authed-approve.component';
import { EnterpriseAuthApproveComponent } from './enterprise-auth-approve/enterprise-auth-approve.component';
import { EnterpriseAuthListComponent } from './enterprise-auth-list/enterprise-auth-list.component';
import { EnterpriseAuthComponent } from './enterprise-auth.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { 
    path:'',
    component:EnterpriseAuthComponent,
    children:[
      {
        path:'list',
        component:EnterpriseAuthListComponent,
      },
      {
        path:'auth-approve',
        component:EnterpriseAuthApproveComponent,
      },
      {
        path:'authed',
        component:EnterpriseAuthedApproveComponent,
        
      }
    ]
   },
];

export const EnterpriseAuthRoutes = RouterModule.forChild(routes);
