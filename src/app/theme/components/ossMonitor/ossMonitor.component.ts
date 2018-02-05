
import { Component, OnInit, Input, AfterViewInit, OnChanges } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, Routes, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ossMonitor',
  templateUrl: './ossMonitor.component.html',
  styleUrls: ['./ossMonitor.component.css'],
})

export class ossMonitor implements OnInit, AfterViewInit, OnChanges {
  public logCountEcharts: any;
  @Input() legendData: any; // 设置数据形式
  @Input() xAxisData: any;
  @Input() seriesData: any;
  @Input() title: any;
  @Input() metric: any;
  @Input() num: any
  // @Input() init: any
  constructor(private _router: Router, ) { }
  ngOnInit() {

  };
  ngAfterViewInit() {

  }
  ngOnChanges() {

    this.logCountEcharts = {
      grid: {
        left: this.num,
        bottom: '110'
      },
      metric: this.metric,
      tooltip: { trigger: 'axis' },
      legend: { top: '280', data: this.legendData },
      xAxis: { type: 'category', boundaryGap: false, data: this.xAxisData },
      yAxis: {
        type: 'value', axisLabel: {
          formatter: '{value}',
        }
      },
      series: this.seriesData,

    }
  }
  // interval: 0,
  //         rotate: 60
}









