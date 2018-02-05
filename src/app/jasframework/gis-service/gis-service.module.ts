import { NgaModule } from './../../theme/nga.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArcGisMap } from './ArcGIS/arcgis-map.component';
import { EsriLoaderService } from 'angular2-esri-loader';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DropdownModule, TreeModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { gisServiceRoutes } from "./gis-service.routing";
import { gisServiceComponent } from "./gis-service.component"; //ngmodule指令需要
import { ArcGisVersionThreeMapComponent } from "./ArcGISVersionThree/arcgis-version-three-map.component";
@NgModule({
  imports: [
    CommonModule,
    gisServiceRoutes,
    NgxChartsModule,
    NgaModule,
    DropdownModule,
    TreeModule,
    FormsModule,
  ],
  providers: [EsriLoaderService],
  declarations: [ ArcGisMap, gisServiceComponent, ArcGisVersionThreeMapComponent]
})
export default class gisServiceModule {
}
