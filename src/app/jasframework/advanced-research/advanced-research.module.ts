import { NgaModule } from './../../theme/nga.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { advancedResearchComponent } from './advanced-research.component';
import { advancedResearchRoutes } from './advanced-research.routing';
import { NgxCharts } from './charts-ngx-charts/charts-ngx-charts.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ngecharts } from './ng-echarts/echarts.component';
// echarts需要的服务,由于有2个以上模块引入这个服务所以需要把这个服务放到一个模块中,然后引入这个模块即可解决此问题
import { Ng2EchartsModule } from './../journal-info/ng2-echarts.module';
import { baiduMapComponent } from './baidu-map/baidu-map.component';
import { BaiduMapModule } from 'angular2-baidu-map';
import { RealTimeDataComponent } from './real-time-data/real-time-data.component';
import { DropdownModule, TreeModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms'; //ngmodule指令需要
import { DataPrivilegeDemoComponent } from './data-privilege-demo/data-privilege-demo.component';
@NgModule({
  imports: [
    CommonModule,
    advancedResearchRoutes,
    NgxChartsModule,
    Ng2EchartsModule,
    BaiduMapModule,
    NgaModule,
    DropdownModule,
    TreeModule,
    FormsModule,
  ],
  providers: [],
  declarations: [advancedResearchComponent, NgxCharts, ngecharts, baiduMapComponent, RealTimeDataComponent,
    DataPrivilegeDemoComponent
]
})
export default class advancedResearchModule { }
