import { FormsModule } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from './../../../../core/common-service/common.service';
import { INCONFIG } from './../../../../core/global';
import { MonitorService } from './../../shared/monitor.service';
import { balanceDate } from './../../balance-monitor/data';
import { CommonRequestService } from './../../../../core/common-service/common-request.service'
@Component({
  selector: 'hierarchy-monitor',
  templateUrl: './hierarchy-monitor.component.html',
  styleUrls: ['./hierarchy-monitor.component.scss']
})
export class HierarchyMonitorComponent implements OnInit {
  msgs: any;
  public isClick: any;  // 时间搜索条件被点击
  public isSelectedDate: any = false;  // 点击自定义，展示被选中的时间，是否显示
  public date: any;  // 点击自定义，被选中的时间
  public dateEnd: Date; // 自定义选择   结束时间
  public dateStart: Date; // 自定义选择 开始时间
  public dateStartShow: any = new Date(); // 自定义开始时间，在页面展示
  public dateEndShow: any; // 自定义结束时间，在页面展示
  public maxDate: any; // 最大的时间
  private zn: any;  // 日历区域配置属性的
  public metricArr: any;
  public UserAvailabilityArr: any = [];//用户层级
  public UserTotalRequestCountArr: any = [];//用户层级有效请求率
  public UserRequestValidRateArr: any = [];//用户层级有效请求率
  public InternetRecvArr: any = []; //用户层级流量
  public viewTitle: any;//弹出框标题
  public appList: any = [];//列表值
  public ErrorCount: any;//用户层级授权错误请求总数
  public ErrorCountPercentArr: any = [];//用户层级授权错误请求总数百分比
  public ErrorRate: any;//用户层级客户端资源不存在错误请求占比
  public ErrorRatePercentArr: any = [];//用户层级客户端资源不存在错误请求占比百分比
  public ClientOtherErrorCount: any;//用户层级客户端其他错误请求总数
  public ClientOtherErrorCountPercentArr: any = [];//用户层级客户端其他错误请求总数百分比
  public UserSuccessCount: any;//用户层级成功请求总数
  public UserSuccessCountPercentArr: any = [];;//用户层级成功请求总数百分比
  public countData: any;//总计值
  public countPercentArr: any = [];//总计值百分比
  public viewValue: any;
  public MeteringPutRequestArr: any = [];//Put类请求数
  public MeteringGetRequestArr: any = [];//Get类请求数
  public meteringStorageArr: any = [];//存储大小
  public MeteringInternetArr: any = [];//公网流出计量流量
  public acquisitionTime: any;//采集时间

