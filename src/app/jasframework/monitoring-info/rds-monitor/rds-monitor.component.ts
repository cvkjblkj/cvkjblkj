import { join } from 'path';
import { NgaModule } from './../../../theme/nga.module';
import { CommonService } from './../../../core/common-service/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { INCONFIG } from './../../../core/global';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { CommonRequestService } from './../../../core/common-service/common-request.service';
import { balanceDate } from './../balance-monitor/data';
import { MonitorService } from './../shared/monitor.service';

@Component({
  selector: 'rds-monitor',
  templateUrl: './rds-monitor.component.html',
  styleUrls: ['./rds-monitor.component.scss',],
})
export class RdsMonitorComponent implements OnInit {
  public isClick: any;  // 时间搜索条件被点击
  public isSelectedDate: any = false;  // 点击自定义，展示被选中的时间，是否显示
  public date: any;  // 点击自定义，被选中的时间
  public maxSelectedLabels: number = 0;
  public defaultLabel: string = "列表项";
  public dateEnd: Date; // 自定义选择   结束时间
  public dateStart: Date; // 自定义选择 开始时间
  public dateStartShow: any = new Date(); // 自定义开始时间，在页面展示
  public dateEndShow: any; // 自定义结束时间，在页面展示
  public maxDate: any; // 最大的时间
  private zn: any;  // 日历区域配置属性的
  public DiskUsageArr: any = []; //磁盘使用率
  public IOPSUsageArr: any = [];//IOPS使用率
  public ConnectionUsageArr: any = [];//连接数使用率
  public CpuUsageArr: any = [];//CPU使用率
  public MemoryUsageArr: any = [];//内存使用率
  public MySQL_NetworkInNewArr: any = [];//MySQL网络入流量
  public MySQL_NetworkOutNewArr: any = [];//MySQL网络出流量
  public appList: any = []; //应用列表
  public selectServerName: any;//实例下拉框选中数据
  public dropDownServerNames: any;//下拉框数据
  public valueItem: any = [];
  public valueList: any;
  public metricArr: any = [];
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
  }
  ngOnInit() {
    this.modalHidden();

    this.setMaxMinDate();
    this.searchData();
    this.getParams();

  }
  @ViewChild('DiskUsage')
  DiskUsage: ElementRef;
  @ViewChild('IOPSUsage')
  IOPSUsage: ElementRef;
  @ViewChild('ConnectionUsage')
  ConnectionUsage: ElementRef;
  @ViewChild('CpuUsage')
  CpuUsage: ElementRef;
  @ViewChild('MemoryUsage')
  MemoryUsage: ElementRef;
  @ViewChild('MySQL_NetworkInNew')
  MySQL_NetworkInNew: ElementRef;
  @ViewChild('MySQL_NetworkOutNew')
  MySQL_NetworkOutNew: ElementRef;
  public viewTitle: any;//标题
  /**
   * 写入网络带宽
   * 鼠标移入事件
   * @param i
   */
  public DiskUsageover(i: any) {
    this.DiskUsage.nativeElement.children[i].children[0].style.display = 'block';

  };
  /**写入网络带宽
   * 鼠标移出
   * @param i
   */
  public DiskUsageout(i: any) {
    this.DiskUsage.nativeElement.children[i].children[0].style.display = 'none';
  };
  public viewValue: any;
  /**
   * 写入网络带宽图标点击事件
   * @param i
   * @param event
   * @param viewModal
   */
  public DiskUsageClick(i: any, event: any, viewModal: any, title: any) {
    this.clickCount(i, event, viewModal, title)
  };

  /**
   * 读取网络带宽
   * 鼠标移入事件
   * @param i
   */
  public IOPSUsageover(i: any) {
    this.IOPSUsage.nativeElement.children[i].children[0].style.display = 'block';

  };
  /**读取网络带宽
   * 鼠标移出
   * @param i
   */
  public IOPSUsageout(i: any) {
    this.IOPSUsage.nativeElement.children[i].children[0].style.display = 'none';
  };

  /**
   * 读取网络带宽
   * @param i
   * @param event
   * @param viewModal
   */
  public IOPSUsageClick(i: any, event: any, viewModal: any, title: any) {
    this.clickCount(i, event, viewModal, title)
  };
  /**
   * 操作失败数
   * 鼠标移入事件
   * @param i
   */
  public ConnectionUsageover(i: any) {
    this.ConnectionUsage.nativeElement.children[i].children[0].style.display = 'block';

  };
  /**操作失败数
   * 鼠标移出
   * @param i
   */
  public ConnectionUsageout(i: any) {
    this.ConnectionUsage.nativeElement.children[i].children[0].style.display = 'none';
  };

  /**
   * 操作失败数
   * @param i
   * @param event
   * @param viewModal
   */
  public ConnectionUsageClick(i: any, event: any, viewModal: any, title: any) {
    this.clickCount(i, event, viewModal, title)
  };

  /**
 * 已用连接数百分比
 * 鼠标移入事件
 * @param i
 */
  public CpuUsageover(i: any) {
    this.CpuUsage.nativeElement.children[i].children[0].style.display = 'block';

  };
  /**已用连接数百分比
   * 鼠标移出
   * @param i
   */
  public CpuUsageout(i: any) {
    this.CpuUsage.nativeElement.children[i].children[0].style.display = 'none';
  };

  /**
   * 已用连接数百分比
   * @param i
   * @param event
   * @param viewModal
   */
  public CpuUsageClick(i: any, event: any, viewModal: any, title: any) {
    this.clickCount(i, event, viewModal, title)
  };

  /**
* 已用连接数百分比
* 鼠标移入事件
* @param i
*/
  public Memorymouseover(i: any) {
    this.MemoryUsage.nativeElement.children[i].children[0].style.display = 'block';

  };
  /**已用连接数百分比
   * 鼠标移出
   * @param i
   */
  public Memorymouseout(i: any) {
    this.MemoryUsage.nativeElement.children[i].children[0].style.display = 'none';
  };

  /**
   * 已用连接数百分比
   * @param i
   * @param event
   * @param viewModal
   */
  public MemoryspanClick(i: any, event: any, viewModal: any, title: any) {
    this.clickCount(i, event, viewModal, title)
  };

  /**
* 写入带宽使用率
* 鼠标移入事件
* @param i
*/
  public MySQL_NetworkInNewover(i: any) {
    this.MySQL_NetworkInNew.nativeElement.children[i].children[0].style.display = 'block';

  };
  /**写入带宽使用率 6
   * 鼠标移出
   * @param i
   */
  public MySQL_NetworkInNewout(i: any) {
    this.MySQL_NetworkInNew.nativeElement.children[i].children[0].style.display = 'none';
  };

  /**
   * 写入带宽使用率
   * @param i
   * @param event
   * @param viewModal
   */
  public MySQL_NetworkInNewClick(i: any, event: any, viewModal: any, title: any) {
    this.clickCount(i, event, viewModal, title)
  }

  /**  7
* 写入带宽使用率
* 鼠标移入事件
* @param i
*/
  public MySQL_NetworkOutNewover(i: any) {
    this.MySQL_NetworkOutNew.nativeElement.children[i].children[0].style.display = 'block';

  };
  /**写入带宽使用率
   * 鼠标移出
   * @param i
   */
  public MySQL_NetworkOutNewout(i: any) {
    this.MySQL_NetworkOutNew.nativeElement.children[i].children[0].style.display = 'none';
  };

  /**
   * 写入带宽使用率
   * @param i
   * @param event
   * @param viewModal
   */
  public MySQL_NetworkOutNewClick(i: any, event: any, viewModal: any, title: any) {
    this.clickCount(i, event, viewModal, title)
  };
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



  AfterViewInit() {

  }

  /**
 * 自定义选择时间
 */
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

        // this.router.navigate([this.url],{ queryParams：{ rang: 7 }});
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
        this.getDataList()
    }
  };
  /**
  * 改变路由和时间区间
  * @param url 路由
  * @param obj 时间区间
  // tslint:disable-next-line:jsdoc-format
  */
  dateRequeset(url, obj) {
    this.dateEnd = new Date();
    this.dateStartShow = this.commonService.formatDate(this.dateStart).formatTime;
    this.dateEndShow = this.commonService.formatDate(this.dateEnd).formatTime;
    this.router.navigate([url], { queryParams: obj });
    this.getDataList()
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

  /**
   * 实例下拉框的内容
   */
  public searchData() {
    let __this = this;
    let params = {
      'filters': [
        { "itemKey": "typeName", "filter": "contain", "itemValue": "rds" },
      ]
    };
    let url = '/monitor/domain/v2/queryList'
    __this.monitorService.searchData(__this, url, params, function (res) {
      if (res && res.code == 200 && res.success == 1) {
        __this.changeData(res['rows'])
        __this.dropDownServerNames = res['rows']
        __this.selectServerName = __this.dropDownServerNames[0].value;
      }
      __this.getRouteParams();
    })
  };
  /**
   * 改变下拉框机构
   */
  public changeData(arr: any) {
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var data = {
        label: item.instanceAlias,
        value: item.instanceId,
        // instanceId: item.instanceId
      }
      arr[i] = data;
    }
  };
  public getDataList() {

    this.initLoginListData(this.metricArr[0])
    this.initLoginListData(this.metricArr[1])
    this.initLoginListData(this.metricArr[2])
    this.initLoginListData(this.metricArr[3])
    this.initLoginListData(this.metricArr[4])
    this.initLoginListData(this.metricArr[5])
    this.initLoginListData(this.metricArr[6])
  };
  /**
   *下拉框change事件
   */
  public dropDownItem: any;
  public onChangeService(event: any) {
    this.dropDownItem = event.value;
    this.getDataList();
  };
  public searchCondition() {
    let value = {
      'filters': [
        { 'itemKey': 'instanceId', 'filter': 'contain', 'itemValue': this.selectServerName },
      ]
    };
    return value;
  };

  public initLoginListData(event) {
    //
    this.DiskUsageArr = [];
    this.IOPSUsageArr = [];
    this.ConnectionUsageArr = [];
    this.CpuUsageArr = [];
    this.MemoryUsageArr = [];
    this.MySQL_NetworkInNewArr = [];
    this.MySQL_NetworkOutNewArr = [];
    let __this = this;
    let url = '/monitor/rds/v2/statistics';

    let dateEnd = this.dateEndShow ? this.dateEndShow : this.dateEnd;
    let dateStart = this.dateStartShow ? this.dateStartShow : this.dateStart;
    let startTime = this.commonService.formatDate(dateStart).times;
    let endTime = this.commonService.formatDate(dateEnd).times;
    let frequency = INCONFIG.setSamplingFrequency(startTime, endTime, 'RDS').statisticsInterval;

    let statisticsType = INCONFIG.setSamplingFrequency(startTime, endTime).statisticsType;
    let params = {
      "dataFieldsKeys": ["average"],
      'filters': __this.searchCondition().filters,
      "statisticsInterval": frequency,
      "pageNum": 1,
      "statisticsEnd": endTime,
      "statisticsBegin": startTime,
      "statisticsType": statisticsType,
      "metricName": [event],
    };
    __this.monitorService.searchData(__this, url, params, function (res) {
      if (res && res.code == 200 && res.success == 1) {
        __this.valueList = res['rows'];
        __this.getValue(__this.valueList);
      }
    })
  };
  /**
   *
   */
  public getValue(obj) {

    if (this.metricArr[0] == obj[0].name) {
      obj[0].unit = balanceDate.RDS[0]['unit'];
      obj[0].describe = balanceDate.RDS[0]['describe'];

      this.getDiskUsage(obj);
    }
    else if (this.metricArr[1] == obj[0].name) {
      obj[0].unit = balanceDate.RDS[1]['unit'];
      obj[0].describe = balanceDate.RDS[1]['describe'];
      this.getIOPSUsage(obj);
    }
    else if (this.metricArr[2] == obj[0].name) {
      obj[0].unit = balanceDate.RDS[2]['unit'];
      obj[0].describe = balanceDate.RDS[2]['describe'];
      this.getConnectionUsage(obj);
    } else if (this.metricArr[3] == obj[0].name) {
      obj[0].unit = balanceDate.RDS[3]['unit'];
      obj[0].describe = balanceDate.RDS[3]['describe'];
      this.getCpuUsage(obj);
    } else if (this.metricArr[4] == obj[0].name) {
      obj[0].unit = balanceDate.RDS[4]['unit'];
      obj[0].describe = balanceDate.RDS[4]['describe'];
      this.getMemoryUsage(obj);
    } else if (this.metricArr[5] == obj[0].name) {
      obj[0].unit = balanceDate.RDS[5]['unit'];
      obj[0].describe = balanceDate.RDS[5]['describe'];
      this.getMySQL_NetworkInNew(obj);
    } else if (this.metricArr[6] == obj[0].name) {
      obj[0].unit = balanceDate.RDS[6]['unit'];
      obj[0].describe = balanceDate.RDS[6]['describe'];
      this.getMySQL_NetworkOutNew(obj);
    }
  }
  /**
   *
   * @param obj 磁盘使用率
   */
  public getDiskUsage(obj?: any) {
    this.echartsItem(obj, this.DiskUsageArr);
  }
  /**
   *
   * @param obj IOPS使用率
   */
  public getIOPSUsage(obj?: any) {

    this.echartsItem(obj, this.IOPSUsageArr);
  }
  /**
   *
   * @param obj 连接数使用率
   */
  public getConnectionUsage(obj?: any) {

    this.echartsItem(obj, this.ConnectionUsageArr);
  };
  /**
   *
   * @param obj CPU使用率
   */
  public getCpuUsage(obj?: any) {
    this.echartsItem(obj, this.CpuUsageArr);
  };
  /**
   * 内存使用率
   * @param obj
   */
  public getMemoryUsage(obj?: any) {
    this.echartsItem(obj, this.MemoryUsageArr);
  };

  /**
   * MySQL网络出流量
   * @param obj
   */
  public getMySQL_NetworkOutNew(obj?: any) {
    this.echartsMySQL(obj, this.MySQL_NetworkOutNewArr);
  };
  /**
   * MySQL网络入流量
   * @param obj
   */
  public getMySQL_NetworkInNew(obj) {
    this.echartsMySQL(obj, this.MySQL_NetworkInNewArr);
  };

  /**
 * echarts公共配置
 * @param obj
 * @param arr
 */
  public echartsItem(obj: any, arr: any) {
    let timeArr = [];
    let lineArr1 = [];
    let lineStyle;
    let itemStyle;
    lineStyle = INCONFIG.setColorStatus().buleColor.lineStyle;
    itemStyle = INCONFIG.setColorStatus().buleColor.itemStyle;
    for (var i = 0; i < obj[0].sources.length; i++) {
      timeArr.push(obj[0]['sources'][i].dateFormat);
      lineArr1.push(obj[0].sources[i].data);
    }

    var objItem = {
      num: "15%",
      title: obj[0].describe + '(' + obj[0].unit + ')',
      data: [obj[0].describe ? obj[0].describe : ''],
      xAxis: {
        data: timeArr ? timeArr : ''
      },

      series: [
        {
          name: obj[0].describe ? obj[0].describe : '',
          type: 'line',
          data: lineArr1 ? lineArr1 : '',
          lineStyle,
          itemStyle,

        },
      ]
    };
    arr.push(objItem)
  };
  /**
   * 流入  流出带宽
   * @param obj
   * @param arr
   */
  public echartsMySQL(obj: any, arr: any) {
    let timeArr = [];
    let lineArr1 = [];
    let unit;
    let lineStyle;
    let itemStyle;
    lineStyle = INCONFIG.setColorStatus().buleColor.lineStyle;
    itemStyle = INCONFIG.setColorStatus().buleColor.itemStyle;
    console.log(obj)
    lineArr1 = this.monitorService.unitConversion(obj[0].unit, obj).value[0].datas;
    unit = this.monitorService.unitConversion(obj[0].unit, obj).unit;
    for (var i = 0; i < obj[0].sources.length; i++) {
      timeArr.push(obj[0].sources[i].dateFormat);

    }

    var objItem = {
      num: "15%",
      title: obj[0].describe + '(' + unit + ')',
      data: [obj[0].describe ? obj[0].describe : ''],
      name: obj[0].name,
      xAxis: {
        data: timeArr ? timeArr : ''
      },

      series: [
        {
          name: obj[0].describe ? obj[0].describe : '',
          type: 'line',
          data: lineArr1 ? lineArr1 : '',
          lineStyle,
          itemStyle,

        },
      ]
    };
    arr.push(objItem)

  }
  /**
   *从列表得到metric
   */
  getParams() {
    this.metricArr = [];
    for (let i = 0; i < balanceDate.RDS.length; i++) {
      let item = balanceDate.RDS[i];
      this.metricArr.push(item.Metric);
    };
  };

}
