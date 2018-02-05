import { INCONFIG } from './../../../../core/global';

import { concatStatic } from 'rxjs/operator/concat';
import { balanceDate } from './../../balance-monitor/data';
import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, Renderer, ViewChild } from '@angular/core';
import { CommonService } from './../../../../core/common-service/common.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MonitorService } from './../../shared/monitor.service';

@Component({
  selector: 'base-monitor',
  templateUrl: './base-monitor.component.html',
  styleUrls: ['./base-monitor.component.scss']
})
export class BaseMonitorComponent implements OnInit {

  public logCountEcharts: any;
  public chartsCondition: any;  //5个图表的查询条件，内置条件，不是页面的筛选条件
  public flagShow: any; //放大图表显示2个图表切换显示(一个图表组件数据清除不干净)

  public dateStart: any; //开始时间
  public dateEnd: any; //结束时间

  private routeParams: any;  // 全局的路由params
  private defaultStatus: any = true; // 默认的选中状态

  constructor(public elementRef: ElementRef,
              public commonService: CommonService,
              public renderer: Renderer,
              public router: Router,
              public route: ActivatedRoute,
              public monitorService: MonitorService) {
    this.chartsCondition = [
      { name: 'CPU使用率', polystyle: 'average', metric: ['CPUUtilization']},
      { name: 'EIP-网络流入带宽', polystyle: 'average', metric: ['InternetInRate']},
      { name: 'EIP-网络流出带宽', polystyle: 'average', metric: ['InternetOutRate']},
      { name: '系统磁盘BPS', polystyle: 'average', metric: ['DiskReadBPS', 'DiskWriteBPS']},
      { name: '系统磁盘IOPS', polystyle: 'average', metric: ['DiskReadIOPS', 'DiskWriteIOPS']},
    ];
    this.logCountEcharts = [null, null, null, null, null];
    this.flagShow = true; //放大图表弹窗中2个echarts插件切换开关
  }


  ngOnInit() {

    // 检测路由的变化
    this.route.queryParams.subscribe((params: Params) => {
      if (params['rang']) {
        this.routeParams = params;
        // 设置 开始时间和结束
        this.setDateTime(params);
        this.requestFn();
      }
    });
  }


  @ViewChild('echarts') echartsDiv: ElementRef;
  // @ViewChild('echart') echartDiv: ElementRef;

  public echartsData: any;

  /**
   * 页面所有的请求
   * @memberof BaseMonitorComponent
   */
  requestFn() {
    for (let i = 0; i < this.chartsCondition.length; i++) {
      this.initData(this.chartsCondition[i].metric, this.chartsCondition[i].polystyle, i);
    }
  }

  /**
   * 初始化数据
   * @memberof BaseMonitorComponent
   */
  public initData(metric, polyStyle, index) {
    let __this = this;
    let params = this.setFiltercondition(metric, polyStyle);

    __this.monitorService.getECSData(__this, params, (res) => {
      __this.detailData(__this, res, index)
    })
  }

  /**
   * 处理返回的数据
   * @param {any} __this 当前组件的this指向
   * @param {any} res 返回结果
   * @param {any} echartsData 处理之后接收的返回值
   * @memberof BaseMonitorComponent
   */
  detailData(__this, res, index) {
    if (res && res.code == 200 && res.success == 1) {
      if (res['rows'].length == 0) {
        __this.logCountEcharts[index] = null;
        return;
      }
      __this.logCountEcharts[index] = __this.detailReturnData(res['rows']);
      __this.logCountEcharts[index].chartName = __this.chartsCondition[index].name
        + '(' + __this.logCountEcharts[index].unit + ')';
    }
  }


