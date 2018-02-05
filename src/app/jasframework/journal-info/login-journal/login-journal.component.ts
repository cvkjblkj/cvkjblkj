import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { INCONFIG } from './../../../core/global';
import { CommonRequestService } from './../../../core/common-service/common-request.service';
import { JournalInfoService } from './../shared/journal-info.service';
import { LoginJournalService } from './shared/login-journal.service';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import {
  loginFilterData,
  listData,
  clientTypeData,
  osData,
  geoCoordMap,
  convertData,
  areaMapData,
  enpAuthStatusData
} from './../shared/data';
import { CommonService } from './../../../core/common-service/common.service';
import { Component, OnInit, OnChanges, ViewChild, AfterViewInit, AfterContentInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';

declare var $: any; //  引入jQuery
const echarts = require('echarts'); //  引入echarts
import './shared/china.js';
import './../shared/bmap.js';
import { JasCommunicationsService } from './../../jas/shared/jas.commumication.service';
import { GlobalState } from './../../../global.state'; //  一级菜单收缩按钮事件消息服务
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-login-journal',
  templateUrl: './login-journal.component.html',
  providers: [LoginJournalService],
  styleUrls: ['./login-journal.component.scss', './../journal-info.component.scss']
})
export class LoginJournalComponent implements OnInit, AfterViewInit {
  selectData: any; // 列表数据

  public appList: any; // 应用列表
  public loop: any; // 筛选条件遍历的条件
  public filterSearchData: any; // 筛选条件的初始化数据
  public row: any = 0; // 筛选条件的初始列数

  public dropdownData: any; // 下拉框的数据（例如：应用名称）
  public listData: any; // 列表项的数据
  public listItem: boolean = false; // 列表项 的选择框是否显示，默认不显示
  public options: any = []; // 存放p-column的头数据
  public unfrozenWidth: any;  // 没有被冻结的宽度  列表中
  public isClick: any;  // 时间搜索条件被点击
  //  public date: any;  // 点击自定义，被选中的时间
  public isSelectedDate: any = false;  // 点击自定义，展示被选中的时间，是否显示
  public frozenItem: boolean = true; // 冻结列
  public IsFrozen: boolean = false; //  判断是否需要冻结宽度
  public downloadIsShow: boolean = false; //  选择下载项 是否显示
  public dateEnd: any = new Date() // 自定义选择   结束时间
  public dateStart: any = new Date(); // 自定义选择 开始时间
  public dateStartShow: any; // 自定义开始时间，在页面展示
  public dateEndShow: any; // 自定义结束时间，在页面展示
  minDate: Date; //  日历可选择的最小值

  maxDate: Date;  //  日历可选择的最大值

  public isDisabled: boolean = true; //  搜索按钮是否禁用
  public emptyMessage: string = '未查到相关数据'; //  primeng dataTable没有数据时，显示的内容
  public defaultLabel: string = '请选择--'; //  p-multiSelect 在没有选择时显示。
  //  页容量
  public rowsPerPageOptions = ['10', '20', '30'];
  public pageSize: string = '10'; //  页容量
  public pageNum: any = 1; //  页码
  public maxSize: number = 5;
  public totalPages: any;  //  总页数
  public size: any; //   当前页容量
  private totalItems: any; //  总数据条数
  public sortF = "loginTime";
  public sortO = -1;

