import { Component, OnInit, AfterViewInit } from '@angular/core';
import { lineData } from './echarts.model';

const echarts = require('echarts');

@Component({
  selector: 'real-time-data',
  templateUrl: 'real-time-data.component.html'
})

export class RealTimeDataComponent implements OnInit, AfterViewInit {

  public options: any;   // 引用组件echarts-ng2  echarts数据
  public showLoading: any = true;    // loading动画是否显示 



  constructor() {
  }

  ngOnInit() {
    this.initEcharts();
    this.showLoading = true;
  }

  ngAfterViewInit() {

  }
  /**
   * 初始化echarts 数据
   * 
   * @memberof RealTimeDataComponent
   */
  initEcharts() {
    let myEcharts = echarts.init(document.getElementById('main'));
    let xAxis = this.getxAxis().xAxisHours;
    let xAxisSenconds = [];
    myEcharts.showLoading();
    this.options = {
      title: {
        text: '未来一周气温变化',
        subtext: '纯属虚构'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['最高气温', '最低气温']
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxis
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} °C'
        }
      },
      series: [
        {
          name: '最高气温',
          type: 'line',
          data: [11, 11, 15, 13, 12, 13, 10],
          markPoint: {
            data: [
              { type: 'max', name: '最大值' },
              { type: 'min', name: '最小值' }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        },
        {
          name: '最低气温',
          type: 'line',
          data: [1, -2, 2, 5, 3, 2, 0],
          markPoint: {
            data: [
              { name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: '平均值' },
              [{
                symbol: 'none',
                x: '90%',
                yAxis: 'max'
              }, {
                symbol: 'circle',
                label: {
                  normal: {
                    position: 'start',
                    formatter: '最大值'
                  }
                },
                type: 'max',
                name: '最高点'
              }]
            ]
          }
        }
      ]
    }
    myEcharts.setOption(
      this.options
    );
    setTimeout(() => {
      myEcharts.hideLoading();
    }, 2000);
    setInterval(() => {
      let today = new Date();
      let h = today.getHours();
      let m = today.getMinutes();
      let s = today.getSeconds();
      m = this.checkTime(m);
      s = this.checkTime(s);
      let time = h + ':' + m + ':' + s;
      xAxisSenconds.push(time);

      let newXaxis = xAxis.concat(xAxisSenconds);  // x 轴的数据一直增加
      let newXaxisLength = xAxis.concat(xAxisSenconds).slice(0, 1);  // x 轴的数据的数组长度保持不变， 
      newXaxis.shift();
      this.options.xAxis.data = newXaxis;
      this.options.series[0].data.push(Math.round(Math.random() * 10));
      myEcharts.setOption({
        xAxis: {
          data: newXaxis
        },
      });
    }, 1000);
  }

  /**
   * 获取X轴的数据
   */
  getxAxis() {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = this.checkTime(m);
    s = this.checkTime(s);
    let xAxisHours = [];
    let xAxisSenconds = [];
    let time = h + ':' + m + ':' + s;
    setInterval(() => {
      xAxisSenconds.push(time);
    }, 1000)
    for (let i = 0; i < h + 1; i++) {
      let item = i + ':00';
      xAxisHours.push(item);
    }
    return {
      xAxisHours: xAxisHours,
      xAxisSenconds: xAxisSenconds
    };
  }

  checkTime(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }











}
