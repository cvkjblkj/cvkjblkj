import { ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { INCONFIG } from './../../../core/global';
import { CommonRequestService } from './../../../core/common-service/common-request.service';
import { AppListComponent } from './../../app-admin/app/app-list/app-list.component';
import { JournalInfoService } from './../shared/journal-info.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from './../../../core/common-service/common.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { businessFilterData, businesChangeTypeData } from './../shared/data';
import { BusinessLogData } from './shared/business-log.model';
import { BusinessLogServer } from './shared/business-log.service';

declare var $;
@Component({
  selector: 'app-business-log',
  templateUrl: './business-log.component.html',
  styleUrls: ['./business-log.component.scss', './../journal-info.component.scss'],
})
export class BusinessLogComponent implements OnInit {
  public isSearched: boolean = true; //搜索按钮是否禁用
  public appList: any; //应用列表
  public loop: any; //筛选条件遍历的条件
  public filterSearchData: any; //筛选条件的初始化数据
  public row: any = 0; //筛选条件的初始列数
  public dropdownData: any; //下拉框的数据集合（例如：应用名称）

  private journalLog: BusinessLogData[];    //业务日志记录,日志列表信息
  private journalLogData: any;    //一条业务日志记录

  // 页容量,分页功能数据
  public rowsPerPageOptions = ['10', '20', '30'];
  public pageSize: any = 10;
  public pageNum: any = 1;  //当前页码
  public totalItems: string = '10';//总数据条数
  public maxSize: number = 4;
  public totalPages: any = '10'; //总页数
  public size: any = '10';// 页码

  public sortF = "createTime";
  public sortO = -1;
  public orderName: any = "createTime desc"; // 列表中排序名称

  public businessFilterData: any; //筛选条件数据
  public unfrozenWidth = '600px';
  public isClick: any;  //时间搜索条件被点击
  public date: any;  //点击自定义，被选中的时间
  public isSelectedDate: any = false;  //点击自定义，展示被选中的时间，是否显示
  public dateEnd: Date = new Date() //自定义选择   结束时间
  public dateStart: Date = new Date(); //自定义选择 开始时间
  public dateStartShow: any; //自定义开始时间，在页面展示
  public dateEndShow: any; //自定义结束时间，在页面展示
  minDate: Date; //日历可选择的最小值

  maxDate: Date;  //日历可选择的最大值

  public emptyMessage: string = '未查到相关数据'; //primeng dataTable没有数据时，显示的内容
  public defaultLabel: string = '请选择--'; //p-multiSelect 在没有选择时显示。
  public zn: any; //日历的汉化配置项
  public msgs: any; //提示信息的内容
  public button: any = {};
  public menuId: any; //菜单id值


  constructor(
    public commonService: CommonService,
    public router: Router,
    private logServerAPI: BusinessLogServer,
    public route: ActivatedRoute,
    public journalInfoService: JournalInfoService,
    public commonRequestService: CommonRequestService,
    public confirmationService: ConfirmationService
  ) {
    Object.assign(this, { businessFilterData, businesChangeTypeData });
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
  }

  ngOnInit() {
    this.menuId = this.route.snapshot.queryParams['id'] ? this.route.snapshot.queryParams['id'] : this.route.snapshot.params['id'];
    this.setMaxMinDate();
    this.getRouteParams();
    this.modalHidden();
    // this.getBusinessLog();
    if (!this.journalInfoService.button) {
      this.getBtn();
    } else {
      this.button = this.journalInfoService.button;
    }

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
      } else if (res.success == -1) { }
    }
    )
  }
  /**
   * 获取业务日志数据
   */
  getBusinessLog() {
    let params = {
      // 'appType': 2,
      'pageNum': -1
    };
    let __this = this;
    this.commonRequestService.getAppNameList(params, __this, function (res) {
      if (res && res.success == 1) {
        __this.appList = res['rows'];
        __this.journalInfoService.appListData = __this.appList;
        let url = '/log/business/v2/queryList';
        let params = {
          'filters': __this.searchCondition(__this.appList).filters,
          'pageSize': __this.pageSize,
          'pageNum': __this.pageNum,
          'orderBy': __this.orderName
        }
        __this.journalInfoService.searchData(__this, url, params, function (res) {
          if (res.code == '200' && res.success == 1) {
            __this.journalLog = res.rows;
            __this.totalItems = res["totalElements"];
            __this.size = res['size'];
            __this.totalPages = res['totalPages'];
            __this.commonService.growl(__this, 'success', '列表刷新成功');
          } else if (res.success == -1) {
            if (res.code == 400) {
              __this.commonService.growl(__this, 'error', '列表获取失败,请重新刷新页面');
            }

          }
        })
      }
    });
  }

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
    // 路由参数
    let routeParam = this.route.params['value'];
    let routeQueryParams = this.route.queryParams['value'];
    //当前路由的时间范围
    let date = routeParam['rang'] ? routeParam['rang'] : routeQueryParams['rang'];
    let currentYear = new Date().getFullYear(); //年
    let rep = new RegExp(currentYear.toString());
    if (!routeParam['rang'] && !routeQueryParams['rang']) {
      // 当没有路由参数rang（即没有选择时间范围）
      this.isClick = 'seven';
      this.dateStart = new Date(new Date().getTime() - 86400000 * 7);
    } else {
      if (date == '7') {
        this.isClick = 'seven';
      } else if (date == '15') {
        this.isClick = 'fifteen';
        this.dateStart = new Date(new Date().getTime() - 86400000 * 15);
      } else if (date == '30') {
        this.isClick = 'thirty';
        this.dateStart = new Date(new Date().getTime() - 86400000 * 30);
      } else if (rep.test(date)) {
        this.isClick = 'self-init';
        this.isSelectedDate = true;
        // 匹配 ， 前后的内容
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
    // console.log(appId.slice(0, appId.length - 1));
    return {
      appIdString: (appId.slice(0, appId.length - 1)),
      appIdArr: dropdownDataValue
    }
  }

  /**
   * 所有下拉框的数据集合
   */
  public dropdownListData(appList?: any) {
    this.dropdownData.modifyType = businesChangeTypeData;
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
      this.filterSearchData[i][2] = 'appId'
    } else if (e.value.name == 'modifyType') {
      this.filterSearchData[i][2] = 'modifyType'
    } else {
      //如果没有下拉选项，清除数组的最后一项
      this.filterSearchData[i].pop();
    }
    this.dropdownListData(this.appList);
  }


  /**
   * 下载日志数据
   */
  downloadData() {
    let _this = this;
    if (this.journalLog && this.journalLog.length == 0) {
      this.commonService.growl(_this, 'error', '没有数据可供导出');
      return;
    }
    let token = window.localStorage['jasToken'];
    let appList = this.journalInfoService.appListData;
    let url = '/log/business/v2/download';
    let filters = JSON.stringify(this.searchCondition(appList).filters).replace(/"/g, "'");
    let downloadItems = "{ 'userName': '用户姓名','userId':'用户ID','enterpriseName':'企业名称','enterpriseId':'企业ID', 'appName': '应用名称','appVersion':'应用版本','appId':'应用ID', 'functionName': '功能名称','userIp':'用户IP','createTime':'创建时间','serviceName':'微服务名称','serviceIp':'服务端IP','servicePort':'服务端端口','requestURI':'请求URI','modifyType':'变更类型','dataId':'数据ID','detail':'详情','remark':'备注' }";
    let params = {
      'downloadItems': downloadItems,
      'filtersString': filters,
      'orderBy': 'createTime desc',
      'token': token,
      'pageNum': -1,
    };

    let urls = this.journalInfoService.serviceName + url;
    // this.journalDownLoadFile({ url: urls, data: params });
    this.journalInfoService.DownLoadFile({ url: urls, data: params })
  }




	/**
	 * 翻页
	 * @param event 存放当前页码和页容量
	 */
  public paginate(event) {
    this.pageNum = event.currentPage;
    this.pageSize = event.itemsPerPage;
    this.getBusinessLog();
  }
	/**
	 * 页容量改变
	 * @param event 存放页容量
	 */
  public sizeChanged(event) {
    this.pageSize = event;
    this.pageNum = 1; //页容量改变时，页码值为1
    this.getBusinessLog();
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
    this.getBusinessLog();
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
  * 自定义选择时间
  */

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
    this.dateEnd = new Date();
    this.dateRang(clickedDom);
    this.commonService.stopBubble(e);

  }
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
      case 'seven':
        this.dateStart = new Date(new Date().getTime() - 86400000 * 6);
        this.dateStartShow = this.commonService.formatDate(this.dateStart).formatTime;
        obj.rang = '7';
        this.router.navigate([url], { queryParams: obj });
        this.getBusinessLog();
        break;
      case 'fifteen':
        this.dateStart = new Date(new Date().getTime() - 86400000 * 14);
        this.dateStartShow = this.commonService.formatDate(this.dateStart).formatTime;
        obj.rang = '15';
        this.router.navigate([url], { queryParams: obj });
        this.getBusinessLog();
        break;
      case 'thirty':
        this.dateStart = new Date(new Date().getTime() - 86400000 * 29);
        this.dateStartShow = this.commonService.formatDate(this.dateStart).formatTime;
        obj.rang = '30';
        this.router.navigate([url], { queryParams: obj });
        this.getBusinessLog();
        break;
      default:
        obj.rang = clickedDom;
        this.router.navigate([url], { queryParams: obj });
        this.dateStartShow = this.commonService.formatDate(this.dateStart).formatTime;
        this.dateEndShow = this.commonService.formatDate(this.dateEnd).formatTime;
        this.getBusinessLog();

    }
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
    let rang = this.commonService.formatDate(this.dateStart).formcatDate + ',' + this.commonService.formatDate(this.dateEnd).formcatDate;
    this.dateRang(rang);
  }

  /**
   * 添加下一列
   * @param row 当前列数
   */
  addValue(e, row) {
    this.isSearched = false;
    if (row < 4) {
      this.row = row + 1;
    }

  }
  // 移除输入框的输入内容
  removeValue(e) {
    this.isSearched = false;
  }
  /**
   * 筛选条件重置
   * @param row 用户输入的内容
   */
  reset(row) {
    this.isSearched = false;
    this.filterSearchData.splice(row, 1);
    this.filterSearchData.push([null, null]);
    if (this.row > 0) {
      this.row = this.row - 1;
    } else {
      this.row = 0;
    }
  }
  /**
   * 搜索条件
   * @param arr：应用列表数组
   */
  public searchCondition(arr: any) {
    arr = arr ? arr : this.journalInfoService.appListData;
    // 应用列表
    let appValue = this.getAppValue(arr).appIdString;
    let dateEnd = this.dateEndShow ? this.dateEndShow : this.dateEnd;
    let dateStart = this.dateStartShow ? this.dateStartShow : this.dateStart;
    let value = {
      'filters': [
        { 'itemKey': 'createTime', 'filter': 'gte', 'itemValue': this.commonService.formatDate(dateStart).times },
        { 'itemKey': 'createTime', 'filter': 'lte', 'itemValue': this.commonService.formatDate(dateEnd).times },
        { 'itemKey': 'appId', 'filter': 'term', 'itemValue': appValue },
      ]
    }
    // 筛选条件
    for (var i = 0; i < this.filterSearchData.length; i++) {
      let item = this.filterSearchData[i];
      if (this.filterSearchData[0][0] == null && this.filterSearchData[0][1] == null) {
        // 如果数组的第一项为null
        return value;
      } else if (item[0] != null && item[1] != null) {
        // 当数组有值
        if (item[2] == 'appId') { //应用名称
          value.filters[2]['itemKey'] = item[2];
          value.filters[2]['filter'] = 'term';
          value.filters[2]['itemValue'] = item[1].join(',');
          // var itemObj = {
          //   'itemKey': 'appId',
          //   'filter': 'term',
          //   'itemValue': item[1].join(','),
          // }
          // value.filters.push(itemObj);
        } else {
          var itemObj = {
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
  search() {
    this.getBusinessLog();
    this.isSearched = true;
  }

  /**
   * 查看数据详情
   * @param viewModal 弹窗
   * @param data 当前列表项信息
   */
  public IsdetaiList: any; //是够有变更记录的详情数据
  public detailList: any; //变更记录数组数据
  @ViewChild('modalContent') modalContent: any; //
  viewShow(viewModal: any, data: any) {
    this.detailList = []; //清空数据

    this.modalContent.nativeElement.style.height = $('body')[0].clientHeight - 150 + 'px';
    this.modalContent.nativeElement.style.overflow = "auto";
    this.journalLogData = null;
    this.journalLogData = data;
    let detail = this.journalLogData.detail;
    if (typeof detail == 'string' && detail.length == 0) {
      this.IsdetaiList = true;
    } else {
      if (this.isJSON(detail) === true) {
        this.IsdetaiList = true;
        this.detailList = JSON.parse(detail);
      } else {
        this.IsdetaiList = false;
      }
    }

    viewModal.show();
  }

  /**
   * 判断是否为json字符串
   * @param str 判断的字符串
   */
  public isJSON(str) {
    if (typeof str == 'string') {
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }

}




