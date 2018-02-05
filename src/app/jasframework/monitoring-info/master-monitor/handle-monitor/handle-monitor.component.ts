import { balanceDate } from './../../balance-monitor/data';     //导入自定义的查询数据格式
import { MonitorService } from './../../shared/monitor.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from './../../../../core/common-service/common.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { INCONFIG } from './../../../../core/global';

@Component({
  selector: 'handle-monitor',
  templateUrl: './handle-monitor.component.html',
  styleUrls: ['./handle-monitor.component.scss']
})
export class HandleMonitorComponent implements OnInit {
  // public logCountEcharts: any;
  public flagShow: any; //放大图表显示2个图表切换显示(一个图表组件数据清除不干净)
  public dateEnd: any;//当前时间
  public dateStart: any; //开始时间

  private routeParams: any;  // 全局的路由params

  public chartsCondition: any;        //图表的查询条件，内置条件，不是页面的筛选条件
  public echartsOptions: any[];     //操作系统页面图表需要的数据
  private defaultStatus: any = true;  // 默认的选中状态 : 最大值、最小值、平均值
  public viewValue: any;              // 点击放大弹窗是 显示的数据
  public diskDeviceName: any[];       // 磁盘设备的名字
  public selectDiskDevice: any;       // 点击选择的 磁盘设备名字
  public networkDeviceName: any[];    // 网络设备的名字
  public selectNetworkDevice: any;    // 点击选择的 网络设备名字

  constructor(public commonService: CommonService,
              public elementRef: ElementRef,
              public router: Router,
              public route: ActivatedRoute,
              private monitorService: MonitorService) {
    this.chartsCondition = [
      //CPU
      { name: 'CPU使用率', polystyle: 'average', metric: ['cpu_idle', 'cpu_other', 'cpu_wait', 'cpu_user', 'cpu_system'] },
      { name: '内存使用量', polystyle: 'average', metric: ['memory_totalspace', 'memory_usedspace', 'memory_actualusedspace'] },
      { name: '系统平均负载', polystyle: 'average', metric: ['load_1m', 'load_15m', 'load_5m'] },
      //磁盘监控指标
      { name: '磁盘使用量', polystyle: 'average', metric: ['diskusage_used', 'diskusage_free'] },
      { name: '读写字节数', polystyle: 'average', metric: ['disk_readbytes', 'disk_writebytes'] },
      { name: '读写请求数', polystyle: 'average', metric: ['disk_readiops', 'disk_writeiops'] },
      { name: 'Inode使用率', polystyle: 'average', metric: ['fs_inodeutilization'] },
      //网络监控指标
      { name: '网络流入流出速率', polystyle: 'average', metric: ['networkin_rate', 'networkout_rate'] },
      {
        name: '网络流入流出数据包数', polystyle: 'average',
        metric: ['networkin_errorpackages', 'networkin_packages', 'networkout_errorpackages', 'networkout_packages']
      },
    ];
    this.echartsOptions = [null, null, null, null, null, null, null, null, null];
    this.flagShow = false; //放大图表弹窗中2个echarts插件切换开关
  }

  ngOnInit() {
    // 检测路由的变化
    this.route.queryParams.subscribe((params: Params) => {
      if (params['rang']) {
        this.routeParams = params;
        // 设置 开始时间和结束
        this.setDateTime(params);
        this.getNetworkDeviceName();      //获取网络设备的名字列表
        this.getDiskDeviceName();         //获取磁盘设备的名字列表
        this.requestData();
      }
    });
  };

  /**
   * 通过路由参数，设置开始时间、结束时间
   * @param {any} params 路由参数
   * @memberof BaseMonitorComponent
   */
  setDateTime(params) {
    switch (params['rang']) {
      case '1h':
        this.dateStart = new Date(new Date().getTime() - 3600000 * 1);
        this.dateEnd = new Date();
        break;
      case '3h':
        this.dateStart = new Date(new Date().getTime() - 3600000 * 3);
        this.dateEnd = new Date();
        break;
      case '6h':
        this.dateStart = new Date(new Date().getTime() - 3600000 * 6);
        this.dateEnd = new Date();
        break;
      default:
        let customDate = params['rang'].split(',');
        this.dateStart = customDate[0];
        this.dateEnd = customDate[1];
    }
  }

  //查询数据
  public requestData() {
    this.getData(this.chartsCondition[0], 0);   //CPU
    this.getData(this.chartsCondition[1], 1);   //内存
    this.getData(this.chartsCondition[2], 2);   //负载
  }