  constructor(
    public elementRef: ElementRef,
    public router: Router,
    public route: ActivatedRoute,
    public commonService: CommonService,
    public monitorService: MonitorService,
    public commonRequestService: CommonRequestService
  ) {
    this.zn = INCONFIG.zn;
  };
  ngOnInit() {
    this.dateEnd = new Date();
    this.dateStart = new Date();
    this.modalHidden();
    this.getParams();

  };

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
  };
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
    };

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
        this.getdataList();

    };
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
    this.getDataList();
    this.getdataList();


  };
  /**
  * 选择开始时间
  * @param e 当前选择的 开始时间
  */
  selectStartDate(e) {
    this.dateStartShow = this.commonService.formatDate(e).formatTime;
  };
  /**
   * 选择结束时间
   * @param e 当前选择的结束时间
   */
  selectEndDate(e) {
    this.dateEndShow = this.commonService.formatDate(e).formatTime;
  };
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
  @ViewChild('UserAvailability')
  UserAvailability: ElementRef;
  @ViewChild('UserTotalRequestCount')
  UserTotalRequestCount: ElementRef;
  @ViewChild('InternetRecv')
  InternetRecv: ElementRef;
  /**
  * 鼠标移入事件
  * @param i
  */
  public mouseover(i: any) {
    this.UserAvailability.nativeElement.children[i].children[0].style.display = 'block';

  };
  /**
   * 鼠标移出
   * @param i
   */
  public mouseout(i: any) {
    this.UserAvailability.nativeElement.children[i].children[0].style.display = 'none';
  };

  /**
   * 图标点击事件
   * @param i
   * @param event
   * @param viewModal
   */
  public UserClick(i: any, event: any, viewModal: any, title: any) {
    this.clickCount(i, event, viewModal, title);
  };
  /**
   * 用户层级总请求数/有效请求数
   * @param i
   */

  public CountArrMouseover(i: any) {
    this.UserTotalRequestCount.nativeElement.children[i].children[0].style.display = 'block'
  }
  public CountArrMouseout(i: any) {
    this.UserTotalRequestCount.nativeElement.children[i].children[0].style.display = 'none';
  };
  public CountArrClick(i: any, event: any, viewModal: any, title: any) {
    this.clickCount(i, event, viewModal, title);
  }

  /**用户层级流量
   *
   */
  public InterMouseover(i: any) {
    this.InternetRecv.nativeElement.children[i].children[0].style.display = 'block';
  }
  public InterMouseout(i: any) {
    this.InternetRecv.nativeElement.children[i].children[0].style.display = 'none';
  };
  public InterClick(i: any, event: any, viewModal: any, title: any) {
    this.clickCount(i, event, viewModal, title);
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
   * 初始化传的数据
   * @param event
   * @param event1
   * @param event2
   * @param event3
   */

  public initLoginListData(
    event: any, event1: any, event2: any, event3: any, event4: any, event5: any, event6: any,
    event7: any, event8: any, event9: any) {

    this.UserAvailabilityArr = [];
    this.UserTotalRequestCountArr = [];
    this.InternetRecvArr = [];

    let __this = this;
    let url = '/monitor/oss/v2/statistics';
    let dateEnd = this.dateEndShow ? this.dateEndShow : this.dateEnd;
    let dateStart = this.dateStartShow ? this.dateStartShow : this.dateStart;
    let startTime = this.commonService.formatDate(dateStart).times;
    let endTime = this.commonService.formatDate(dateEnd).times;
    let frequency = INCONFIG.setSamplingFrequency(startTime, endTime).statisticsInterval;
    let statisticsType = INCONFIG.setSamplingFrequency(startTime, endTime).statisticsType;
    let params = {
      "dataFieldsKeys": ["value"],
      "statisticsInterval": frequency,
      'filters': __this.searchCondition().filters,
      "pageNum": -1,
      "statisticsEnd": endTime,
      "statisticsBegin": startTime,
      "statisticsType": statisticsType,

      "metricName": [event, event1, event2, event3, event4, event5,
        event6, event7, event8, event9
      ],

    };
    __this.monitorService.searchData(__this, url, params, function (res) {
      if (res && res.code == 200 && res.success == 1) {
        __this.getArr(res['rows'])
      }
    })
  };
  /**
   * 统计函数
   * @param event
   * @param event1
   * @param event2
   * @param event3
   *
   *
   */
  public initData(
    event?: any, event1?: any, event2?: any, event3?: any) {
    let __this = this;
    let url = '/monitor/oss/v2/statistics';
    let dateEnd = __this.dateEndShow ? __this.dateEndShow : __this.dateEnd;
    let dateStart = __this.dateStartShow ? __this.dateStartShow : __this.dateStart;
    let startTime = __this.commonService.formatDate(dateStart).times;
    let endTime = __this.commonService.formatDate(dateEnd).times;
    let frequency = INCONFIG.setSamplingFrequency(startTime, endTime).statisticsInterval;
    let statisticsType = INCONFIG.setSamplingFrequency(startTime, endTime).statisticsType;

    let params = {
      "dataFieldsKeys": ["value"],
      "statisticsInterval": frequency,
      'filters': [
        // { "itemKey": "appId", "filter": "term", "itemValue": __this.appList }
      ],
      "pageNum": -1,
      "statisticsEnd": endTime,
      "statisticsBegin": startTime,
      "statisticsType": statisticsType,
      "metricName": [event, event1, event2, event3
      ],
    };
    __this.monitorService.searchData(__this, url, params, function (res) {
      if (res && res.code == 200 && res.success == 1) {
        __this.getchangeArr(res['rows'])
      }
    })

  };
  /**
   * 统计初始化
   * @param event
   * @param event1
   * @param event2
   * @param event3
   */
  public initStatistics(event: any, event1: any, event2: any, event3: any) {
    this.meteringStorageArr = [];
    this.MeteringInternetArr = [];
    this.MeteringPutRequestArr = [];
    this.MeteringGetRequestArr = [];
    this.acquisitionTime = '';
    let myDate = new Date();
    let thisyear = myDate.getFullYear();
    let thismonth = myDate.getMonth() + 1;
    let firstdate = thisyear + '-' + thismonth + '-01'
    let __this = this;
    let url = '/monitor/ossMeter/v2/statistics';
    let startTime = __this.commonService.formatDate(firstdate).times - 3600000;
    let endTime = __this.commonService.formatDate(myDate).times;
    // __this.acquisitionTime = __this.commonService.formatDate(endTime).formatTime
    let params = {
      "dataFieldsKeys": ["value"],
      "statisticsInterval": 1,
      'filters': __this.searchCondition().filters,
      "pageNum": -1,
      "statisticsEnd": endTime,
      "statisticsBegin": startTime,
      "statisticsType": "minute",
      "metricName": [event, event1, event2, event3],
    }
    __this.monitorService.searchData(__this, url, params, function (res) {
      if (res && res.code == 200 && res.success == 1) {

        __this.getStatis(res['rows']);
        __this.acquisitionTime = res['rows'][0].sources[res['rows'][0].sources.length - 1].dateFormat;
      }
    })
  }
  public getStatis(arr: any) {
    let MeteringStorage;
    let MeteringInternet;
    let MeteringPutRequest;
    let MeteringGetRequest;
    for (var i = 0; i < arr.length; i++) {
      if (this.metricArr[0] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[0].unit;
        MeteringStorage = arr[i];
      };
      if (this.metricArr[1] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[1].unit;
        MeteringInternet = arr[i];
      };
      if (this.metricArr[2] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[2].unit;
        MeteringPutRequest = arr[i];
      };
      if (this.metricArr[3] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[3].unit;
        MeteringGetRequest = arr[i];
      };
    };
    this.getchangedArr(MeteringStorage, MeteringInternet, MeteringPutRequest, MeteringGetRequest);

  }


  public getchangedArr(obj: any, obj1: any, obj2: any, obj3: any) {
    let MeteringStorage;
    let MeteringStorageUnit;

    let MeteringInternet;
    let MeteringInternetUnit;
    let MeteringPutRequest;
    let MeteringGetRequest;
    let MeteringPutRequestNum;
    let MeteringGetRequestNum;
    let arr1 = [];
    let arr2 = [];
    let datas;
    let name;
    let meteringStorageArr = [];
    let MeteringInternetArr = [];
    if (obj) {
      name = obj.name;
      arr1.push(obj.datas[obj.datas.length - 1]);
      datas = arr1;
      meteringStorageArr.push({ name, datas });
      MeteringStorage = this.monitorService.unitChanged(obj.unit, meteringStorageArr).value[0].datas[0];
      MeteringStorageUnit = this.monitorService.unitChanged(obj.unit, meteringStorageArr).unit;
      this.meteringStorageArr.push({ MeteringStorage, MeteringStorageUnit });
    };
    if (obj1) {
      name = obj1.name;
      arr2.push(this.commonService.arrCountNum(obj1.datas))
      datas = arr2;
      MeteringInternetArr.push({ name, datas });
      MeteringInternet = this.monitorService.unitChanged(obj1.unit, MeteringInternetArr).value[0].datas[0];
      MeteringInternetUnit = this.monitorService.unitChanged(obj1.unit, MeteringInternetArr).unit;
      this.MeteringInternetArr.push({ MeteringInternet, MeteringInternetUnit });
    };
    if (obj2) {
      MeteringPutRequest = this.commonService.arrCountNum(obj2.datas);
      if (MeteringPutRequest < 10000) {
        MeteringPutRequestNum = MeteringPutRequest + '次';
        this.MeteringPutRequestArr.push(MeteringPutRequestNum);
      } else {
        MeteringPutRequestNum = (Math.floor(MeteringPutRequest * 1000) / 1000) / 10000 + '万次';
        this.MeteringPutRequestArr.push(MeteringPutRequestNum);
      };
    };
    if (obj3) {
      MeteringGetRequest = this.commonService.arrCountNum(obj3.datas);
      if (MeteringGetRequest < 10000) {
        MeteringGetRequestNum = MeteringGetRequest + '次';
        this.MeteringGetRequestArr.push(MeteringGetRequestNum);

      } else {
        MeteringGetRequestNum = (Math.floor(MeteringGetRequest * 1000) / 1000) / 10000 + '万次';
        this.MeteringGetRequestArr.push(MeteringGetRequestNum);
      };
    };
  };

  /**
   * 改变结构
   */

  public getArr(arr?: any) {
    let UserAvailabilit;//用户层级可用性
    let UserRequestValidRate;//用户层级有效请求率
    let UserTotalRequestCount;//用户层级总请求数
    let UserValidRequestCount;//用户层级有效请求数
    let UserInternetRecv = [];//用户层级公网流入流量
    let UserInternetSend = [];//用户层级公网流出流量
    let UserIntranetRecv = [];//用户层级内网流入流量
    let UserIntranetSend = [];//用户层级内网流出流量
    let UserCdnRecv = [];//用户层级cdn流入流量
    let UserCdnSend = []; //用户层级cdn流出流量
    for (var i = 0; i < arr.length; i++) {
      if (this.metricArr[4] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[4].unit;
        arr[i].describe = balanceDate.OSS[4].describe;
        arr[i].title = balanceDate.OSS[4]['title'];
        UserAvailabilit = arr[i];
      };
      if (this.metricArr[5] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[5].unit;
        arr[i].describe = balanceDate.OSS[5].describe;
        arr[i].title = balanceDate.OSS[5]['title'];
        UserRequestValidRate = arr[i];
      };
      if (this.metricArr[7] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[7].unit;
        arr[i].describe = balanceDate.OSS[7].describe;
        arr[i].title = balanceDate.OSS[7]['title'];
        UserValidRequestCount = arr[i];
      };
      if (this.metricArr[6] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[6].unit;
        arr[i].describe = balanceDate.OSS[6].describe;
        arr[i].title = balanceDate.OSS[6]['title'];
        UserTotalRequestCount = arr[i];
      };
      if (this.metricArr[8] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[8].unit;
        arr[i].describe = balanceDate.OSS[8].describe;
        arr[i].title = balanceDate.OSS[8]['title'];
        UserInternetRecv.push(arr[i]);
      };
      if (this.metricArr[9] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[9].unit;
        arr[i].describe = balanceDate.OSS[9].describe;
        arr[i].title = balanceDate.OSS[9]['title'];
        UserInternetSend.push(arr[i]);
      };
      if (this.metricArr[10] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[10].unit;
        arr[i].describe = balanceDate.OSS[10].describe;
        arr[i].title = balanceDate.OSS[10]['title'];
        UserIntranetRecv.push(arr[i]);
      };
      if (this.metricArr[11] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[11].unit;
        arr[i].describe = balanceDate.OSS[11].describe;
        arr[i].title = balanceDate.OSS[11]['title'];
        UserIntranetSend.push(arr[i]);
      };
      if (this.metricArr[12] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[12].unit;
        arr[i].describe = balanceDate.OSS[12].describe;
        arr[i].title = balanceDate.OSS[12]['title'];
        UserCdnRecv.push(arr[i]);
      };
      if (this.metricArr[13] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[13].unit;
        arr[i].describe = balanceDate.OSS[13].describe;
        arr[i].title = balanceDate.OSS[13]['title'];
        UserCdnSend.push(arr[i]);
      };
    };
    this.getUser(UserAvailabilit, UserRequestValidRate);
    this.getFlow(UserInternetRecv, UserInternetSend, UserIntranetRecv, UserIntranetSend, UserCdnRecv, UserCdnSend);
    this.getCout(UserValidRequestCount, UserTotalRequestCount);
  };
  public getchangeArr(arr: any) {
    let ErrorCount;//用户层级授权错误请求总数
    let ErrorRate;//用户层级客户端资源不存在错误请求占比
    let ClientOtherErrorCount;//用户层级客户端其他错误请求总数
    let UserSuccessCount;//用户层级成功请求总数
    for (var i = 0; i < arr.length; i++) {
      if (this.metricArr[14] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[14].unit;
        arr[i].describe = balanceDate.OSS[14].describe;
        arr[i].title = balanceDate.OSS[14]['title'];
        ErrorCount = arr[i];
      };
      if (this.metricArr[15] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[15].unit;
        arr[i].describe = balanceDate.OSS[15].describe;
        arr[i].title = balanceDate.OSS[15]['title'];
        ErrorRate = arr[i];
      };
      if (this.metricArr[16] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[16].unit;
        arr[i].describe = balanceDate.OSS[16].describe;
        arr[i].title = balanceDate.OSS[16]['title'];
        ClientOtherErrorCount = arr[i];
      };
      if (this.metricArr[17] == arr[i].name) {
        arr[i].unit = balanceDate.OSS[17].unit;
        arr[i].describe = balanceDate.OSS[17].describe;
        arr[i].title = balanceDate.OSS[17]['title'];
        UserSuccessCount = arr[i];
      };
    };
    this.getCompute(ErrorCount, ErrorRate, ClientOtherErrorCount, UserSuccessCount);
  };
  /**
   *
    *用户层级请求状态分布
   * @param obj
   * @param obj1
   * @param obj2
   * @param obj3
   */
  public getCompute(obj: any, obj1: any, obj2: any, obj3: any) {
    let num1 = 0;
    let num2 = 0;
    let num3 = 0;
    let num4 = 0;
    let num5;
    let ErrorCountPercent;
    let ErrorRatePercent;
    let ClientOtherErrorCountPercent;
    let UserSuccessCountPercent;
    let countPercent;
    this.ErrorCountPercentArr = [];
    this.ErrorRatePercentArr = [];
    this.ClientOtherErrorCountPercentArr = [];
    this.UserSuccessCountPercentArr = [];
    this.countPercentArr = [];
    if (obj) {
      num1 = this.commonService.arrCountNum(obj.datas);
    };
    if (obj1) {
      num2 = this.commonService.arrCountNum(obj1.datas);
    };
    if (obj2) {
      num3 = this.commonService.arrCountNum(obj2.datas);
    };
    if (obj3) {
      num4 = this.commonService.arrCountNum(obj3.datas);
    };
    if (obj && obj1 && obj2 && obj3) {
      countPercent = 100 + '%';
      this.countPercentArr.push(countPercent);
    };
    this.ErrorCount = Math.floor(num1 * 100) / 100;;
    this.ErrorRate = Math.floor(num2 * 100) / 100;
    this.ClientOtherErrorCount = Math.floor(num3 * 100) / 100;
    this.UserSuccessCount = Math.floor(num4 * 100) / 100;
    this.countData = num5 = Math.floor(this.ErrorCount + this.ClientOtherErrorCount + this.ErrorRate + this.UserSuccessCount);
    if (num1) {
      ErrorCountPercent = (Math.floor((num1 / num5) * 100 * 100) / 100) + '%';
      this.ErrorCountPercentArr.push(ErrorCountPercent);
    };
    if (num2) {
      ErrorRatePercent = (Math.floor((num2 / num5) * 100 * 100) / 100) + '%';
      this.ErrorRatePercentArr.push(ErrorRatePercent);
    };
    if (num5) {
      ClientOtherErrorCountPercent = (Math.floor((num3 / num5) * 100 * 100) / 100) + '%';
      this.ClientOtherErrorCountPercentArr.push(ClientOtherErrorCountPercent);
    };
    if (num5) {
      let numOne = ((Math.floor((num1 / num5) * 100 * 100) / 100))
      let numTwo = ((Math.floor((num2 / num5) * 100 * 100) / 100))
      let numThree = ((Math.floor((num3 / num5) * 100 * 100) / 100))
      UserSuccessCountPercent = (100 - numOne - numTwo - numThree) + '%';
      this.UserSuccessCountPercentArr.push(UserSuccessCountPercent);
    }
  };
  /**
   * 用户层级流量
   * @param arr1
   * @param arr2
   * @param arr3
   * @param arr4
   * @param arr5
   * @param arr6
   */
  public getFlow(arr1: any, arr2: any, arr3: any, arr4: any, arr5: any, arr6: any) {
    let lineData1;
    let lineData2;
    let lineData3;
    let lineData4;
    let lineData5;
    let lineData6;
    let timeArr1 = [];
    let timeArr2 = [];
    let timeArr3 = [];
    let timeArr4 = [];
    let timeArr5 = [];
    let timeArr6 = [];
    let timeArr;
    let title;
    let oneName;
    let twoName;
    let threeName;
    let fourName;
    let fiveName;
    let sixName;
    let unit;
    if (arr1) {
      title = arr1[0].title;
      oneName = arr1[0].describe;
      lineData1 = this.monitorService.docerUnitConversion(arr1[0].unit, arr1).value[0].datas;
      unit = this.monitorService.docerUnitConversion(arr1[0].unit, arr1).unit;
      for (var i = 0; i < arr1[0].sources.length; i++) {
        timeArr1.push(arr1[0].sources[i].dateFormat);
      }
    };
    if (arr2) {
      title = arr2[0].title;
      twoName = arr2[0].describe
      lineData2 = this.monitorService.docerUnitConversion(arr2[0].unit, arr2).value[0].datas;
      unit = this.monitorService.docerUnitConversion(arr2[0].unit, arr2).unit;
      for (var i = 0; i < arr2[0].sources.length; i++) {
        timeArr2.push(arr2[0].sources[i].dateFormat)
      }
    };
    if (arr3) {
      title = arr3[0].title;
      threeName = arr3[0].describe
      lineData3 = this.monitorService.docerUnitConversion(arr3[0].unit, arr3).value[0].datas;
      unit = this.monitorService.docerUnitConversion(arr3[0].unit, arr3).unit;
      for (var i = 0; i < arr3[0].sources.length; i++) {
        timeArr3.push(arr3[0].sources[i].dateFormat)
      }
    };
    if (arr4) {
      title = arr4[0].title;
      fourName = arr4[0].describe
      lineData4 = this.monitorService.docerUnitConversion(arr4[0].unit, arr4).value[0].datas;
      unit = this.monitorService.docerUnitConversion(arr4[0].unit, arr4).unit;
      for (var i = 0; i < arr4[0].sources.length; i++) {
        timeArr4.push(arr4[0].sources[i].dateFormat)
      }
    };
    if (arr5) {
      title = arr5[0].title;
      fiveName = arr5[0].describe;
      lineData5 = this.monitorService.docerUnitConversion(arr5[0].unit, arr5).value[0].datas;
      unit = this.monitorService.docerUnitConversion(arr5[0].unit, arr5).unit;
      for (var i = 0; i < arr5[0].sources.length; i++) {
        timeArr5.push(arr5[0].sources[i].dateFormat)
      }
    };
    if (arr6) {
      sixName = arr6[0].describe;
      title = arr6[0].title;
      lineData6 = this.monitorService.docerUnitConversion(arr6[0].unit, arr6).value[0].datas;
      unit = this.monitorService.docerUnitConversion(arr6[0].unit, arr6).unit;
      for (var i = 0; i < arr6[0].sources.length; i++) {
        timeArr6.push(arr6[0].sources[i].dateFormat);
      }
    };
    if (timeArr1) {
      timeArr = timeArr1
    } else if (!timeArr1) {
      timeArr = timeArr2
    } else if (!timeArr2) {
      timeArr = timeArr3
    } else if (!timeArr3) {
      timeArr = timeArr4
    } else if (!timeArr4) {
      timeArr = timeArr5
    } else if (!timeArr5) {
      timeArr = timeArr6
    }
    var objItem = {
      num: "15%",
      unit: unit,
      title: title,
      data: [oneName ? oneName : '', twoName ? twoName : '', threeName ? threeName : '', fourName ? fourName : '', fiveName ? fiveName : '', sixName ? sixName : ''],
      xAxis: {
        data: timeArr
      },
      series: [
        {
          name: oneName ? oneName : '',
          type: 'line',
          data: lineData1 ? lineData1 : '',
          lineStyle: {
            normal: {
              color: '#7CB5ED', //连线颜色
              width: '1',
            }
          },
          itemStyle: {
            normal: {
              color: '#7CB5ED' //图标颜色
            }
          },
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
        {
          name: threeName ? threeName : '',
          type: 'line',
          data: lineData3 ? lineData3 : '',
          lineStyle: {
            normal: {
              color: '#2A918F',  //连线颜色
              width: '1',
            }
          },
          itemStyle: {
            normal: {
              color: '#2A918F' //图标颜色
            }
          },
        },
        {
          name: fourName ? fourName : '',
          type: 'line',
          data: lineData4 ? lineData4 : '',
          lineStyle: {
            normal: {
              color: '#F15C81',  //连线颜色
              width: '1',
            }
          },
          itemStyle: {
            normal: {
              color: '#F15C81' //图标颜色
            }
          },
        },
        {
          name: fiveName ? fiveName : '',
          type: 'line',
          data: lineData5 ? lineData5 : '',
          lineStyle: {
            normal: {
              color: '#E5D354',  //连线颜色
              width: '1',
            }
          },
          itemStyle: {
            normal: {
              color: '#E5D354' //图标颜色
            }
          },
        },
        {
          name: sixName ? sixName : '',
          type: 'line',
          data: lineData6 ? lineData6 : '',
          lineStyle: {
            normal: {
              color: '#91ED7C',  //连线颜色
              width: '1',
            }
          },
          itemStyle: {
            normal: {
              color: '#91ED7C', //图标颜色

            }
          },
        },

      ]
    }

    if (objItem.xAxis.data.length > 0) {

      this.InternetRecvArr.push(objItem);
    };

  };
  /**
   * UserTotalRequestCountArr
   * @param obj1
   * @param obj2
   */
  public getCout(obj1: any, obj2: any) {
    this.echartsItem(obj1, obj2, this.UserTotalRequestCountArr);
  };
  /**
   * UserAvailabilityArr
   * @param obj1
   * @param obj2
   */
  public getUser(obj1: any, obj2: any) {
    this.echartsItem(obj1, obj2, this.UserAvailabilityArr)
  };
  /**
   *
   * @param obj1
   * @param obj2
   * @param arr
   */
  public echartsItem(obj1: any, obj2: any, arr: any) {
    let timeArr1 = [];//用户层级总请求数时间轴
    let timeArr2 = [];//用户层级有效请求数时间轴
    let title;//第一个列表的标题
    let lineData1 = [];//用户层级总请求数时间轴数据
    let lineData2 = [];//用户层级有效请求数 数据
    let oneName;//用户层级总请求数
    let twoName;//用户层级有效请求数
    let timeArr;
    let lineStyle;
    let itemStyle;
    lineStyle = INCONFIG.setColorStatus().buleColor.lineStyle;
    itemStyle = INCONFIG.setColorStatus().buleColor.itemStyle;
    if (obj1) {
      title = obj1.title;
      oneName = obj1.describe
      for (var i = 0; i < obj1.sources.length; i++) {
        timeArr1.push(obj1.sources[i].dateFormat)
        lineData1.push(Math.floor(obj1.sources[i].data))
      }
    };

    if (obj2) {
      title = obj2.title
      twoName = obj2.describe
      for (var i = 0; i < obj2.sources.length; i++) {

        timeArr2.push(obj2.sources[i].dateFormat)
        lineData2.push(Math.floor(obj2.sources[i].data * 100) / 100)
      }

    };

    if (timeArr1) {
      timeArr = timeArr1;
    } else {
      timeArr = timeArr2;
    };
    var objItem = {
      num: "15%",
      title: title,
      data: [oneName ? oneName : '', twoName ? twoName : ''],
      xAxis: {
        data: timeArr
      },
      series: [
        {
          name: oneName ? oneName : '',
          type: 'line',
          data: lineData1 ? lineData1 : '',
          lineStyle,
          itemStyle
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
    if (objItem.xAxis.data.length > 0) {
      arr.push(objItem);
    }
  };


  /**
   * 图标初始化
   */
  public getDataList() {
    this.initLoginListData(
      this.metricArr[4], this.metricArr[5],
      this.metricArr[6], this.metricArr[7],
      this.metricArr[8], this.metricArr[9],
      this.metricArr[10], this.metricArr[11],
      this.metricArr[12], this.metricArr[13],
    );

  };
  /**
   * 列表初始化
   */
  public getdataList() {
    this.initData(this.metricArr[14], this.metricArr[15],
      this.metricArr[16], this.metricArr[17]);

  };
  /**
   * 统计初始化
   */
  public getStatistics() {
    this.initStatistics(this.metricArr[0], this.metricArr[1],
      this.metricArr[2], this.metricArr[3]);
  };


  /**
   *
   */
  public searchCondition() {
    // 应用列表
    let value = {
      'filters': [
      ]
    }

    return value;
  }
  getParams() {
    this.metricArr = [];
    for (let i = 0; i < balanceDate.OSS.length; i++) {
      let item = balanceDate.OSS[i];
      this.metricArr.push(item.Metric);

    };
    this.getRouteParams();
    this.getStatistics();
  };

}
