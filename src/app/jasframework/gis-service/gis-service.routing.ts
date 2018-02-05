import { Routes, RouterModule } from '@angular/router';
import { ArcGisMap } from './ArcGIS/arcgis-map.component';
import { gisServiceComponent } from "./gis-service.component";
import { ArcGisVersionThreeMapComponent } from "./ArcGISVersionThree/arcgis-version-three-map.component";

const routes: Routes = [
  {
    path: '',
    component: gisServiceComponent,
    children: [
      {
        path: 'arc-gis-map',
        component: ArcGisMap,
      },
      {
        path: 'arcgis-version-three-map',
        component: ArcGisVersionThreeMapComponent,
      },
    ]
  },
];

export const gisServiceRoutes = RouterModule.forChild(routes);
