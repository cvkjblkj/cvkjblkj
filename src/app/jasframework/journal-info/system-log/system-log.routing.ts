import { MicroServiceComponent } from './micro-service/micro-service.component';
import { SystemLogComponent } from './system-log.component';
import { Routes, RouterModule } from '@angular/router';
import { MasterServiceComponent } from './master-service/master-service.component';
import { DockerServiceComponent } from './docker-service/docker-service.component';
import { TomcatContainerComponent } from './tomcat-container/tomcat-container.component';
import { NginxContainerComponent } from './nginx-container/nginx-container.component'
const routes: Routes = [
  {
    path: '',
    component: SystemLogComponent,
    children: [

      {
        path: 'Microservices',
        component: MicroServiceComponent
      },
      {
        path: 'MasterService',
        component: MasterServiceComponent
      },
      {
        path: 'Docker',
        component: DockerServiceComponent
      },
      {
        path: 'Tomcat',
        component: TomcatContainerComponent
      },
      {
        path: 'Nginx',
        component: NginxContainerComponent
      },
       {
        path: '',
        redirectTo: 'MasterService',
        pathMatch: 'full'
      }
    ]
  },
];

export const SystemLogRoutes = RouterModule.forChild(routes);
