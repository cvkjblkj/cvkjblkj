import { UserInfoComponent } from './user-info/user-info.component';
import { EventUserListComponent } from './event-user-list/event-user-list.component';
import { EventComponent } from './event/event.component';
import { EventAnalysisComponent } from './event-analysis.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: EventAnalysisComponent,
    children: [
      {
        path: '',
        redirectTo: 'event',
        pathMatch: 'full',
      },
      {
        path: 'event',
        component: EventComponent,
        children: [
          {
            path: 'user-list',
            component: EventUserListComponent,
          },
          {
            path: 'user-info',
            component: UserInfoComponent,
          }
        ]
      },

    ]
  },
  {

  }
];

export const EventAnalysisRoutes = RouterModule.forChild(routes);
