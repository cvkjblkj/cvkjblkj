import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ecs-echarts',
  templateUrl: './ecs-echarts.component.html',
  styleUrls: ['./ecs-echarts.component.css']
})
export class EcsEchartsComponent implements OnInit, OnChanges {

  @Input() legendData: any; // 接收legend
  @Input() xAxisData: any;  // x轴数据
  @Input() seriesData: any;   // 折线数据
  @Input() title: any;  // 图表标题
  @Input() metric: any;  // 图表的metric
  @Input() unit: any;  // 单位

  @Input() index: any; // index索引


  private changeFrequency: any;  // 变化
  private echartsData: any = {}; // echarts数据

  constructor() {

  }

  ngOnChanges() {
    console.log('进入echarts-----子组件');
    this.changeFrequency = 1;
    this.echartsData = {
      grid:{
        left:'12%'
      },
      title: {
        text: this.title,
        textStyle: {
          fontWeight: 400,
          fontSize: 12,
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: this.legendData,
        bottom: 0
      },

      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.xAxisData
      },
      yAxis: [{
        type: 'value',
        axisLabel: {
          formatter: '{value}' + this.unit
        }
      }],
      series: this.seriesData
    }
  }
  ngOnInit() {
  }



}
