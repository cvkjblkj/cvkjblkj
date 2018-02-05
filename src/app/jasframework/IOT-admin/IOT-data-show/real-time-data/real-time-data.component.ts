import { IOTDataShowService } from './../shared/IOT-data-show.service';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from './../../../../core/common-service/common.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

declare var $: any;
@Component({
  selector: 'real-time-data',
  templateUrl: './real-time-data.component.html',
  styleUrls: ['./real-time-data.component.scss']
})
export class RealTimeDataComponent implements OnInit, OnDestroy {
  private realTimeData: any; // 实时数据
  private historyData: any; // 历史数据
  // private valueData: any;  // 页面显示的数据
  private frequency: any = 5; // 初始化页面时，默认的采样频率的值
  private options: any;  // echarts的配置项
  private sampling: any; // 是否显示 修改采样频率

  private beginTime = new Date().getTime() - 10 * 60 * 1000;  // 获取历史数据的开始时间
  private endTime = new Date().getTime(); // 获取历史数据的结束时间
  private attributeValue: any; // 最新的属性值
  private dateTimer: any; // 时间的计时器
  private requestTimer: any; // 请求的计时器
  public unit: any;  //单位
  public empty: any = false; // 数据是否为空
  @ViewChild('currentDate') currentDate: any; // 当前时间
  @ViewChild('inputFrequency') inputFrequency: any; // 当前时间
  constructor(
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private IOTDataShowService: IOTDataShowService
  ) {
    this.options = {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: [],
      },
      yAxis: {
        type: 'value',
      },
      xAxis: {
        type: 'category',
        data: [],
      },
      series: [{ name: '', type: 'line', data: [] }]
    };
  }

  ngOnInit() {

    let _that = this;
    let paramsValue;
    this.route.queryParams.subscribe((params: Params) => {
      if (params['deviceName']) {
        this.empty = false;
        if (params['attribute'] == '') {
          this.empty = true;
          this.attributeValue = '';
          this.unit = '';
          return
        }
        // 清除计时器
        clearInterval(this.dateTimer);
        clearInterval(this.requestTimer);
        // 清空数据
        this.options = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: [],
          },
          yAxis: {
            type: 'value',
          },
          xAxis: {
            type: 'category',
            data: [],
          },
          series: [{ name: '', type: 'line', data: [] }]
        };
        paramsValue = params;
        this.getHistoryValue(params['attribute']);
        this.realTimeRequest(params['attribute']);
      }
    });
    $('#inputFrequency').on('input propertychange', () => {

      clearInterval(this.requestTimer);

      _that.realTimeRequest(paramsValue['attribute']);
    })
  }

  ngOnDestroy() {
    // 清除计时器
    clearInterval(this.dateTimer);
    clearInterval(this.requestTimer);
  }

  /**
   * 实时获取数据
   * 
   * @param {any} attributeId 
   * @memberof RealTimeDataComponent
   */
  realTimeRequest(attributeId) {
    this.requestTimer = setInterval(() => {
      this.getRealTimeValue(attributeId);
    }, this.frequency * 1000)
  }


  /**
   * 获取实时数据的值
   * 
   * @memberof RealTimeDataComponent
   */
  getRealTimeValue(attributeId) {
    let _that = this;
    let params = {
      tagIds: attributeId,
    };

    this.IOTDataShowService.getRealTimeData(_that, params, (res) => {
      if (res && res.success == 1) {
        if (res.rows.length > 0) {
          _that.realTimeData = res.rows;
          _that.attributeValue = _that.realTimeData[0].value;
          _that.unit = _that.realTimeData[0].unit;
          _that.options.xAxis.data.shift();
          _that.options.xAxis.data.push(_that.commonService.formatDate(new Date()).formatTime);
          _that.options.series[0].data.shift();
          _that.options.series[0].data.push(_that.realTimeData[0].value);
          _that.currentDate.nativeElement.innerHTML = _that.commonService.formatDate(new Date()).formatTime;
          let tmp = {
            title: {
              text: _that.realTimeData[0].tagSource
            },
            tooltip: {
              trigger: 'axis',
            },
            legend: {
              data: [_that.realTimeData[0].tagName.slice(_that.realTimeData[0].tagName.indexOf('.') + 1, _that.realTimeData[0].tagName.length)],
            },
            yAxis: {
              type: 'value',
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: _that.options.xAxis.data
            },
            series: [{ name: _that.realTimeData[0].tagName.slice(_that.realTimeData[0].tagName.indexOf('.') + 1, _that.realTimeData[0].tagName.length), type: 'line', data: _that.options.series[0].data, lineStyle: "1px", }]
          };
          _that.options = tmp;
        } else {
          _that.realTimeData = [];
        }
      } else {
        _that.realTimeData = [];
      }
    })
  }

  /**
   * 获取历史数据
   * 
   * @param {any} attributeId 
   * @memberof RealTimeDataComponent
   */
  getHistoryValue(attributeId) {
    let _that = this;
    let params = {
      tagIds: attributeId,
      beginTime: this.endTime - this.frequency * 1000 * 49,
      endTime: this.endTime,
      interval: 5,
      count: 2780000
    }
    this.IOTDataShowService.getHistoryData(_that, params, (res) => {
      if (res && res.success == 1) {
        _that.historyData = res.rows.length > 0 ? res.rows : [];
        _that.attributeValue = _that.historyData[_that.historyData.length - 1].value;
        _that.options = _that.setRealTimeOPtions(_that.historyData);
        _that.currentDate.nativeElement.innerHTML = _that.historyData[_that.historyData.length - 1].timestamp;
        _that.unit = _that.historyData[_that.historyData.length - 1].unit;
        // console.log(_that.options);
      } else {
        _that.historyData = [];
      }
    })
  }


  /**
   * 设置 echarts的配置项
   * 
   * @param {any} dataArr 后台数据
   * @memberof RealTimeDataComponent
   */
  setRealTimeOPtions(dataArr) {
    let i;
    let data = [];
    let _this = this;
    // echarts配置项
    let optionsTmp = {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: [],
      },
      yAxis: {
        type: 'value',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
      },
      series: [{ name: '', type: 'line', data: [], lineStyle: "1px", }]
    };
    for (i = 0; i < dataArr.length; i++) {
      let item = dataArr[i];
      optionsTmp.title.text = item.tagName.slice(0, item.tagName.indexOf('.'));
      optionsTmp.legend.data = [item.tagName.slice(item.tagName.indexOf('.') + 1, item.tagName.length)];
      optionsTmp.xAxis.data.push(item.timestamp);
      optionsTmp.series[0].name = optionsTmp.legend.data[0];
      data.push(item.value);
      optionsTmp.series[0].data = data;
    };
    return optionsTmp;
  }


  /**
  * 页面上显示的计时器
  * 
  * @memberof AddEchartsComponent
  */
  private getCurrentDate() {
    this.dateTimer = setInterval(() => {
      let dt = new Date();
      let date = this.commonService.formatDate(dt).formatTime;
      if (!this.empty) {
        this.currentDate.nativeElement.innerHTML = date;
      }

    }, 1000); //开始执行
  }

}