  // 处理返回数据
  detailReturnData(arr: any) {
    let xAxisData = [];
    let legendData = [];
    let echartOption = {
      color: INCONFIG.echartLineColor,
      grid:{ left:'20%' },
      chartName: null,    //自定义的，用于知道这个图表的名字
      unit: null,         //自定义， 用于知道这个图表数据的 单位
      tooltip: { trigger: 'axis' },
      legend: { data: [], bottom: '0' },
      xAxis: { type: 'category', boundaryGap: false, data: [] },
      yAxis: { type: 'value', },
      series: []
    }
    for (let i = 0; i < arr.length; i++) {
      let seriesItem = { name: '', type: 'line', data: [], lineStyle: '1px' }
      let item = arr[i];
      let legendUnit = this.returnLegendUnitItem(item.name);
      legendData.push(legendUnit.legend);
      let value = this.monitorService.unitConversion(legendUnit.unit, arr);
      seriesItem.data = value.value[i].datas;
      echartOption.unit = legendUnit.unit;    //设置这个图表的数据单位
      seriesItem.name = legendUnit.legend;
      if (i == 0) {
        for (let sourcesItem of item.sources) {
          xAxisData.push(sourcesItem.dateFormat);
        }
      }
      echartOption.series.push(seriesItem);
    }
    echartOption.legend.data = legendData;
    echartOption.xAxis.data = xAxisData;
    return echartOption;
  }