  private zn: any;  //  日历区域配置属性的
  public colNumber: any; //  当前列表渲染的列数
  @ViewChild('dtFrozen') dtFrozen; //  dataTable column
  public listDivWidth: any;//  列表的宽度
  public orderName: any = "loginTime desc"; // 列表中排序名称
  public menuId: any; //  菜单的id
  public button: any = {}; //  按钮值的集合
  public isSearched: boolean = true;
  @ViewChild('listDiv') listDiv;  //  primeNg table所在区域
  @ViewChild('dt') dt;  //  primeng  dateTable定义的变量
  @ViewChild('screenWidth') screenWidth; //  屏幕宽度
  private logCountEcharts = {
    title: {
      text: '应用登录统计',
      textStyle: { fontSize: 12, fontWeight: 400, },
    },
    tooltip: { trigger: 'axis' },
    legend: { bottom: '0', data: [] },
    xAxis: { type: 'category', boundaryGap: false, data: [] },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}' } },
    series: []
  };
  public loginAreaMap = {
    title: {
      text: '应用登录分布',
      left: 'left',
      textStyle: { color: '#333', fontSize: 12, fontWeight: 400, },
    },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'right', data: [] },
    visualMap: {
      min: 0,
      max: 2500,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'], //   文本，默认为数值文本
      calculable: true,
      itemHeight: 80,
    },
    series: []
  };  //  地图区域统计图

  //  组件消失时,销毁订阅
  private subscription: Subscription;

  constructor(public commonService: CommonService,
    public router: Router,
    public route: ActivatedRoute,
    public commonRequestMethodService: CommonRequestMethodService,
    public journalInfoService: JournalInfoService,
    public commonRequestService: CommonRequestService,
    private loginJournalAPI: LoginJournalService,
    public confirmationService: ConfirmationService,
    public jasCommunicationService: JasCommunicationsService,
    public globaStateService: GlobalState) {
    Object.assign(this, { loginFilterData, listData, clientTypeData, osData, areaMapData, enpAuthStatusData });
    this.loop = [0, 1, 2, 3, 4];
    this.filterSearchData = [
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null]
    ];
    this.dropdownData = {};
    this.zn = INCONFIG.zn;
    //  一级垂直菜单隐藏事件消息处理订阅方法
    this.globaStateService.subscribe('menu.isCollapsed', () => {
      setTimeout(() => {
        this.setFrozenWidth(this);
      }, 10);
      setTimeout(() => {
        this.setFrozenWidth(this);
      }, 100);
      setTimeout(() => {
        this.setFrozenWidth(this);
      }, 1000);
    });
    //  二级垂直菜单隐藏事件处理订阅方法
    this.subscription = this.jasCommunicationService.getSubscribe.subscribe(
      data => {
        if ('second-level menu change' === data) {
          setTimeout(() => {
            this.setFrozenWidth(this);
          }, 50);
          setTimeout(() => {
            this.setFrozenWidth(this);
          }, 100);
          setTimeout(() => {
            this.setFrozenWidth(this);
          }, 150);
          setTimeout(() => {
            this.setFrozenWidth(this);
          }, 200);
          setTimeout(() => {
            this.setFrozenWidth(this);
          }, 250);
          setTimeout(() => {
            this.setFrozenWidth(this);
          }, 1000);
        }
      },
      error => {
        //  console.error(error);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); //  销毁订阅
  }

  //  页面初始化
  ngOnInit() {
    this.menuId = this.route.snapshot.queryParams['id'] ? this.route.snapshot.queryParams['id'] : this.route.snapshot.params['id'];
    this.listData = listData;
    this.selectData = [];
    this.setMaxMinDate();
    this.getRouteParams();
    this.modalHidden();
    this.getBtn();
    //  默认显示的列表项
    this.options = [
      //  { 'field': 'userName', 'header': '用户姓名' },
      { 'field': 'mobileNum', 'header': '手机号', 'index': 1 },
      { 'field': 'enterpriseName', 'header': '企业名称', 'index': 3 },
      { 'field': 'appName', 'header': '应用名称', 'index': 6 },
      { 'field': 'loginTime', 'header': '登录时间', 'index': 9 },
      { 'field': 'city', 'header': '登录城市', 'index': 13 },
      { 'field': 'clientType', 'header': '客户端类型', 'index': 14 },
      { 'field': 'os', 'header': '操作系统', 'index': 15 }
    ];
    //  初始化 listData数据
    for (var i = 0; i < this.listData.length; i++) {
      this.listData[i].checked = false;
      this.listData[0].checked = true;
      for (let checkedOption of this.options) {
        this.listData[checkedOption.index].checked = true;
      }
    }

  }

  //  组件初始化后

  ngAfterViewInit() {
    $('.border-set')[0].style.borderRight = '1px solid #f0f0f0';
    $('.border-set')[0].style.width = this.listDiv.nativeElement.clientWidth - 20 + "px";
    let that = this;
    if (that.screenWidth.nativeElement.hidden == true) {
      that.dtFrozen.frozen = false;
      that.frozenItem = false;
    }
    //  在页面刚渲染时，给列表的不冻结宽度赋值
    this.setFrozenWidth(that);
    window.onresize = function () {
      that.setFrozenWidth(that);
    }
  }

  //  设置dataTable的不冻结宽度
  public setFrozenWidth(that) {
    that.listDivWidth = that.listDiv.nativeElement.clientWidth;
    that.colNumber = Math.ceil((that.listDivWidth - 30 - 200) / 200);
    if (that.screenWidth.nativeElement.hidden == false) {
      //  如果宽度大于不冻结列的宽度，冻结取消
      if (that.screenWidth.nativeElement.clientWidth - 200 > that.options.length * 200 || !that.frozenItem) {
        that.frozenItem = false;
      } else {
        that.dtFrozen.frozen = true;
        that.frozenItem = true;
      }
      //  列表项的数据不为空
      that.dt.unfrozenWidth = that.screenWidth.nativeElement.clientWidth - 200 + 'px';

    } else {
      that.dt.unfrozenWidth = that.listDivWidth - 200 - 30 + 'px';
    }

  }

  /**
   *页面的 列表初始化数据
   */
  public initLoginListData() {
    //  应用列表的数据请求参数
    let params = {
      'pageNum': -1
    };
    let _that = this;
    this.commonRequestService.getAppNameList(params, _that, function (res) {
      if (res.success == 1) {
        _that.appList = res['rows'];
        _that.journalInfoService.appListData = _that.appList;
        let url = '/log/login/v2/queryList';
        let params = {
          'filters': _that.searchCondition(_that.appList).filters,
          'pageSize': _that.pageSize,
          'pageNum': _that.pageNum,
          'orderBy': _that.orderName
        }
        _that.journalInfoService.searchData(_that, url, params, function (res) {
          if (res && res.code == 200 && res.success == 1) {
            //  成功获取数据
            _that.changeListSreenData(res.rows);

            _that.selectData = res['rows'];
            _that.totalItems = res["totalElements"];
            _that.size = res['size'];
            _that.totalPages = res['totalPages'];
            _that.changeEnpAuthStatus(res.rows);
            _that.commonService.growl(_that, 'success', '列表刷新成功');
            _that.isSearched = true;
          } else if (res.success == -1) {
            if (res.code == 400) {
              _that.commonService.growl(_that, 'error', '列表获取失败,请重新刷新页面');
            }
            //  _that.growl('error', res.msg);
          }
          //  图表数据初始化
          _that.logCountEcharts.legend.data = [];
          _that.logCountEcharts.xAxis.data = []; //  X轴水平线数据清空
          _that.logCountEcharts.series = [];     //  显示的数据清空

          // 应用登录统计
          _that.getAppCountInfo();

          // //  登录区域地图统计、
          _that.getLoginAreaInfo();
        });
      }
    })
  }

  /**
   * 改变企业的认证状态显示，并拼接在企业后面
   * @param arr 数组：列表数据
   */
  public changeEnpAuthStatus(arr) {
    let newEnpName;
    if (arr.length > 0) {
      for (let item of arr) {
        switch (item['enterpriseAuthStatus']) {
          case -1:
            item['enterpriseAuthStatus'] = '认证驳回';
            //   newEnpName = item['enterpriseName'] + ' （认证驳回）';
            //  item['enterpriseName'] = newEnpName;
            break;
          case 0:
            item['enterpriseAuthStatus'] = '未认证';
            //  newEnpName = item['enterpriseName'] + ' （未认证）';
            //  item['enterpriseName'] = newEnpName;
            break;
          case 1:
            item['enterpriseAuthStatus'] = '认证通过';
            newEnpName = item['enterpriseName'] + ' （认证通过）';
            //  item['enterpriseName'] = newEnpName;
            break;
          case 2:
            item['enterpriseAuthStatus'] = '待审核';
            newEnpName = item['enterpriseName'] + ' （待审核）';
            break;
          //  item['enterpriseName'] = newEnpName;
          default:
            item['enterpriseAuthStatus'] = '未知状态';
            newEnpName = item['enterpriseName'] + ' （未知状态）';
            break;
        }
      }
    }


  }


  /**
   * 获取  应用登录统计数据
   * 
   * @memberof LoginJournalComponent
   */
  getAppCountInfo() {
    // let logEcharts = echarts.init(document.getElementById('log-statistics'));

    let _that = this;
    let startDate = this.commonService.formatDate(this.dateStart);
    let endDate = this.commonService.formatDate(this.dateEnd);
    this.logCountEcharts.xAxis.data = this.dataScope(startDate.formcatDate, endDate.formcatDate);
    this.loginJournalAPI.getAppCountChart(startDate.times, endDate.times, this.searchCondition().filters, _that, (res) => {
      if (res.success == 1 && res.rows) {
        // logEcharts.hideLoading();

        if (res.rows.length > 0) {
          for (let e of res.rows) {
            _that.logCountEcharts.legend.data.push(e.appName);
            _that.logCountEcharts.series.push({ name: e.appName, type: 'line', data: e.datas });
          }
        } else {
          this.logCountEcharts.series.length = 0;
        }

      }
    })
  }

  /**
   * 获取登录区域统计数据
   */
  getLoginAreaInfo() {
    // let mapEcharts = echarts.init(document.getElementById('map-statistics'));
    let _that = this;
    //  清空之前的数据
    this.loginAreaMap.series.splice(0, this.loginAreaMap.series.length);
    let params = {
      statisticsBegin: this.commonService.formatDate(this.dateStart).times,
      statisticsEnd: this.commonService.formatDate(this.dateEnd).times,
      filters: this.searchCondition().filters
    };
    this.loginJournalAPI.getLoginAreaData(params, _that, (res) => {
      if (res && res.success == 1) {
        // mapEcharts.hideLoading();
        _that.changeAreaMapData(res.rows[0]);
      } else if (res && res.success == -1) {
        _that.commonService.growl(_that, 'error', '获取失败');
      }
    })
  }

  /**
   *  改变地图登录统计返回的数据
   * @param arr 地图登录统计数据
   */
  public changeAreaMapData(arr: any) {
    let apps = arr.apps; // 所有的统计数据
    let areasData = arr.areas; // 省份的统计数据和
    let provinceData = []; // 省份数据
    //  每一个区域的取值
    let everyAppAreaData = {
      name: '',
      type: 'map',
      mapType: 'china',
      roam: true,
      label: {
        normal: {
          show: true
        },
        emphasis: {
          show: true
        }
      },
      data: []
    }
    if (apps.length == 0) {
      this.loginAreaMap.series.splice(0, this.loginAreaMap.series.length);
      return;
    }
    let loginAccount = [];  // 每个省份登录次数的数组
    let appNameList = []; // 应用名称的数组

    for (var i = 0; i < apps.length; i++) {
      appNameList.push(apps[i].appName)
      everyAppAreaData.name = apps[i].appName;
      this.loginAreaMap.series.push({
        name: apps[i].appName,
        type: 'map',
        mapType: 'china',
        roam: true,
        label: {
          normal: {
            show: true
          },
          emphasis: {
            show: true
          }
        },
        data: []
      });

      if (apps[i].data.length > 0) {
        for (var j = 0; j < apps[i].data.length; j++) {
          let newData = {};
          let item = apps[i].data[j];
          if (item.area.length > 0) {
            loginAccount.push(item.loginCount);
            if (item.area.indexOf('省') != -1 || item.area.indexOf('市') != -1) {
              newData = { name: item.area.slice(0, item.area.length - 1), value: item.loginCount };
            } else if (item.area.indexOf('自治区') != -1 && item.area.indexOf('广西') != 0 && item.area.indexOf('内蒙古') != 0) {
              newData = { name: item.area.substr(0, 2), value: item.loginCount };
            } else if (item.area.indexOf('广西') == 0) {
              newData = { name: item.area.substr(0, 2), value: item.loginCount };
            } else if (item.area.indexOf('内蒙古') == 0) {
              newData = { name: item.area.substr(0, 3), value: item.loginCount };
            } else if (item.area.indexOf('香港') != -1) {
              newData = { name: item.area.substr(0, 2), value: item.loginCount };
            } else if (item.area.indexOf('澳门') != -1) {
              newData = { name: item.area.substr(0, 2), value: item.loginCount };
            }
            this.loginAreaMap.series[i].data.push(newData);
          }
        }
      }
    }
    ;
    let maxLoginCount = [];
    let maxCount;
    if (areasData.length > 0) {
      for (let itemArea of areasData) {
        if (itemArea.area.length > 0) {
          maxLoginCount.push(itemArea.logCount);
        } else {
          maxLoginCount.push(1);
        }
      }
      maxCount = Math.max.apply(null, maxLoginCount); // 最大的登录次数
    } else {
      maxCount = 10;
    }


    this.loginAreaMap['legend']['data'] = [].concat(appNameList);
    this.loginAreaMap.visualMap.max = maxCount;

  }

  /* 计算两个日期时间段内所有日期
   * @param value1    开始日期 YYYY-MM-DD 如: '2017-06-01'
   * @param value2    结束日期             :  '2017-06-05'
   * @return 日期数组                       : ['2017-06-01','2017-06-02','2017-06-03','2017-06-04','2017-06-05']
   * */
  public dataScope(value1, value2) {
    let date1: any = this.commonService.formatDate(value1).times;
    let date2: any = this.commonService.formatDate(value2).times;

    if (date1 > date2) {
      var template = date1;
      date1 = date2;
      date2 = template;
    }
    date1 = this.commonService.formatDate(date1).date;
    date2 = this.commonService.formatDate(date2).date;
    var dateArr = [];
    var i = 0;
    while (!(this.commonService.formatDate(date1).times > this.commonService.formatDate(date2).times)) {
      var dayStr = date1.getDate().toString();
      var dateMonth = date1.getMonth() + 1;
      var dateMonthStr;
      if (dayStr.length == 1) {
        dayStr = "0" + dayStr;
      }
      if ((dateMonth + "").length == 1) {
        dateMonthStr = '0' + dateMonth;
      } else {
        dateMonthStr = dateMonth;
      }
      dateArr[i] = date1.getFullYear() + "-" + dateMonthStr + "-" + dayStr;
      i++;
      date1.setDate(date1.getDate() + 1);
    }

    return dateArr;

  }

  /**
   * 获取初始化按钮数据
   */
  public getBtn() {
    let _that = this;
    this.commonRequestService.getMenuBtn(this.menuId, _that, (res) => {
      if (res && res.success == 1) {
        _that.button = _that.commonService.viewBtn(res.rows);
        _that.journalInfoService.button = _that.button;
      } else if (res.success == -1) {
      }
    }
    )
  }

  /**
   * 给body设置click事件，通过冒泡使弹窗消失
   */
  public modalHidden() {
    let that = this;
    let component = $('.login-journal')[0];
    this.commonService.addEvent(component, 'click', function (event) {
      if (that.listItem) {
        that.listItem = false; // 列表项消失
      }
      if (that.downloadIsShow) {
        that.downloadIsShow = false; // 下载项消失
      }
      //  是日历的弹窗消失
      if (!that.isClick) return;
      if (that.isClick && that.isClick == 'self') {
        that.getRouteParams();
      }
    }, false);
  }

  /**
   * 设置日历的最大和最小可选择日期
   */
  public setMaxMinDate() {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 2;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    let nextMonth = (month === 11) ? 0 : month + 1;
    let nextYear = (nextMonth === 0) ? year + 1 : year;
    this.minDate = new Date();
    this.minDate.setMonth(prevMonth);
    this.minDate.setFullYear(year);
    let todayFormat = this.commonService.formatDate(today).formcatDate;
    let todayFormatTimes = todayFormat + ' 24:00';
    this.maxDate = new Date(todayFormatTimes);
  }

  /**
   * 获取当前的路由参数并设置日期区间到路由参数
   */
  public getRouteParams() {
    //  路由参数
    let routeParam = this.route.params['value'];
    let routeQueryParams = this.route.queryParams['value'];
    // 当前路由的时间范围
    let date = routeParam['rang'] ? routeParam['rang'] : routeQueryParams['rang'];
    let currentYear = new Date().getFullYear(); // 年
    let rep = new RegExp(currentYear.toString());
    if (!routeParam['rang'] && !routeQueryParams['rang']) {
      //  当没有路由参数rang（即没有选择时间范围）
      this.isClick = 'seven';
    } else {
      if (date == '7') {
        this.isClick = 'seven';
      } else if (date == '15') {
        this.isClick = 'fifteen';
      } else if (date == '30') {
        this.isClick = 'thirty';
      } else if (rep.test(date)) {
        this.isClick = 'self-init';
        this.isSelectedDate = true;
        //  匹配 ， 前后的内容
        let index = date.indexOf(',');
        this.dateStart = new Date(date.slice(0, index));
        this.dateEnd = new Date(date.slice(index + 1, date.length));
        this.dateEndShow = this.commonService.formatDate(this.dateEnd).formatTime;
        this.dateStartShow = this.commonService.formatDate(this.dateStart).formatTime;
        this.isClick = this.commonService.formatDate(this.dateStart).formatTime + ',' + this.commonService.formatDate(this.dateEnd).formatTime;
      }
    }
    this.dateRang(this.isClick);
  }

  /**
   * 确定当前选择的时间范围
   * @param clickedDom 当前选择的时间范围
   */

  public dateRang(clickedDom: string) {
    this.dateEndShow = this.commonService.formatDate(this.dateEnd).formatTime;
    if (clickedDom == 'self') return;
    //  获取原本的路由参数
    let routeParam = this.route.params['value'];
    let routeQueryParams = this.route.queryParams['value'];
    var obj = $.extend({}, routeParam, routeQueryParams);
    //  取路由的地址，不要参数
    var url = this.router.url.replace(/(;|\?)\S+/, '');
    switch (clickedDom) {
      case 'seven':
        this.dateStart = new Date(new Date().getTime() - 86400000 * 6);
        this.dateStartShow = this.commonService.formatDate(this.dateStart).formatTime;
        obj.rang = '7';
        break;
      case 'fifteen':
        this.dateStart = new Date(new Date().getTime() - 86400000 * 14);
        this.dateStartShow = this.commonService.formatDate(this.dateStart).formatTime;
        obj.rang = '15';
        break;
      case 'thirty':
        this.dateStart = new Date(new Date().getTime() - 86400000 * 29);
        this.dateStartShow = this.commonService.formatDate(this.dateStart).formatTime;
        obj.rang = '30';
        break;
      default:
        obj.rang = clickedDom;
        this.dateStartShow = this.commonService.formatDate(this.dateStart).formatTime;
        this.dateEndShow = this.commonService.formatDate(this.dateEnd).formatTime;
    }
    this.router.navigate([url], { queryParams: obj });
    this.initLoginListData();
  }


  /**
   * 改变屏幕宽度和屏幕高度的值
   * @param arr 列表数据
   */
  changeListSreenData(arr: any) {
    if (arr.length > 0) {
      for (let item of arr) {
        item.screenWidth = item.screenWidth == 0 ? '' : item.screenWidth;
        item.screenHeight = item.screenHeight == 0 ? '' : item.screenHeight;
        item.duration = item.duration == 0 ? '' : item.duration;
      }
    }

  }


  /**
   * 获取应用列表中的应用名称和应用id
   * @param arr 应用列表
   * @return {  appIdString: string,appIdArr: array}
   * @return appIdString 向后台请求使的appId请求格式
   * @return appIdArr 在页面渲染的数据格式
   *
   */
  public getAppValue(arr: any) {
    let appId = '';
    let dropdownDataValue = [];
    for (var i = 0; i < arr.length; i++) {
      let item = arr[i];
      appId = item.objectId + ',' + appId;
      let mutiSelectData = { label: item.appName, value: item.objectId }
      dropdownDataValue.push(mutiSelectData);
    }
    return {
      appIdString: (appId.slice(0, appId.length - 1)),
      appIdArr: dropdownDataValue
    }
  }

  /**
   * 所有下拉框的数据集合
   */
  public dropdownListData(appList?: any) {
    this.dropdownData.clientType = clientTypeData;
    this.dropdownData.os = osData;
    this.dropdownData.enterpriseAuthStatus = enpAuthStatusData;
    let appId = this.getAppValue(appList).appIdArr;
    this.dropdownData.appId = this.getAppValue(appList).appIdArr;

  }

  /**
   * 选择过滤的条件
   * @param e 事件对象
   * @param i 当前的索引
   */
  public changeSelectData(e, i) {
    this.filterSearchData[i][1] = null;
    if (e.value.name == 'appName') {
      this.filterSearchData[i][2] = 'appId';
    } else if (e.value.name == 'clientType') {
      this.filterSearchData[i][2] = 'clientType';
    } else if (e.value.name == 'os') {
      this.filterSearchData[i][2] = 'os';
    } else if (e.value.name == 'enterpriseAuthStatus') {
      this.filterSearchData[i][2] = 'enterpriseAuthStatus';
    } else {
      // 如果没有下拉选项，清除数组的最后一项
      this.filterSearchData[i].pop();

    }
    this.dropdownListData(this.appList);
  }


  /**
   * 自定义选择时间
   */

  datePicker(e) {
    var e = e || window.event;
    var obj = e.target || e.srcElement;
    //  当前点击的元素id值
    let clickedDom = obj.id;
    if (clickedDom == '') {
      return;
    } else if (clickedDom != 'self' && this.isSelectedDate) {
      //  当点击不是自定义时
      this.isSelectedDate = false;
    }
    //  console.log(this.isSelectedDate);
    this.isClick = clickedDom;
    this.dateEnd = new Date(); // 结束时间
    this.dateRang(clickedDom);
    this.commonService.stopBubble(e);

  }


  /**
   * 取消冒泡
   * @param e 事件对象
   */
  stopBubble(e) {
    this.commonService.stopBubble(e);
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
    //  显示当前选择时间
    this.isSelectedDate = true;
    //  时间选择弹窗消失
    this.isClick = 'date-picker';
    //  阻止冒泡
    this.commonService.stopBubble(e);

    let msDateEnd = this.commonService.formatDate(this.dateEnd).times;
    let msDateStart = this.commonService.formatDate(this.dateStart).times;
    //  时间范围
    let rang = this.commonService.formatDate(this.dateStart).formcatDate + ',' + this.commonService.formatDate(this.dateEnd).formcatDate;
    this.dateRang(rang)
  }

  /**
   * 添加下一列
   * @param row 当前列数
   */
  addValue(e?, row?) {
    if (row < 4) {
      this.row = row + 1;
    }
    this.isSearched = false;
  }

  //  移除输入框的输入内容
  removeValue(e) {
    this.isSearched = false;
  }












  /**
   * 筛选条件重置
   * @param row 用户输入的内容
   */
  reset(row) {
    this.filterSearchData.splice(row, 1);
    this.filterSearchData.push([null, null]);
    if (this.row > 0) {
      this.row = this.row - 1;
    } else {
      this.row = 0;
    }
    this.isSearched = false;
  }

  /**
   * 搜索条件
   * @param arr：应用列表数组
   */
  public searchCondition(arr?: any) {
    if (!arr) arr = this.journalInfoService.appListData;
    //  应用列表
    let appValue = this.getAppValue(arr).appIdString;
    let dateEnd = this.dateEndShow ? this.dateEndShow : this.dateEnd;
    let dateStart = this.dateStartShow ? this.dateStartShow : this.dateStart;
    let value = {
      'filters': [
        { 'itemKey': 'loginTime', 'filter': 'gte', 'itemValue': this.commonService.formatDate(dateStart).times },
        { 'itemKey': 'loginTime', 'filter': 'lte', 'itemValue': this.commonService.formatDate(dateEnd).times },
        { 'itemKey': 'appId', 'filter': 'term', 'itemValue': appValue },
      ]
    };
    //  筛选条件
    for (var i = 0; i < this.filterSearchData.length; i++) {
      let item = this.filterSearchData[i];
      if (this.filterSearchData[0][0] == null && this.filterSearchData[0][1] == null) {
        //  如果数组的第一项为null
        return value;
      } else if (item[0] != null && item[1] != null) {
        //  当数组有值
        if (item[2] == 'appId') { // 应用名称
          value.filters[2]['itemKey'] = item[2];
          value.filters[2]['filter'] = 'term';
          value.filters[2]['itemValue'] = item[1].join(',');
        } else if (item[2] == 'enterpriseAuthStatus') {
          var itemObj = {
            'itemKey': item[2] ? item[2] : item[0].name,
            'filter': 'contain',
            'itemValue': item[1],
          }
          value.filters.push(itemObj);
        } else {
          itemObj = {
            'itemKey': item[2] ? item[2] : item[0].name,
            'filter': 'contain',
            'itemValue': item[1].join(','),
          }
          value.filters.push(itemObj);
        }
      }
    }
    return value;
  }


  /**
   * 搜索
   */
  public search() {
    this.initLoginListData();

  }

  /**
   * 下载选项列是否显示
   */

  public downloadShow() {
    let that = this;
    //  列表项消失
    this.listItem = false;
    if (!this.selectData || (this.selectData && this.selectData.length == 0)) {
      this.commonService.growl(that, 'error', '没有数据可供导出');
      return;
    }
    this.downloadIsShow = !this.downloadIsShow;
  }

  /**
   * 选择下载项
   * @param e 事件对象
   */
  public downloadSelect(e) {

    //  下载项列表消失
    this.downloadIsShow = false;

    //  兼容FF
    let event = e || window.event;
    let srcElement = event.target || event.srcElement;
    let valueList;
    var downloadItems = {};
    downloadItems['userName'] = '用户姓名';
    if (srcElement.id == 'currentShow') {
      //  下载当前显示列

      valueList = this.options;
    } else if ((srcElement.id == 'all')) {
      //  下载所有列
      valueList = this.listData;
    }
    for (var i = 0; i < valueList.length; i++) {
      let key = valueList[i]['field'];
      let value = valueList[i]['header'];
      downloadItems[key] = value;
    }
    let token = window.localStorage['jasToken'];
    let params = {
      'downloadItems': JSON.stringify(downloadItems).replace(/"/g, "'"),
      'filtersString': JSON.stringify(this.searchCondition().filters).replace(/"/g, "'"),
      'orderBy': 'loginTime desc',
      'token': token,
      'pageNum': '-1'
    }
    let url = '/log/login/v2/download';
    let urls = this.journalInfoService.serviceName + url;
    this.journalInfoService.DownLoadFile({ url: urls, data: params })
  }

  /**
   * 列表项 显示
   */

  seletListItem() {

    this.listItem = !this.listItem;
    // 下载项消失
    this.downloadIsShow = false;
  }

  /**
   * 点击全选
   * @param el ul Dom元素
   */
  @ViewChild('ul') ul; // 列表项的ul
  @ViewChild('allCheckedInput') allCheckedInput; // 全选按钮
  // 设置全选的选中状态
  public allcheck: any = {
    IsAllCheckedInput: false
  };

  allChecked(el) {
    //  获取所有的列表项的input
    let childItemChecked = this.ul.nativeElement.getElementsByTagName('input');
    let allcheckedIsTrue = this.allCheckedInput.nativeElement.checked;
    //  当 isAllChecked['allChecked']为true时，全选，为false时，全部取消
    if (allcheckedIsTrue) {
      this.allcheck.IsAllCheckedInput = true;
      //  全选
      //  this.listData.splice(0, 1); // 删除第一项
      for (var i = 0; i < childItemChecked.length; i++) {
        childItemChecked[i].checked = true;
        this.listData[i].checked = true;
        this.options = [].concat(this.listData); //  选中的数据与列表项 的数据相同
        this.options.splice(0, 1);
      }
    } else {
      //  全部取消
      this.allcheck.IsAllCheckedInput = false;
      this.options = [];
      for (var i = 0; i < childItemChecked.length; i++) {
        childItemChecked[i].checked = false;
        childItemChecked[0].checked = true;
        this.listData[i].checked = false;
        this.listData[0].checked = true;
      }
      //  将冻结列设置为 不冻结
      this.dtFrozen.frozen = false;
      //  删除冻结列的dom
      this.frozenItem = false;
    }
  }


  /**
   * 选择 列表项中的每一个项
   * @param e 事件对象
   */

  selectOption(e) {

    //  index :是当前被选中的复选框在数据中索引
    let index = e.srcElement ? e.srcElement.value : e.target.value;
    let insertOptionsIndex = this.getInsertOptionsIndex(index);
    if (e.target.checked) {
      //  选中
      this.listData[index].checked = true;
      //  在列表的指定位置添加
      this.options.splice(insertOptionsIndex, 0, this.listData[index]);
      //  当不冻结列的选中列总宽度超过不冻结当前页面的宽度时，冻结为true
      if (this.options.length * 200 >= (this.screenWidth.nativeElement.clientWIdth - 300)) {
        this.dtFrozen.frozen = true;
      }
      //  当所有的列表项全部选中时，全选按钮显示选中状态
      if (this.options.length == this.listData.length - 1) {
        this.allcheck.IsAllCheckedInput = true;
      }
    } else if (e.target.checked == false) {
      //  取消
      this.listData[index].checked = false;
      this.allcheck.IsAllCheckedInput = false;
      if (this.options.length > 0) {
        for (var i = 0; i < this.options.length; i++) {
          let item = this.options[i];
          if (item['header'] == this.listData[index]['header']) {
            this.options.splice(i, 1);

          }

        }

      }

    }

  }

  /**
   * 获取列表项插入optios里的索引
   * @param index 是当前被选中的复选框在数据中索引
   * @return insertOptionsIndex 插入options 的索引
   */
  getInsertOptionsIndex(index: any) {
    let insertOptionsIndex;  // 被选中的列表项应该被插入的opition 的索引；
    index = index - 0; // 将选中的列表索引转换为number
    this.listData[index].index = index;
    let arr = []; // 存放options 的index值
    for (let item of this.options) {
      let optionsIndex = item.index;
      arr.push(optionsIndex);
    }
    arr.push(index);
    let selectArrIndex = arr.sort(function (a, b) {
      return a - b
    }).indexOf(index);

    for (let i = 0; i < this.options.length; i++) {
      let item = this.options[i];
      if (item.index == arr[selectArrIndex - 1]) {
        insertOptionsIndex = i + 1;
      }
    }
    return insertOptionsIndex;
  }

  /**
   * 翻页
   * @param event 存放当前页码和页容量
   */
  public paginate(event) {
    this.pageNum = event.currentPage;
    this.pageSize = event.itemsPerPage;
    // this.initLoginListData();
    this.getListData();
  }

  /**
   * 页容量改变
   * @param event 存放页容量
   */
  public sizeChanged(event) {
    this.pageSize = event;
    this.pageNum = 1; // 页容量改变时，页码值为1
    // this.initLoginListData();
    this.getListData();

  }
  /**
   * 将列表排序
   * 
   * @param {any} e 
   * @memberof LoginJournalComponent
   */
  changeSort(e) {
    console.log(e);
    let order;
    if (e.order == 1) {
      order = 'asc';
      // 正序
    } else if (e.order == -1) {
      // 倒序
      order = 'desc';
    }
    let _that = this;
    let orderName = e.field;
    this.orderName = e.field + " " + order;
    // this.initLoginListData();
    this.getListData();
  }

  /**
   * 获取列表的数据
   */
  getListData() {
    let _that = this;
    let url = '/log/login/v2/queryList';
    let params = {
      'filters': _that.searchCondition(_that.appList).filters,
      'pageSize': _that.pageSize,
      'pageNum': _that.pageNum,
      'orderBy': _that.orderName
    }
    _that.journalInfoService.searchData(_that, url, params, function (res) {
      if (res && res.code == 200 && res.success == 1) {
        //  成功获取数据
        _that.changeListSreenData(res.rows);
        _that.selectData = res['rows'];
        _that.totalItems = res["totalElements"];
        _that.size = res['size'];
        _that.totalPages = res['totalPages'];
        _that.changeEnpAuthStatus(res.rows);
        _that.commonService.growl(_that, 'success', '列表刷新成功');
        _that.isSearched = true;
      } else if (res.success == -1) {
        if (res.code == 400) {
          _that.commonService.growl(_that, 'error', '列表获取失败,请重新刷新页面');
        }
      }
    });
  }
}