  //查询网络设备名字
  public getNetworkDeviceName() {
    let __this = this;
    let params = {
      "fields": "device",
      "filters": [{
        "itemKey": "metric", "filter": "term",
        "itemValue": this.chartsCondition[7].metric.concat(this.chartsCondition[8].metric)
      }]
    };
    this.monitorService.getECSDeviceName(__this, params, (res) => {
      if (res && res.code == 200 && res.success == 1) {
        if (res['rows'].length == 0) {
          __this.networkDeviceName = [];
          return;
        }
        __this.networkDeviceName = res['rows'][0].values;
        __this.selectNetworkDevice = __this.networkDeviceName[0];
        //查询 网络监控指标 下2个图表数据
        this.getData(this.chartsCondition[7], 7);
        this.getData(this.chartsCondition[8], 8);
      }
    })
  }

  //查询磁盘设备名字
  public getDiskDeviceName() {
    let __this = this;
    let metric = []
    for (let i = 3; i < 7; i++ ) {
      metric = metric.concat(this.chartsCondition[i].metric);
    }
    let params = {
      "fields": "device",
      "filters": [{
        "itemKey": "metric", "filter": "term",
        "itemValue": metric
      }]
    };
    this.monitorService.getECSDeviceName(__this, params, (res) => {
      if (res && res.code == 200 && res.success == 1) {
        if (res['rows'].length == 0) {
          __this.diskDeviceName = [];
          return;
        }
        __this.diskDeviceName = res['rows'][0].values;
        __this.selectDiskDevice = __this.diskDeviceName[0];
        //查询 磁盘监控指标 下2个图表数据
        this.getData(this.chartsCondition[3], 3);
        this.getData(this.chartsCondition[4], 4);
        this.getData(this.chartsCondition[5], 5);
        this.getData(this.chartsCondition[6], 6);
      }
    })
  }

  //磁盘设备 名字按钮处理按钮点击事件。
  public diskDeviceBtn(device) {
    this.selectDiskDevice = device;
    //查询 磁盘监控指标 下2个图表数据
    this.getData(this.chartsCondition[3], 3);
    this.getData(this.chartsCondition[4], 4);
    this.getData(this.chartsCondition[5], 5);
    this.getData(this.chartsCondition[6], 6);
  }

  //网络设备 名字按钮处理按钮点击事件。
  public networkDeviceBtn(device) {
    this.selectNetworkDevice = device;
    //查询 网络监控指标 下2个图表数据
    this.getData(this.chartsCondition[7], 7);
    this.getData(this.chartsCondition[8], 8);
  }

  /*从数据库查询数据
  * CPUchartsCondition : 查询的条件
  * i               : 查询的是第几个图表
  * */
  public getData(chartsCondition, i) {
    let __this = this;
    let params = this.setFiltercondition(chartsCondition.metric, chartsCondition.polystyle, i);

    __this.monitorService.getECSData(__this, params, (res) => {
      if (res && res.code == 200 && res.success == 1) {
        if (res['rows'].length == 0) {
          __this.echartsOptions[i] = null;
          return;
        }
        __this.echartsOptions[i] = __this.processReturnData(res['rows'], i);
        __this.echartsOptions[i].chartName = chartsCondition.name
        //系统平均负载 没有单位。
        if (chartsCondition.name != '系统平均负载') {
          __this.echartsOptions[i].chartName += '(' + __this.echartsOptions[i].unit + ')';
        }
      }
    })
  }

  /*处理查询结果的返回数据
  * arr   : 待处理的数据
  * index : 这是第几个图表
  * */
  public processReturnData(arr, index) {
    let xAxisData = [];
    let legendData = [];
    let echartOption = {
      color: INCONFIG.echartLineColor,
      tooltip: { trigger: 'axis' },
      legend: { data: [], bottom: '0' },
      grid: { left: '15%', bottom: '23%', },
      xAxis: { type: 'category', boundaryGap: false, data: [] },
      yAxis: { type: 'value', },
      series: [],
      chartName: null,    //自定义的，用于知道这个图表的名字
      unit: null,         //自定义， 用于知道这个图表数据的 单位
    }
    for (let i = 0; i < arr.length; i++) {
      let seriesItem = { name: '', type: 'line', data: [], lineStyle: '1px', stack: null, areaStyle: null }
      let item = arr[i];
      let legendUnit = this.returnLegendUnitItem(item.name);
      legendData.push(legendUnit.legend);
      let value = this.monitorService.unitConversion(legendUnit.unit, arr);
      seriesItem.data = value.value[i].datas;
      echartOption.unit = value.unit;    //设置这个图表的数据单位
      seriesItem.name = legendUnit.legend;
      if (i == 0) {
        for (let sourcesItem of item.sources) {
          xAxisData.push(sourcesItem.dateFormat);
        }
      }
      if ('013'.indexOf(index) != -1) {
        //如果是第一、第二、第四个 图表，则图表每条线下面的区域都会有颜色
        seriesItem.areaStyle = { normal: {} };
      }
      if ('03'.indexOf(index) != -1) {
        //如果是第一、第四个 图表，则图表的堆叠图
        seriesItem.stack = '总量';
      }
      echartOption.series.push(seriesItem);
    }
    echartOption.legend.data = legendData;
    echartOption.xAxis.data = xAxisData;
    //如果是第一个图表，则数据顺序颠倒
    if (0 == index) {
      echartOption.legend.data.reverse();
      echartOption.series.reverse();
    }
    return echartOption;
  }

