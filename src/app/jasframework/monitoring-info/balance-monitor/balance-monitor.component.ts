import { objectify } from 'tslint/lib/utils';
import { colorSets } from '@swimlane/ngx-charts/release/utils';
import { NgaModule } from './../../../theme/nga.module';
import { CommonService } from './../../../core/common-service/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { INCONFIG } from './../../../core/global'
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { CommonRequestService } from './../../../core/common-service/common-request.service';
import { balanceDate } from './data';
import { MonitorService } from './../shared/monitor.service'

@Component({
  selector: 'balance-monitor',
  templateUrl: './balance-monitor.component.html',
  styleUrls: ['./balance-monitor.component.scss']
})

export class BalanceMonitorComponent implements OnInit {
  public isClick: any;  // 时间搜索条件被点击
  public isSelectedDate: any = false;  // 点击自定义，展示被选中的时间，是否显示
  public date: any;  // 点击自定义，被选中的时间
  public dateEnd: Date; // 自定义选择   结束时间
  public dateStart: Date; // 自定义选择 开始时间
  public dateStartShow: any = new Date(); // 自定义开始时间，在页面展示
  public dateEndShow: any; // 自定义结束时间，在页面展示
  public maxDate: any; // 最大的时间
  private zn: any;  // 日历区域配置属性的
  public TrafficRXNewArr: any = [];//端口流入;
  public TrafficTXNewArr: any = [];//端口流出;
  public NewConnectionArr: any = [];//端口新建连接数;
  public PacketRXArr: any = [];//端口流入数据包数
  public PacketTXArr: any = [];//端口流出数据包数
  public ActiveConnectionArr: any = [];//端口活跃连接数
  public InactiveConnectionArr: any = [];//端口非活跃连接数
  public dropDownPort: any; //端口号的数据
  public metricArr: any = []; //
  public viewValue: any;//弹出框数据
  public viewTitle: any;//弹出框标题
  public selectServerName: any;//实例值
  public selectPort: any;//端口号值
  public valueList: any;//初始化的列表值
  public appList: any = [];//列表
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public commonService: CommonService,
    public commonRequestMethodService: CommonRequestMethodService,
    public commonRequestService: CommonRequestService,
    public confirmationService: ConfirmationService,
    public elementRef: ElementRef,
    public monitorService: MonitorService,

  ) {
    Object.assign(this, { balanceDate });
    this.zn = INCONFIG.zn;
  };
  ngOnInit() {
    this.modalHidden();
    this.searchData();
    this.setMaxMinDate();
    this.getParams();
  };
  @ViewChild('TrafficRXNew')
  TrafficRXNew: ElementRef;
  @ViewChild('TrafficTXNew')
  TrafficTXNew: ElementRef;
  @ViewChild('NewConnection')
  NewConnection: ElementRef;
  @ViewChild('PacketRX')
  PacketRX: ElementRef;
  @ViewChild('PacketTX')
  PacketTX: ElementRef;
  @ViewChild('ActiveConnection')
  ActiveConnection: ElementRef;
  @ViewChild('activeConnection')
  activeConnection: ElementRef;

  /**
   * 端口流入
   * 鼠标移入事件
   * @param i
   */
  public mouseover(i: any) {
    this.TrafficRXNew.nativeElement.children[i].children[0].style.display = 'block';

  };
  /**
   * 端口流入
   * 鼠标移出
   * @param i
   */
  public mouseout(i: any) {
    this.TrafficRXNew.nativeElement.children[i].children[0].style.display = 'none';
  };
  /**
 * 端口流入
 * 图标点击事件
 * @param i
 * @param event
 * @param viewModal
 */
  public spanClick(i: any, event: any, viewModal: any, title: any) {
    this.clickCount(i, event, viewModal, title)

  };
  /**
   * 端口流出鼠标移入
   */
  public traMouseover(i: any) {
    this.TrafficTXNew.nativeElement.children[i].children[0].style.display = 'block';
  };
  /**
   * 端口流出移出
   * @param i
   */
  public traMouseout(i: any) {
    this.TrafficTXNew.nativeElement.children[i].children[0].style.display = 'none';
  };
  /**
   * 端口流出
   */
  public traSpanClick(i: any, event: any, viewModal: any, title: any) {
    this.clickCount(i, event, viewModal, title)
  };

  /**
   *端口新建连接数

   */

  public newMouseover(i: any) {
    this.NewConnection.nativeElement.children[i].children[0].style.display = 'block';
  };
  /**
   * 端口新建连接数
   * @param i
   */
  public newMouseout(i: any) {
    this.NewConnection.nativeElement.children[i].children[0].style.display = 'none';
  };
  /**
 * 端口新建连接数
 *
 * @param i
 * @param event
 * @param viewModal
 */
  public newSpanClick(i: any, event: any, viewModal: any, title: any) {
    this.clickCount(i, event, viewModal, title)

  };

  /**
   * 端口流入数据包数
   * 鼠标移入
   */
  public pacMouseover(i: any) {
    this.PacketRX.nativeElement.children[i].children[0].style.display = 'block';
  }
  /**端口流出数据包数
    * 鼠标移入
   *
   */
  public pacMouseout(i: any) {
    this.PacketRX.nativeElement.children[i].children[0].style.display = 'none';
  };
  /**
   * 端口流出数据包数点击
   */
  public pacSpanClick(i: any, event: any, viewModal: any, title: any) {
    this.clickCount(i, event, viewModal, title)
  }

  /**端口流出数据包数
   * 鼠标移入
   *
   */
  public packMouseover(i) {
    this.PacketTX.nativeElement.children[i].children[0].style.display = 'block';
  };
  /**
   * 端口流出数据包数移出
   */
  public packMouseout(i: any) {
    this.PacketTX.nativeElement.children[i].children[0].style.display = 'none';
  };
  /**
 * 端口流出数据包数点击
 */
  public packSpanClick(i: any, event: any, viewModal: any, title: any) {
    this.clickCount(i, event, viewModal, title)
  }
  /**
   * 端口活跃连接数 鼠标移入
   */
  public actMouseover(i) {
    this.ActiveConnection.nativeElement.children[i].children[0].style.display = 'block';
  }
  /**
   * 端口活跃连接数 鼠标移出
   */
  public actMouseout(i) {
    this.ActiveConnection.nativeElement.children[i].children[0].style.display = 'none';
  }
  /**
   * 端口活跃连接数 鼠标点击
   */
  public actSpanClick(i: any, event: any, viewModal: any, title: any) {
    this.clickCount(i, event, viewModal, title)
  }

  /**
   * 端口活跃连接数 鼠标移入
   */
  public inMouseover(i) {
    this.activeConnection.nativeElement.children[i].children[0].style.display = 'block';
  }
  /**
   * 端口活跃连接数 鼠标移出
   */
  public inMouseout(i) {
    this.activeConnection.nativeElement.children[i].children[0].style.display = 'none';
  }
  /**
   * 端口活跃连接数 鼠标点击
   */
  public inSpanClick(i: any, event: any, viewModal: any, title: any) {
    this.clickCount(i, event, viewModal, title)
  }

  /**
* 弹出框调用方法
* @param i
* @param event
* @param modal
* @param title
*/
  public clickCount(i, event, modal, title) {
    this.viewValue = {};
    this.viewTitle = {};
    modal.show();
    this.viewValue = event;
    this.viewTitle = title.innerHTML;
    this.viewValue.num = "8%";
  }



  /**
 * 设置日历的最大和最小可选择日期
 */
  public setMaxMinDate() {
    let today = new Date();
    let todayFormat = this.commonService.formatDate(today).formcatDate;
    let todayFormatTimes = todayFormat + ' 24:00';
    this.maxDate = new Date(todayFormatTimes);
  };
  datePicker(e) {
    var e = e || window.event;
    var obj = e.target || e.srcElement;
    // 当前点击的元素id值
    let clickedDom = obj.id;
    if (clickedDom == '') {
      return;
    } else if (clickedDom != 'self' && this.isSelectedDate) {
      // 当点击不是自定义时
      this.isSelectedDate = false;
    }
    this.isClick = clickedDom;
    // this.dateStart = new Date();
    this.dateRang(clickedDom);
    this.commonService.stopBubble(e);
  };
  /**
* 给body设置click事件，通过冒泡使弹窗消失
*/
  public modalHidden() {
    let _this = this;
    let body = document.getElementsByTagName('body')[0];
    this.commonService.addEvent(body, 'click', function (event) {
      // 是日历的弹窗消失
      if (!_this.isClick) return;
      if (_this.isClick && _this.isClick == 'self') {
        _this.getRouteParams();
      }
    }, false);
  };
  /**
 * 取消冒泡
 * @param e 事件对象
 */
  stopBubble(e) {
    this.commonService.stopBubble(e);
  }

  /**
    * 获取当前的路由参数并设置日期区间到路由参数
    */
  public getRouteParams() {
    // 路由参数
    let routeParam = this.route.params['value'];
    let routeQueryParams = this.route.queryParams['value'];
    let date = routeParam['rang'] ? routeParam['rang'] : routeQueryParams['rang']; //当前路由的时间范围
    let currentYear = new Date().getFullYear(); //年
    let rep = new RegExp(currentYear.toString());
    if (!routeParam['rang'] && !routeQueryParams['rang']) {
      // 当没有路由参数rang（即没有选择时间范围）
      this.isClick = 'one';
    } else {
      if (date == '1h') {
        this.isClick = 'one';
      } else if (date == '3h') {
        this.isClick = 'three';
      } else if (date == '6h') {
        this.isClick = 'six';
      } else if (rep.test(date)) {
        this.isClick = 'self-init';
        this.isSelectedDate = true;
        // 匹配 ， 前后的内容
        let index = date.indexOf(',');
        this.dateStart = new Date(date.slice(0, index));
        this.dateEnd = new Date(date.slice(index + 1, date.length));
        this.isClick = this.commonService.formatDate(this.dateStart).formatTime + ',' + this.commonService.formatDate(this.dateEnd).formatTime;
      }
    }

    this.dateRang(this.isClick);
  };
  /**
* 确定当前选择的时间范围
* @param clickedDom 当前选择的时间范围
*/

  public dateRang(clickedDom: string) {
    this.dateEndShow = this.commonService.formatDate(this.dateEnd).formatTime;
    if (clickedDom == 'self') return;
    // 获取原本的路由参数
    let routeParam = this.route.params['value'];
    let routeQueryParams = this.route.queryParams['value'];
    var obj = $.extend({}, routeParam, routeQueryParams);
    // 取路由的地址，不要参数
    var url = this.router.url.replace(/(;|\?)\S+/, '');
    switch (clickedDom) {
      case 'one':
        this.dateStart = new Date(new Date().getTime() - 3600000 * 1);
        obj.rang = '1h';
        this.dateRequeset(url, obj);
        break;
      case 'three':
        this.dateStart = new Date(new Date().getTime() - 3600000 * 3);
        obj.rang = '3h';
        this.dateRequeset(url, obj);
        break;
      case 'six':
        this.dateStart = new Date(new Date().getTime() - 3600000 * 6);
        obj.rang = '6h';
        this.dateRequeset(url, obj);
        break;
      default:
        obj.rang = clickedDom;
        this.dateStartShow = this.commonService.formatDate(this.dateStart).formatTime;
        this.dateEndShow = this.commonService.formatDate(this.dateEnd).formatTime;
        this.router.navigate([url], { queryParams: obj });
        this.getDataList();
    }
  };
  /**
   * 页面初始化的传的页面值
   */
  getDataList() {
    this.initLoginListData(this.metricArr[0])
    this.initLoginListData(this.metricArr[1])
    this.initLoginListData(this.metricArr[2])
    this.initLoginListData(this.metricArr[3])
    this.initLoginListData(this.metricArr[4])
    this.initLoginListData(this.metricArr[5])
    this.initLoginListData(this.metricArr[6])
  }
  dateRequeset(url, obj) {
    this.dateEnd = new Date();
    this.dateStartShow = this.commonService.formatDate(this.dateStart).formatTime;
    this.dateEndShow = this.commonService.formatDate(this.dateEnd).formatTime;
    this.router.navigate([url], { queryParams: obj });
    this.getDataList();
  }
  /**
  * 选择开始时间
  * @param e 当前选择的 开始时间
  */
  selectStartDate(e) {
    this.dateStartShow = this.commonService.formatDate(e).formatTime;
  }
  /**
   * 选择结束时间
   * @param e 当前选择的结束时间
   */
  selectEndDate(e) {
    this.dateEndShow = this.commonService.formatDate(e).formatTime;
  }
  /**
  * 用户选择完时间，点击确定
  */
  sure(e) {
    // 显示当前选择时间
    this.isSelectedDate = true;
    // 时间选择弹窗消失
    this.isClick = 'date-picker';
    // 阻止冒泡
    this.commonService.stopBubble(e);
    let msDateEnd = this.commonService.formatDate(this.dateEnd).times;
    let msDateStart = this.commonService.formatDate(this.dateStart).times;
    // 时间范围
    let rang = this.commonService.formatDate(this.dateStart).formatTime + ',' + this.commonService.formatDate(this.dateEnd).formatTime;
    this.dateRang(rang);
  };
  public dropDownServerNames: any;//下拉框数据
  /**
   * 实例下拉框的内容
   */
  public searchData() {
    let param = {
      'pageNum': -1
    };
    let __this = this;
    this.commonRequestService.getAppNameList(param, __this, function (res) {
      if (res.success == 1) {
        __this.appList = [];
        for (var i = 0; i < res['rows'].length; i++) {
          __this.appList.push(res['rows'][i].objectId);
        }
      }
      let params = {

        'filters': [
          { "itemKey": "typeName", "filter": "contain", "itemValue": "slb" },
          { "itemKey": "appId", "filter": "term", "itemValue": __this.appList }
        ]
      };
      let url = '/monitor/domain/v2/queryList';
      __this.monitorService.searchData(__this, url, params, function (res) {
        if (res && res.code == 200 && res.success == 1) {
          __this.changeData(res['rows']);
          __this.dropDownServerNames = res['rows'];
          __this.selectServerName = __this.dropDownServerNames[0].value;
          __this.getList(__this.selectServerName);
        }
      })
    })
  };
  /**
   * 实例下拉框
   * 改变下拉框机构
   */
  public changeData(arr: any) {
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var data = {
        label: item.instanceAlias,
        value: item.instanceId,
      }
      arr[i] = data;
    }
  };
  /**
   * 第一个下拉框
   *下拉框change事件
   */

  public onChangeService(event: any) {

    this.selectServerName = event.value;
    this.getList(event.value);
    // this.getDataList();
  };
  /**
   * 端口号下列事件
   *
   */
  public onChangePort(event) {
    this.selectPort = event.value;
    this.getDataList();
  };
  /**
   * 端口号获得数据
   * @param event
   */
  public getList(event) {
    let __this = this;
    let url = '/monitor/slb/v2/getValues';
    let all = __this.selectServerName;
    let params = {
      'filters': [{ "itemKey": "instanceId", "filter": "contain", "itemValue": event }],
      "fields": "port",

    };
    __this.monitorService.searchData(__this, url, params, function (res) {
      if (res && res.code == 200 && res.success == 1) {
        __this.portDownchange(res['rows'][0].values)
        __this.dropDownPort = res['rows'][0].values

        __this.selectPort = __this.selectServerName;
        __this.dropDownPort.unshift({ label: 'All', value: all });
      }
      __this.getRouteParams();

    })
  };
  /**
   * 改变端口号的数据
   */
  public portDownchange(arr: any) {
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];

      var data = {
        label: item,
        value: item,
        // instanceId: item.instanceId
      }
      arr[i] = data;
    }
  };

  /**
   *
   */
  public searchCondition() {
    let value;
    value = {
      'filters': [
        { 'itemKey': 'instanceId', 'filter': 'contain', 'itemValue': this.selectServerName },
      ]
    };
    if (this.selectPort == this.dropDownPort[0].value) {
      value = {
        'filters': [
          { 'itemKey': 'instanceId', 'filter': 'term', 'itemValue': this.selectServerName },
        ]
      }
    } else if (this.selectPort !== this.dropDownPort[0].value) {
      value = {
        'filters': [
          { 'itemKey': 'instanceId', 'filter': 'term', 'itemValue': this.selectServerName },
          { 'itemKey': 'port', 'filter': 'term', 'itemValue': this.selectPort },
        ]
      }
    };
    return value;
  };

  /**
   * 初始化值
   */
  public initLoginListData(event?: any, arr?: any) {
    this.TrafficRXNewArr = [];//端口流入;
    this.TrafficTXNewArr = [];//端口流出;
    this.NewConnectionArr = [];//端口新建连接数;
    this.PacketRXArr = [];//端口流入数据包数
    this.PacketTXArr = [];//端口流出数据包数
    this.ActiveConnectionArr = [];//端口活跃连接数
    this.InactiveConnectionArr = [];//端口非活跃连接数
    let dateEnd = this.dateEndShow ? this.dateEndShow : this.dateEnd;
    let dateStart = this.dateStartShow ? this.dateStartShow : this.dateStart;
    let startTime = this.commonService.formatDate(dateStart).times;
    let endTime = this.commonService.formatDate(dateEnd).times;
    let frequency = INCONFIG.setSamplingFrequency(startTime, endTime).statisticsInterval;
    let statisticsType = INCONFIG.setSamplingFrequency(startTime, endTime).statisticsType;
    let __this = this;
    let url = '/monitor/slb/v2/statistics';
    let params = {
      'dataFieldsKeys': ['average'],
      'filters': __this.searchCondition().filters,
      "statisticsInterval": frequency,
      "pageNum": 1,
      "statisticsEnd": endTime,
      "statisticsBegin": startTime,
      "statisticsType": statisticsType,
      "metricName": [event],
      'metricFieldKey': 'port'

    };
    __this.monitorService.searchData(__this, url, params, function (res) {
      if (res && res.code == 200 && res.success == 1) {
        __this.valueList = res['rows'][0];
        __this.getValue(__this.valueList);

      }

    })
  };

  /**
   * 处理后台数据
   */
  public getValue(obj: any) {
    if (this.metricArr[0] == obj.name) {
      obj.unit = balanceDate.Balancer[0]['unit'];
      obj.describe = balanceDate.Balancer[0]['describe'];
      this.getTrafficRXNew(obj);
    }
    else if (this.metricArr[1] == obj.name) {
      obj.unit = balanceDate.Balancer[1]['unit'];
      obj.describe = balanceDate.Balancer[1]['describe'];
      this.getTrafficTXNew(obj);
    }
    else if (this.metricArr[2] == obj.name) {
      obj.unit = balanceDate.Balancer[2]['unit'];
      obj.describe = balanceDate.Balancer[2]['describe'];
      this.getNewConnection(obj);
    } else if (this.metricArr[3] == obj.name) {
      obj.unit = balanceDate.Balancer[3]['unit'];
      obj.describe = balanceDate.Balancer[3]['describe'];
      this.getPacketRX(obj);
    } else if (this.metricArr[4] == obj.name) {
      obj.unit = balanceDate.Balancer[4]['unit'];
      obj.describe = balanceDate.Balancer[4]['describe'];
      this.getPacketTX(obj);
    } else if (this.metricArr[5] == obj.name) {
      obj.unit = balanceDate.Balancer[5]['unit'];
      obj.describe = balanceDate.Balancer[5]['describe'];
      this.getActiveConnection(obj);
    } else if (this.metricArr[6] == obj.name) {
      obj.unit = balanceDate.Balancer[6]['unit'];
      obj.describe = balanceDate.Balancer[6]['describe'];
      this.InactiveConnection(obj);
    }

  };
  /**
   * 端口非活跃连接数
   */
  public InactiveConnection(obj?: any) {
    this.echartsItem(obj, this.InactiveConnectionArr);
  };
  /**
   * 端口活跃连接数
   */
  public getActiveConnection(obj?: any) {
    this.echartsItem(obj, this.ActiveConnectionArr);
  };
  /**
   * 端口流出数据包数
   */
  public getPacketTX(obj?: any) {
    this.echartsItem(obj, this.PacketTXArr);
  };

  /**
   * 端口流入数据包数
   */
  public getPacketRX(obj?: any) {
    this.echartsItem(obj, this.PacketRXArr);
  };
  /**
   * 端口新建连接数
   */
  public getNewConnection(obj?: any) {
    this.echartsItem(obj, this.NewConnectionArr)
  };
  /**
 * 端口流出
 * @param obj
 */
  public getTrafficTXNew(obj?: any) {
    this.TrafficEcharts(obj, this.TrafficTXNewArr)
  };

  /**
   * 端口流入
   * @param obj
   */
  public getTrafficRXNew(obj?: any) {
    this.TrafficEcharts(obj, this.TrafficRXNewArr)

  };
  /**
   * echarts 的公共配置
   * @param obj
   * @param arr
   */
  public echartsItem(obj: any, arr: any) {
    var dateArr = [];//横坐标的值
    var dateArr1 = [];//纵坐标的值
    var lineData1 = [];
    var lineData2 = [];
    var data;
    let oneName;
    let twoName;
    let lineStyle;
    let itemStyle;
    lineStyle = INCONFIG.setColorStatus().buleColor.lineStyle;
    itemStyle = INCONFIG.setColorStatus().buleColor.itemStyle;
    for (var i = 0; i < obj.sources.length; i++) {

      if (obj.sources[i].name == '80') {
        oneName = '80';
        for (var j = 0; j < obj.sources[i].sources.length; j++) {
          dateArr.push(obj.sources[i]['sources'][j].dateFormat);
          lineData1.push(obj.sources[i]['sources'][j].data);
        }
      };
      if (obj.sources[i].name == '443') {

        twoName = '443';
        for (var k = 0; k < obj.sources[i].sources.length; k++) {
          dateArr1.push(obj.sources[i]['sources'][k].dateFormat);
          lineData2.push(obj.sources[i]['sources'][k].data);

        }
      };
    };
    if (dateArr.length != 0) {
      data = dateArr;
    } else {
      data = dateArr1;
    }
    var objItem = {
      num: "15%",
      title: obj.describe + '(' + obj.unit + ')',
      data: [oneName ? oneName : '', twoName ? twoName : ''],
      name: obj.name,
      xAxis: {
        data: data
      },

      series: [
        {
          name: oneName ? oneName : '',
          type: 'line',
          data: lineData1 ? lineData1 : '',
          lineStyle,
          itemStyle,

        },
        {
          name: twoName ? twoName : '',
          type: 'line',
          data: lineData2 ? lineData2 : '',
          lineStyle: {
            normal: {
              color: '#F7A35C',  //连线颜色
              width: '1',
            }
          },
          itemStyle: {
            normal: {
              color: '#F7A35C' //图标颜色
            }
          },

        },
      ]
    };
    arr.push(objItem);
  };

  /**
   * 端口流入流出的
   * echarts 的公共配置
   */
  public TrafficEcharts(obj: any, arr: any) {
    let dateArr = [];//横坐标的值
    let dateArr1 = [];//纵坐标的值
    let lineData1;
    let lineData2;
    let data;
    let oneName;
    let twoName;
    let unit;
    let lineStyle;
    let itemStyle;
    lineStyle = INCONFIG.setColorStatus().buleColor.lineStyle;
    itemStyle = INCONFIG.setColorStatus().buleColor.itemStyle;
    if (obj.sources.length == 1) {
      if (obj.sources[0].name == '80') {
        lineData1 = this.monitorService.unitConversion(obj.unit, obj.sources).value[0].datas;
      } else if (obj.sources[0].name == '443') {
        lineData2 = this.monitorService.unitConversion(obj.unit, obj.sources).value[0].datas;
      }
    } else {
      lineData1 = this.monitorService.unitConversion(obj.unit, obj.sources).value[1].datas;
      lineData2 = this.monitorService.unitConversion(obj.unit, obj.sources).value[0].datas;
    }

    unit = this.monitorService.unitConversion(obj.unit, obj.sources).unit;

    for (var i = 0; i < obj.sources.length; i++) {
      if (obj.sources[i].name == '80') {
        oneName = '80';
        for (var j = 0; j < obj.sources[i].sources.length; j++) {
          dateArr.push(obj.sources[i]['sources'][j].dateFormat);
        }
      };
      if (obj.sources[i].name == '443') {
        twoName = '443';
        for (var k = 0; k < obj.sources[i].sources.length; k++) {
          dateArr1.push(obj.sources[i]['sources'][k].dateFormat);
        }
      };
    };
    if (dateArr.length != 0) {
      data = dateArr;
    } else {
      data = dateArr1;
    }
    var objItem = {
      num: "15%",
      title: obj.describe + '(' + unit + ')',
      data: [oneName ? oneName : '', twoName ? twoName : ''],
      name: obj.name,
      xAxis: {
        data: data
      },
      series: [
        {
          name: oneName ? oneName : '',
          type: 'line',
          data: lineData1 ? lineData1 : '',
          lineStyle,
          itemStyle,
        },
        {
          name: twoName ? twoName : '',
          type: 'line',
          data: lineData2 ? lineData2 : '',
          lineStyle: {
            normal: {
              color: '#F7A35C',  //连线颜色
              width: '1',
            }
          },
          itemStyle: {
            normal: {
              color: '#F7A35C' //图标颜色
            }
          },
        },
      ]
    };
    arr.push(objItem);
  };


  /**
   *从列表得到metric
   */
  getParams() {
    this.metricArr = [];
    for (let i = 0; i < balanceDate.Balancer.length; i++) {
      let item = balanceDate.Balancer[i];
      this.metricArr.push(item.Metric);
    };
  };

}
