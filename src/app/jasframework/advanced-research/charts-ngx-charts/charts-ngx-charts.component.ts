import {Component, OnInit} from '@angular/core';
import {single, multi, multiOne, multiTwo, multiThree} from './data.ts';
@Component({
  selector: 'charts-NgxCharts',
  templateUrl: 'charts-ngx-charts.component.html',
  styleUrls: ['./charts-ngx-charts.component.css'],
  providers: []
})

export class NgxCharts implements OnInit {

  single:any[];
  multi:any[];
  multiOne:any[];
  multiTwo:any[];
  multiThree:any[];

  // view:any[] = [700, 400];
  // options
  showXAxis = true;
  showYAxis = true;
  // gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = '分类';
  showYAxisLabel = true;
  yAxisLabel = '男女问题';
  // colorScheme = {
  //   domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  // };

  constructor() {
    Object.assign(this, {single, multi, multiOne, multiTwo, multiThree})
  }

  ngOnInit() {

  }

  onSelect(event) {
    console.log(event);
  }
}