  // legndName
  returnLegendUnitItem(metricName) {
    let legendName;
    let unit;
    for (let item of balanceDate.ECS) {
      if (item.Metric == metricName) {
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
   * @param {Array<any>} metric 请求的metric
   * @param {string} polyStyle 聚合方式的值
   * @returns 返回搜索条件
   * @memberof BaseMonitorComponent
   */
  setFiltercondition(metric: Array<any>, polyStyle: string) {
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
    return filterCondition;
  }


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
    };
  }


  /**
   * 鼠标移入事件
   * @param i
   */
  public mouseover(i: any, data) {
    if (!data || data.legend.data.length == 0) return;
    this.echartsDiv.nativeElement.children[i].children[0].children[0].style.display = 'inline-block';
    this.echartsDiv.nativeElement.children[i].children[0].children[0].style.right = 0 + 'px';
  };

  /**
   * 鼠标移出
   * @param i
   */
  public mouseout(i: any, data) {
    // if (this.echartsDiv.nativeElement.children[i].children[0].className.indexOf('empty-show') != -1) {
    //   return;
    // }
    if (!data || data.legend.data.length == 0) return;
    this.echartsDiv.nativeElement.children[i].children[0].children[0].style.right = -190 + 'px';
    this.echartsDiv.nativeElement.children[i].children[0].children[0].style.display = 'none';
  };

  public viewValue: any;

  /**
   * 图表点击事件： 点击这个后，出现一个放大的图表
   * @param event
   * @param viewModal   放大的弹窗
   */
  public spanClick(event: any, viewModal: any) {
    this.viewValue = {};
    this.flagShow = !this.flagShow;
    this.viewValue = event;
    this.viewValue.grid.left = '8%';
    this.viewValue.grid.right = '5%';
    viewModal.show();
  };


  /**
   * 最大值、最小值、平局值 三个按钮的处理事件
   * @param {any} i       第几个图表
   * @param {any} item
   * @param {any} e
   * @memberof BaseMonitorComponent
   */
  getpolyStyle(i, item, e) {
    var e = e || window.event;
    var obj = e.target || e.srcElement;
    let clickedDom = obj.id
    // this.isClick = clickedDom;
    //获取查询的条件： 最大值、最小值、平局值
    this.chartsCondition[i].polystyle = clickedDom;
    //查询数据
    this.initData(this.chartsCondition[i].metric, this.chartsCondition[i].polystyle, i);
    this.defaultStatus = false;

    this.commonService.stopBubble(e);
  }


  /**
   * 将数据归类
   * @param {Array<any>} souceArr 后台返回的数据
   * @param {string} category 类别
   * @returns {  BPS:{title:,data:[],legend:[]} }
   * @memberof BaseMonitorComponent
   */
  // classifyMonitorData(souceArr: Array<any>, category: string) {
  //   let classifyData = {};  // 接收 归类好的数据
  //   let data = [];  // 接收
  //   for (let m = 0; m < souceArr.length; m++) {
  //     // 后台返回的数据
  //     let sourceItem = souceArr[m];
  //
  //     for (let i = 0; i < balanceDate.ECS.length; i++) {
  //       // 自定义 的表数据，记录描述和单位
  //       let customItem = balanceDate.ECS[i];
  //       if (sourceItem.metric == customItem.Metric) {
  //         sourceItem.describe = customItem.describe;
  //       }
  //
  //       // 换算值
  //       var conversion = customItem['conversion'] ? customItem['conversion'] : 1;
  //       conversion = customItem['unit'] == 'bit/s' ? conversion * 1024 : conversion;
  //
  //       // 判断返回数据的metric的值 ,判断是基础监控还是操作系统的
  //       if (customItem.Metric == sourceItem.metric && category == customItem['category']) {
  //         // 改变数据值
  //         sourceItem.maximum = (sourceItem.maximum / conversion).toFixed(2);
  //         sourceItem.minimum = (sourceItem.minimum / conversion).toFixed(2);
  //         sourceItem.average = (sourceItem.average / conversion).toFixed(2);
  //
  //         // 判断图表中有几条折线
  //         // identifier 的长度等于 sourceItem.metric的长度 且
  //         if (sourceItem.metric.indexOf(customItem['identifier']) != -1) {
  //           if (customItem['identifier'].length == sourceItem.metric.length) {
  //             // 图表里面只有一条折线
  //             if (!classifyData[sourceItem.metric]) {
  //               // classifyData里面 不存在 key了
  //               classifyData[sourceItem.metric] = {
  //                 title: customItem.describe + '(' + customItem['unit'] + ')',
  //                 data: [sourceItem],
  //                 legend: [customItem.describe],
  //                 metric: [sourceItem.metric],
  //                 unit: customItem['unit'] == 'bit/s' ? 'k' : customItem['unit']
  //               }
  //             } else {
  //               // 如果classifyData里面已经存在 key了
  //               classifyData[sourceItem.metric].data.push(sourceItem);
  //             }
  //
  //           } else {
  //             // 图表里面多条折线
  //
  //             if (classifyData[customItem['title']]) {
  //               // 如果classifyData里面已经存在 key了
  //               classifyData[customItem['title']].data.push(sourceItem);
  //               // classifyData[customItem['title']].metric.push(sourceItem.metric);
  //               // 判断legend是否存在重复的值
  //               let legend = {};
  //               for (let item of classifyData[customItem['title']].legend) {
  //                 legend[item] = 1;
  //               }
  //               if (!legend[customItem.describe]) {
  //                 classifyData[customItem['title']].legend.push(customItem.describe);
  //               }
  //               // 判断metric是否存在重复的值
  //               let metricObj = {};
  //               for (let item of classifyData[customItem['title']].metric) {
  //                 metricObj[item] = 1;
  //               }
  //               if (!metricObj[sourceItem.metric]) {
  //                 classifyData[customItem['title']].metric.push(sourceItem.metric);
  //               }
  //
  //             } else {
  //               classifyData[customItem['title']] = {
  //                 title: customItem['title'] + '(' + customItem['unit'] + ')',
  //                 data: [sourceItem],
  //                 legend: [customItem.describe],
  //                 metric: [sourceItem.metric],
  //                 unit: customItem['unit'] == 'bit/s' ? 'k' : customItem['unit']
  //               }
  //             }
  //           }
  //         }
  //
  //       }
  //     }
  //   }
  //   return classifyData;
  // }


  /**
   * 修改 归类后的echarts数据
   *
   * @param {*} classifyData 归类后的echarts数据
   * @param {string} polyStyle
   * @returns
   * @memberof BaseMonitorComponent
   */
  // changeClassifyMonitorData(classifyData: any, polyStyle: string) {
  //   console.log('修改归类的数据');
  //   console.log(classifyData);
  //   let serieObj;   // 单个的series 的数据
  //   let changeListData = [];   //  接收  改变后的归类数据
  //   let moreLine = {};  // 多条线 接收  改变后series的 data;
  //   // classifyData  是一个对象
  //   for (let key in classifyData) {
  //     let itemValue = classifyData[key];
  //     let newDataList = {
  //       title: itemValue['title'],
  //       legend: itemValue['legend'],
  //       metric: itemValue['metric'],
  //       series: {
  //         'average': [],
  //         'minimum': [],
  //         'maximum': []
  //       },
  //       xAxisData: [],
  //       unit: itemValue['unit'],
  //     };
  //     let dataShow = {
  //       'average': [],
  //       'minimum': [],
  //       'maximum': []
  //     }
  //     for (let i = 0; i < itemValue.data.length; i++) {
  //       let item = itemValue.data[i];
  //       let timeStamp = item.timestamp.slice(item.timestamp.indexOf(' ') + 1, item.timestamp.length);
  //       // 只有一条线
  //       if (itemValue['legend'].length == 1) {
  //
  //         // X轴数据
  //         newDataList.xAxisData.push(timeStamp);
  //         // series 数据
  //         for (var seriesKey in newDataList.series) {
  //           // serieObj.name = itemValue['legend'][0];
  //           // serieObj.data.push(item[seriesKey]);
  //           // newDataList.series[seriesKey] = serieObj;
  //           dataShow[seriesKey].push(item[seriesKey])
  //           newDataList.series[seriesKey] = { name: itemValue['legend'][0], type: 'line', data: dataShow[seriesKey] };
  //         }
  //
  //       } else {
  //         // 多条线
  //         console.log('多条线');
  //         console.log(item);
  //
  //         // 处理后的列表
  //         // newDataList.xAxisData.push(timeStamp);
  //         if (!moreLine[item.describe]) {
  //           // 对象中没有这个项
  //           moreLine[item.describe] = {
  //             xData: [timeStamp]
  //           };
  //           for (var seriesKey in newDataList.series) {
  //             console.log(seriesKey);
  //             moreLine[item.describe][seriesKey] = [item[seriesKey]];
  //           }
  //         } else {
  //           // 对象中已存在
  //           moreLine[item.describe].xData.push(timeStamp);
  //           for (var seriesKey in newDataList.series) {
  //             moreLine[item.describe][seriesKey].push(item[seriesKey]);
  //           }
  //         }
  //         console.log(moreLine);
  //
  //       }
  //     }
  //     if (itemValue['legend'].length > 1) {
  //       for (let item of itemValue['legend']) {
  //         for (var seriesKey in newDataList.series) {
  //           newDataList.series[seriesKey].push({
  //             name: item,
  //             type: 'line',
  //             data: moreLine[item][seriesKey],
  //           });
  //         }
  //         newDataList.xAxisData = moreLine[item].xData;
  //       }
  //     }
  //
  //     changeListData.push(newDataList);
  //   }
  //   return changeListData
  // }


  /**
   * 处理改变后的数据，判断是否有空的数据,并将数据排序
   *
   * @param {Object} rightOrder 正确的图表显示顺序
   * @param {Array<any>} echartsData 改变后的echarts数据
   * @returns 排序后的数据，
   * @memberof BaseMonitorComponent
   */
  // detailEchartsOrder(rightOrder: Object, echartsData: Array<any>) {
  //   let rightEchartsOrder = [];
  //   for (var key in rightOrder) {
  //     for (let item of echartsData) {
  //       if (key === item.title) {
  //         rightEchartsOrder[rightOrder[key]] = item;
  //         delete rightOrder[key];
  //       }
  //     }
  //   }
  //   if (JSON.stringify(rightOrder) != '{}') {
  //     //   不是空对象
  //     for (var key in rightOrder) {
  //       rightEchartsOrder[rightOrder[key]] = {
  //         title: key,
  //         data: []
  //       };
  //     }
  //   }
  //   return rightEchartsOrder
  // }


}

