import { NgaModule } from './../../../theme/nga.module';
import { CommonService } from './../../../core/common-service/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { INCONFIG } from './../../../core/global';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { CommonRequestService } from './../../../core/common-service/common-request.service';
import { balanceDate } from './../balance-monitor/data';
import { MonitorService } from './../shared/monitor.service'
@Component({
  selector: 'docker-monitor',
  templateUrl: 'docker-monitor.component.html',
  styleUrls: ['./docker-monitor.component.scss',],
})
export class DockerMonitorComponent implements OnInit {
  public isClick: any;  // 时间搜索条件被点击
  public isSelectedDate: any = false;  // 点击自定义，展示被选中的时间，是否显示
  public date: any;  // 点击自定义，被选中的时间
  public dateEnd: Date; // 自定义选择   结束时间
  public dateStart: Date; // 自定义选择 开始时间
  public dateStartShow: any = new Date(); // 自定义开始时间，在页面展示
  public dateEndShow: any; // 自定义结束时间，在页面展示
  public maxDate: any; // 最大的时间
  private zn: any;  // 日历区域配置属性的
  public logCountEcharts: any = [];
  public selectServerName: any;//下拉框选中
  public valueList: any;//初始化数据
  public nameArr = [];//data列表数据
  public viewValue: any;//弹出框内容
  public viewTitle: any//弹出框标题
  public obj: any = [];//获得列表值
  public timeArr: any = [];
  @ViewChild('echarts')
  echartsDiv: ElementRef;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public commonService: CommonService,
    public commonRequestMethodService: CommonRequestMethodService,
    public commonRequestService: CommonRequestService,
    public confirmationService: ConfirmationService,
    public elementRef: ElementRef,
    public monitorService: MonitorService
  ) {
    Object.assign(this, { balanceDate });
    this.zn = INCONFIG.zn;
  }
  ngOnInit() {
    this.searchData();
    this.modalHidden();
    this.setMaxMinDate();
    this.getParams();
  };
  /**
   * 鼠标移入事件
   * @param i
   */
  public mouseover(i: any) {
    this.echartsDiv.nativeElement.children[i].children[0].style.display = 'block';
  };
  /**
   * 鼠标移出
   * @param i
   */
  public mouseout(i: any) {
    this.echartsDiv.nativeElement.children[i].children[0].style.display = 'none';
  };

  /**
   * 图标点击事件
   * @param i
   * @param event
   * @param viewModal
   */
  public spanClick(i: any, event: any, viewModal: any, title: any) {
    this.viewValue = "";
    viewModal.show();
    this.viewValue = event;
    this.viewTitle = title.innerHTML;
    this.viewValue.num = "8%";
  };
  AfterViewInit() {
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
        this.initLoginListData();
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
    this.initLoginListData();
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
  public dropDownServerNames: any;//下拉框数据
  /**
   * 实例下拉框的内容
   */
  public searchData() {
    let __this = this;
    let url = '/monitor/docker/v2/getValues';
    let params = {
      "fields": "container_Name"
    };
    __this.monitorService.searchData(__this, url, params, function (res) {
      if (res && res.code == 200 && res.success == 1) {

        __this.changeData(res['rows'][0].values);

        __this.dropDownServerNames = res['rows'][0].values;

        __this.selectServerName = res['rows'][0].values[0].value;

      }
      __this.getRouteParams();
    })
  };
  /**
   * 改变下拉框机构
   */
  public changeData(arr: any) {

    for (var j = 0; j < arr.length; j++) {
      if (arr[j] == '/') {
        arr.splice(j, 1);
      }
    };
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var data = {
        label: item,
        value: item
      }
      arr[i] = data;

    };

  };
  /**
   *下拉框change事件
   */
  public onChangeService(event: any) {
    this.selectServerName = event.value;
    this.initLoginListData();
  };
  /**
   * 获取参数
   */
  public searchCondition() {
    let dateEnd = this.dateEndShow ? this.dateEndShow : this.dateEnd;
    let dateStart = this.dateStartShow ? this.dateStartShow : this.dateStart;
    let endTime = Math.round(this.commonService.formatDate(dateStart).times / 60000) - 180000;
    let intervalTimes = 60000000;
    let statisticsInterval = INCONFIG.setSamplingFrequency(this.commonService.formatDate(dateStart).times, this.commonService.formatDate(dateEnd).times).statisticsInterval;
    let value = {
      'filters': [
        { 'itemKey': 'timestamp', 'filter': 'gte', 'itemValue': this.commonService.formatDate(dateStart).times * 1000 },
        { 'itemKey': 'timestamp', 'filter': 'lte', 'itemValue': this.commonService.formatDate(dateEnd).times * 1000 },
        { 'itemKey': 'container_Name', 'filter': 'contain', 'itemValue': this.selectServerName },
        {
          'itemKey': '', 'filter': 'script', 'itemValue': "(" + endTime + "-doc['timestamp'].value.intdiv" + "(" + intervalTimes + ")" + ")" + "%" + statisticsInterval + "==0"

        }
      ],

    };
    return value;
  };
  /**
   * 初始化数据
   */
  public initLoginListData() {
    let __this = this;
    __this.nameArr = [];
    let url = '/monitor/docker/v2/queryList';
    let params = {
      'filters': __this.searchCondition().filters,
      'orderBy': 'timestamp desc',
      'pageNum': -1
    };
    __this.monitorService.searchData(__this, url, params, function (res) {
      if (res && res.code == 200 && res.success == 1) {
        __this.valueList = res['rows'];
        __this.getEchartsDataArr(__this.valueList.reverse());
      }
    })
  };

  /**
   *从列表得到metric
   */
  getParams() {
    this.obj = [];
    for (let i = 0; i < balanceDate.Docker.length; i++) {
      let item = balanceDate.Docker[i];
      this.obj.push(item);
    };
  };
  /**
   * 设置相对应的数组
   */
  public itemObj = {
    cpu: [],
    memory: [],
    netInwork: [],
    netOutwork: [],

  };

  /**
   * 将数据分类
   */
  public getEchartsDataArr(dataList: any) {
    this.timeArr = []
    this.itemObj.cpu = [];
    this.itemObj.netInwork = [];
    this.itemObj.memory = [];
    this.itemObj.netOutwork = [];
    if (dataList) {
      for (let i = 0; i < dataList.length; i++) {
        this.timeArr.push(this.commonService.formatDate(dataList[i].timestamp / 1000).formatTime);
        this.itemObj.cpu.push((Math.floor((dataList[i].container_stats.cpu.usage.user + dataList[i].container_stats.cpu.usage.system) / dataList[i].container_stats.cpu.usage.total * 100) / 100) * 100);
        this.itemObj.memory.push(dataList[i].container_stats.memory.usage);
        this.itemObj.netInwork.push(dataList[i].container_stats.network.rx_bytes);
        this.itemObj.netOutwork.push(dataList[i].container_stats.network.tx_bytes);
      };
      this.arrChange(this.itemObj, this.timeArr);
    };
  };
  /**
   * 判断数组长度抵用函数
   * @param obj
   */
  public arrChange(obj?: any, arr?: any) {
    this.logCountEcharts = [];
    let legendData = [];
    var lineArr1;
    var netInworkArr = [];
    var netOutworkArr = [];
    var memoryArr = [];
    let datas;
    let name;
    let netInItem;//流入带宽
    let memoryData;//内存
    let netOutItem;//流出带宽
    let netInData = [];//流入带宽
    let netOutData = [];//流出带宽
    this.checkout('Docker')
    if (obj.cpu.length) {
      this.valueChange(obj.cpu, arr, this.nameArr[0]);
    };
    if (obj.memory.length) {
      datas = obj.memory
      name = this.nameArr[1].Metric;
      memoryArr.push({ datas, name });
      memoryData = this.monitorService.docerUnitConversion(this.nameArr[1].unit, memoryArr).value[0].datas;
      this.nameArr[1].unit = this.monitorService.docerUnitConversion(this.nameArr[1].unit, memoryArr).unit;
      this.valueChange(memoryData, arr, this.nameArr[1]);
    };
    //计算前一项减去后一项的值
    if (obj.netInwork.length) {
      obj.netInwork.unshift(0);
      for (var i = 1; i < obj.netInwork.length; i++) {
        netInData.push(obj.netInwork[i] - obj.netInwork[i - 1])
      };
      //计算值小于0的时候取0
      for (var j = 0; j < netInData.length; j++) {
        if (netInData[j] < 0) {
          netInData[j] = 0;
        }
      };
      datas = netInData;
      netInworkArr.push({ datas, name });
      name = this.nameArr[2].Metric;
      netInItem = this.monitorService.docerUnitConversion(this.nameArr[2].unit, netInworkArr).value[0].datas;
      this.nameArr[2].unit = this.monitorService.docerUnitConversion(this.nameArr[2].unit, netInworkArr).unit;
      this.valueChange(netInItem, arr, this.nameArr[2]);
    };
    //计算前一项减去后一项的值
    if (obj.netOutwork.length) {
      obj.netOutwork.unshift(0);
      for (var i = 1; i < obj.netOutwork.length; i++) {
        netOutData.push(obj.netOutwork[i] - obj.netOutwork[i - 1])
      };
      //计算值小于0的时候取0
      for (var j = 0; j < netOutData.length; j++) {
        if (netOutData[j] < 0) {
          netOutData[j] = 0;
        }
      };
      datas = netOutData;
      netOutworkArr.push({ datas, name });
      netOutItem = this.monitorService.docerUnitConversion(this.nameArr[3].unit, netOutworkArr).value[0].datas;
      this.nameArr[3].unit = this.monitorService.docerUnitConversion(this.nameArr[3].unit, netOutworkArr).unit;
      this.valueChange(netOutItem, arr, this.nameArr[3]);
    };
  };
  /**
   * echarts 的配置项
   * @param obj
   * @param arr
   * @param value
   */
  public valueChange(obj: any, arr: any, value) {
    let lineArr1 = [];
    let legendData = [];
    let lineStyle;
    let itemStyle;
    let color = INCONFIG.echartLineColor;
    lineStyle = INCONFIG.setColorStatus().buleColor.lineStyle;
    itemStyle = INCONFIG.setColorStatus().buleColor.itemStyle;
    legendData.push(value.describe);
    var itemObj = {
      num: "15%",
      title: value.describe + '(' + value.unit + ')',
      data: legendData,

      xAxis: {
        data: arr
      },

      series: [
        {
          name: legendData,
          type: 'line',
          lineStyle,
          itemStyle,
          data: obj,
        },
      ]
    };
    if (itemObj.xAxis.data.length > 0) {
      this.logCountEcharts.push(itemObj);
    }

  };

  /**
   * 获取data的描述
   */
  public objItem = {
    cpu: 'cpu',
    memory: 'memory',
    netInwork: 'netInwork',
    netOutwork: 'netOutwork'
  };
  /**
   *
   * @param kind 数据类型 如"ESCData"
   * @param obj 参数数组
   */

  public checkout(kind: any) {
    let dataArr; // 当前参数所在的数据类型
    this.nameArr = [];
    for (let value in balanceDate) {
      if (kind === value) {
        dataArr = balanceDate[value];
      }
    };

    for (var item in this.objItem) {
      for (var i = 0; i < dataArr.length; i++) {
        if (item == dataArr[i].Metric) {
          this.nameArr.push(dataArr[i])
        }
      }
    };

  };

}