  //返回图表一条数据的名字
  returnLegendUnitItem(metricName) {
    let legendName;
    let unit;
    for (let item of balanceDate.ECS) {
      if (item.Metric == metricName) {
        //如果describe里有汉字，则用describe，否则用Metric
        legendName = /[\u4e00-\u9fa5]+/.test(item.describe) ? item.describe : item.Metric;
        unit = item['unit'] ? item['unit'] : undefined;
      }
    }
    return {
      legend: legendName,
      unit: unit
    };
  }

  /**
   * 设置搜索条件
   * @param {any} metric    请求的是那种数据（CPU，内存等类型）
   * @param {any} polyStyle 请求的是： 最大值、最小值、平均值
   * @param {any} i         哪个图表的参数
   */
  setFiltercondition(metric: Array<any>, polyStyle: string, i: any) {
    let startTime = this.commonService.formatDate(this.dateStart).times;
    let endTime = this.commonService.formatDate(this.dateEnd).times;
    let samplingFrequency = INCONFIG.setSamplingFrequency(startTime, endTime);
    let filterCondition = {
      "statisticsBegin": startTime,
      "statisticsEnd": endTime,
      'filters': [
        { 'itemKey': 'instanceId', 'filter': 'term', 'itemValue': this.routeParams['instanceId'] },
      ],
      "statisticsType": samplingFrequency.statisticsType,
      "statisticsInterval": samplingFrequency.statisticsInterval,
      "metricName": metric,
      "dataFieldsKeys": polyStyle
    };
    //网络监控指标图表自己的过滤条件
    if ('78'.indexOf(i) != -1) {
      filterCondition.filters.push({ 'itemKey': 'device', 'filter': 'term', 'itemValue': this.selectNetworkDevice })
    } else if ('3456'.indexOf(i) != -1) {
      //磁盘监控指标图表添加的过滤条件
      filterCondition.filters.push({ 'itemKey': 'device', 'filter': 'term', 'itemValue': this.selectDiskDevice })
    }
    return filterCondition;
  }

  /**
   * 最大值、最小值、平局值 三个按钮的处理事件
   * @param {any} chartsOptions 查询后存放的数据
   * @param {any} condition     条件
   * @param {any} e             网页元素
   * @memberof BaseMonitorComponent
   */
  getpolyStyle(condition, i, e) {
    var e = e || window.event;
    var obj = e.target || e.srcElement;
    let clickedDom = obj.className
    //获取查询的条件： 最大值、最小值、平局值, 不等于-1 就是存在，
    if (clickedDom.indexOf('minimum') != -1) {
      condition.polystyle = 'minimum';
    } else if (clickedDom.indexOf('maximum') != -1) {
      condition.polystyle = 'maximum';
    } else {
      condition.polystyle = 'average';
    }
    //查询数据
    this.getData(condition, i);
    this.defaultStatus = false;
    this.commonService.stopBubble(e);
  }


  /**cpu 鼠标移入事件
   * @param documentElement   网页上Doc元素
   * @param i                 第几个图表
   * @param data              这个图表的数据，如果没有数据则不处理
   */
  public mouseOver(i: any, data, documentElement) {
    if (!data || data.legend.data.length == 0) return;
    documentElement.children[i].children[0].children[0].style.right = 0;
    documentElement.children[i].children[0].children[0].style.display = 'inline-block';
  };

  /**cpu 鼠标移出
   * @param documentElement   网页上Doc元素
   * @param i                 第几个图表
   * @param data              这个图表的数据，如果没有数据则不处理
   */
  public mouseOut(i: any, data, documentElement) {
    if (!data || data.legend.data.length == 0) return;
    documentElement.children[i].children[0].children[0].style.right = -195 + 'px';
    documentElement.children[i].children[0].children[0].style.display = 'none';
  };

  /**
   * 放大图标点击事件
   * @param event
   * @param viewModal
   */
  public spanClick(event: any, viewModal: any) {
    this.viewValue = {};
    this.viewValue = event;
    this.flagShow = !this.flagShow;
    viewModal.show();
  };

}
