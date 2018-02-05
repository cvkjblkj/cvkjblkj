import { ConfirmationService } from 'primeng/primeng';
import { INCONFIG } from './../../../../core/global';
import { JournalInfoService } from './../../shared/journal-info.service';
import { CommonRequestService } from './../../../../core/common-service/common-request.service';
import { CommonRequestMethodService } from './../../../../core/common-service/request-method.service';
import { CommonService } from './../../../../core/common-service/common.service';
import { Component, OnInit, OnChanges, ViewChild, AfterViewInit, AfterContentInit, Output } from '@angular/core';
import { nginxServiceFilterData, loginRankData } from './../../shared/data';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any; // 引入jQuery
import { GlobalState } from './../../../../global.state'; //  一级菜单收缩按钮事件消息服务
import { Subscription } from 'rxjs/Subscription';
import { JasCommunicationsService } from './../../../jas/shared/jas.commumication.service'
@Component({
  selector: 'nginx',
  templateUrl: 'nginx-container.component.html',
  styleUrls: ['./nginx-container.conponent', './../system-log.component.scss', './../../journal-info.component.scss', './../../business-log/business-log.component.scss'],
})
export class NginxContainerComponent implements OnInit {

  public isSearched: boolean = true;
  public loop: any; //筛选条件 遍历的条件
  public filterSearchData: any; //筛选条件的初始化数据
  public row: any = 0; //筛选条件的初始列数
  public dropdownData: any; //下拉框的数据（例如：应用名称）

  public isClick: any;  //时间搜索条件被点击
  public isDisabled: boolean = false;
  public frozenItem: boolean = true
  public dateEnd: any = new Date(); //自定义选择   结束时间 与插件  相联系
  public dateStart: any = new Date(); //自定义选择 开始时间 与插件  相联系
  public dateStartShow: any = new Date(); //自定义开始时间，在页面展示
  public dateEndShow: any; //自定义结束时间，在页面展示
  // minDate: any; //最小的时间
  maxDate: any; //最大的时间
  private zn: any;  //日历区域配置属性的
  public isSelectedDate: any = false;  //点击自定义，展示被选中的时间，是否显示
  public emptyMessage: string = '未查到相关数据'; //primeng dataTable没有数据时，显示的内容
  public defaultLabel: any = '请选择--'; //p-multiSelect 在没有选择时显示。
  public selectListData: any; //列表数据
  public appList: any; //应用列表
  public detailData: any; //详情数据
  public listDivWidth: any;//  列表的宽度
  public colNumber: any; //  当前列表渲染的列数
  // 页容量
  public rowsPerPageOptions = ['10', '20', '30'];
  public pageSize: string = '10'; //页容量
  public pageNum: any = 1; //页码
  public maxSize: number = 5;
  public totalPages: any;  //总页数
  public size: any; // 当前页容量
  private totalItems: any; //总数据条数
  public button: any = {};
  public menuId: any; //菜单id值
  public options: any = [];
  public sortF = "timestamp";
  public sortO = -1;
  public orderName: any = '@timestamp desc';
  @ViewChild('listDiv') listDiv;  //  primeNg table所在区域
  @ViewChild('dtFrozen') dtFrozen; // dataTable column
  @ViewChild('screenWidth') screenWidth; // 屏幕宽度
  @ViewChild('dt') dt;  // primeng  dateTable定义的变量
  private subscription: Subscription;
  // public Property: boolean = false;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public commonService: CommonService,
    public commonRequestMethodService: CommonRequestMethodService,
    public commonRequestService: CommonRequestService,
    public journalInfoService: JournalInfoService,
    public confirmationService: ConfirmationService,
    public globaStateService: GlobalState,
    public jasCommunicationService: JasCommunicationsService,
  ) {
    Object.assign(this, { nginxServiceFilterData });
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

  ngOnInit() {
    this.menuId = this.route.snapshot.queryParams['id'] ? this.route.snapshot.queryParams['id'] : this.route.snapshot.params['id'];
    this.getRouteParams();
    this.setMaxMinDate();

    this.modalHidden();
    if (!this.journalInfoService.button) {
      this.getBtn();
    } else {
      this.button = this.journalInfoService.button;
    }
    this.options = [

      { 'field': 'appCode', 'header': '应用编码' },

      { 'field': 'remote', 'header': '客户端IP' },
      { 'field': 'timestamp', 'header': '创建时间' },
      { 'field': 'path', 'header': '请求URL' },
      { 'field': 'httpVersion', 'header': 'HTTP协议' },
      { 'field': 'code', 'header': '状态码' },
      { 'field': 'size', 'header': '文件大小(Bytes)' },
      // { 'field': 'referer', 'header': '页面跳转信息' },
      { 'field': 'agent', 'header': '客户端信息' },
      { 'field': 'xforward', 'header': '代理用户真实IP' }
    ];
    this.selectListData = [];
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
* 将列表排序
*
* @param {any} e
* @memberof LoginJournalComponent
*/
  changeSort(e) {
    let order;
    let orderField
    if (e.order == 1) {
      order = 'asc';
      // 正序
    } else if (e.order == -1) {
      // 倒序
      order = 'desc';
    }
    if (e.field == 'timestamp') {
      orderField = '@' + e.field
    } else {
      orderField = e.field
    }
    this.orderName = orderField + " " + order;
    // this.initLoginListData();
    this.initLoginListData();
  }
  /**
   *页面的 列表初始化数据
   */
  public initLoginListData() {
    // 应用列表的数据请求参数
    let params = {
      // 'appType': 2,
      'pageNum': -1
    };
    let __this = this;
    this.commonRequestService.getAppNameList(params, __this, function (res) {
      if (res.success == 1) {
        __this.appList = res['rows'];
        __this.journalInfoService.appListData = res['rows'];
        let value = JSON.stringify(__this.searchCondition(__this.appList).filters);
        let url = '/log/system/nginx/v2/queryList';
        let params = {
          'filters': __this.searchCondition(__this.appList).filters,
          'pageSize': __this.pageSize,
          'pageNum': __this.pageNum,
          'orderBy': __this.orderName,
          // "indexName": "paas-nginx",
          // "indexType": "fluentd",
        }
        __this.journalInfoService.searchData(__this, url, params, function (res) {
          if (res && res.code == 200 && res.success == 1) {
            // 成功获取数据
            __this.changeListSreenData(res.rows);
            __this.selectListData = res['rows'];
            for (var i = 0; i < __this.selectListData.length; i++) {

              if (__this.selectListData[i].path) {
                __this.selectListData[i].path = __this.selectListData[i].path.substring(0, 80);
              };
              if (__this.selectListData[i].agent) {
                __this.selectListData[i].agent = __this.selectListData[i].agent.substring(0, 80);
              }
              // if (__this.selectListData[i].referer) {
              //   __this.selectListData[i].referer = __this.selectListData[i].referer.substring(0, 80);
              // }
              __this.selectListData[i].timestamp = __this.selectListData[i].timestamp.substring(0, 19);

            }
            __this.size = res['size'];
            __this.growl('success', '列表刷新成功');
            // if (res["totalElements"] > 1000) {
            //   __this.Property = true;
            // } else {
            //   __this.Property = false;
            // }
            __this.totalItems = res["totalElements"];
            __this.totalPages = res['totalPages'];
            // if (res["totalElements"] > 1000) {
            //   __this.totalItems = 1000;
            //   __this.totalPages = 100;
            // } else {
            //   __this.totalItems = res["totalElements"];
            //   __this.totalPages = res['totalPages'];
            // }
            __this.isSearched = true;
          } else if (res.success == -1) {
            if (res.code == 400) {
              __this.commonService.growl(__this, 'error', '列表获取失败,请重新刷新页面');
            }
            // __this.growl('error', res.msg);
          }
        })
      }
    })
  }
  设置dataTable的不冻结宽度
  public setFrozenWidth(that) {
    that.listDivWidth = that.listDiv.nativeElement.clientWidth;
    that.colNumber = Math.ceil((that.listDivWidth - 20 - 210) / 210);
    if (that.screenWidth.nativeElement.hidden == false) {
      //  如果宽度大于不冻结列的宽度，冻结取消
      if (that.screenWidth.nativeElement.clientWidth - 210 > that.options.length * 210 || !that.frozenItem) {
        that.frozenItem = false;
      } else {
        that.dtFrozen.frozen = true;
        that.frozenItem = true;
      }
      //  列表项的数据不为空
      that.dt.unfrozenWidth = that.screenWidth.nativeElement.clientWidth - 210 + 'px';

    } else {
      that.dt.unfrozenWidth = that.listDivWidth - 210 - 20 + 'px';
    }
  };
  // @ViewChild('listDiv') listDiv;  // primeNg table所在区域
  ngAfterViewInit() {
    $('.border-set')[0].style.borderRight = '1px solid #f0f0f0';
    $('.border-set')[0].style.width = this.listDiv.nativeElement.clientWidth - 10 + "px";
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
  /**
 * 给body设置click事件，通过冒泡使弹窗消失
 */
  public modalHidden() {
    let __this = this;
    let body = document.getElementsByTagName('body')[0];
    this.commonService.addEvent(body, 'click', function (event) {
      // 是日历的弹窗消失
      if (!__this.isClick) return;
      if (__this.isClick && __this.isClick == 'self') {
        __this.getRouteParams();
      }
    }, false);
  }
  /**
 * 设置日历的最大和最小可选择日期
 */
  public setMaxMinDate() {
    let today = new Date();
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
  }
  /**
   * 取消冒泡
   * @param e 事件对象
   */
  stopBubble(e) {
    this.commonService.stopBubble(e);
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
        // item.duration = item.duration == 0 ? '' : item.duration;
      }
    }

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
    // this.dateStart = new Date();
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
        this.initLoginListData();
    }
  }
  /**
   * 改变路由和时间区间
   * @param url 路由
   * @param obj 时间区间
   */
  dateRequeset(url, obj) {
    this.dateEnd = new Date();
    this.dateStartShow = this.commonService.formatDate(this.dateStart).formatTime;
    this.dateEndShow = this.commonService.formatDate(this.dateEnd).formatTime;
    this.router.navigate([url], { queryParams: obj });
    this.initLoginListData();
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
    if (msDateEnd - msDateStart < 0) {
      // 如果结束时间小于开始时间,提示用户结束时间不得小于开始时间,并且搜索按钮禁用
      this.isDisabled = true;
    }

    // 时间范围
    let rang = this.commonService.formatDate(this.dateStart).formatTime + ',' + this.commonService.formatDate(this.dateEnd).formatTime;
    this.dateRang(rang);
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
    arr = arr ? arr : this.journalInfoService.appListData;
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
   * 选择过滤的条件
   * @param e 事件对象
   * @param i 当前的索引
   */
  public changeSelectData(e, i) {
    this.filterSearchData[i][1] = null;
    if (e.value.name == 'container_name') {
      this.filterSearchData[i][2] = 'container_name';
      this.dropdownListData(this.filterSearchData[i][2]);
    } else if (e.value.name == 'appCode') {
      this.filterSearchData[i][2] = 'appId'
    } else if (e.value.name == 'code') {
      this.filterSearchData[i][2] = 'code';
      this.dropdownListData(this.filterSearchData[i][2]);
    } else {
      //如果没有下拉选项，清除数组的最后一项
      this.filterSearchData[i].pop();
    }
    this.appIDListData(this.appList)
  }
  /**
   * 所有下拉框的数据集合
   */
  public appIDListData(appList?: any) {

    let appId = this.getAppValue(appList).appIdArr;
    this.dropdownData.appId = this.getAppValue(appList).appIdArr;

  }
  /**
  * 所有下拉框的数据集合
  */
  public dropdownListData(dropdownData?: any) {
    // this.dropdownData.container_name = [];
    // this.dropdownData.code = [];
    //日志级别的筛选数据
    let __this = this;
    if (dropdownData) {

      let url = '/log/system/nginx/v2/getValues';
      let params = {
        'fields': dropdownData,
        'pageSize': __this.pageSize,
        'pageNum': __this.pageNum,
        'orderBy': '@timestamp',
      }
      __this.journalInfoService.searchData(__this, url, params, function (res) {
        if (res && res.code == 200 && res.success == 1) {
          if (dropdownData == 'container_name') {
            __this.arrChange(res['rows'][0].container_name);

            __this.dropdownData.container_name = res['rows'][0].container_name;
          };
          if (dropdownData == 'code') {
            __this.arrChange(res['rows'][0].code);
            __this.dropdownData.code = res['rows'][0].code;
          }

        };
      });
    };
  };
  /**
   * 改变数据结构
   * @param arr
   * @param dropdownData
   */
  public arrChange(arr: any, ) {
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var data;
      data = {
        label: item,
        value: item
      };
      arr[i] = data;
    }
  };


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
    this.isSearched = false; //搜索按钮可以使用
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
  public searchCondition(arr?: any) {
    arr = arr ? arr : this.journalInfoService.appListData;
    // 应用列表
    let appValue = this.getAppValue(arr).appIdString;
    let dateEnd = this.dateEndShow ? this.dateEndShow : this.dateEnd;
    let dateStart = this.dateStartShow ? this.dateStartShow : this.dateStart;
    let value = {
      'filters': [
        { 'itemKey': '@timestamp', 'filter': 'gte', 'itemValue': this.commonService.formatDate(dateStart).times },
        { 'itemKey': '@timestamp', 'filter': 'lte', 'itemValue': this.commonService.formatDate(dateEnd).times },
        { 'itemKey': 'appId', 'filter': 'contain', 'itemValue': appValue },
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
        if (item[2] == 'appId') {
          value.filters[2]['itemKey'] = item[2];
          value.filters[2]['filter'] = 'term';
          value.filters[2]['itemValue'] = item[1].join(',');

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
  };

  /**
   * 搜索
   */
  search() {
    this.initLoginListData();

  };
  /**
   * 下载数据
   */
  downloadShow() {
    let dateEnd = this.dateEndShow ? this.dateEndShow : this.dateEnd;
    let dateStart = this.dateStartShow ? this.dateStartShow : this.dateStart;
    // console.log(dateEnd)
    // console.log(dateStart);
    let __this = this;
    if (this.selectListData && this.selectListData.length == 0) {
      this.commonService.growl(__this, 'error', '没有数据可供导出');
      return;
    }
    //'@timestamp': '创建时间',
    let token = window.localStorage['jasToken'];
    let downloadItems = "{'container_name': '容器名称','appCode': '应用编码','appId': '应用ID','remote': '客户端IP','@timestamp': '创建时间','path':'请求URL','httpVersion': 'HTTP协议', 'code': '状态码','size': '文件大小(Bytes)','referer':'页面跳转信息','agent': '客户端信息','xforward':'代理用户真实IP'}";
    let params = {
      'downloadItems': downloadItems,
      'filtersString': JSON.stringify(this.searchCondition().filters).replace(/"/g, "'"),
      'token': token,
      'orderBy': '@timestamp desc',
      'pageNum': -1
    }
    let url = '/log/system/nginx/v2/download';
    let urls = this.journalInfoService.serviceName + url;
    this.journalInfoService.DownLoadFile({ url: urls, data: params });
  };

  /**
 * 翻页
 * @param event 存放当前页码和页容量
 */
  public paginate(event) {
    this.pageNum = event.currentPage;
    this.pageSize = event.itemsPerPage;
    this.initLoginListData();
  };
	/**
	 * 页容量改变
	 * @param event 存放页容量
	 */
  public sizeChanged(event) {
    this.pageSize = event;
    this.pageNum = 1; //页容量改变时，页码值为1
    this.initLoginListData();
  };

	/**
	 * 提示信息
	 * @param rel 结果
	 * @param msg 显示信息
	 */
  public msgs: any = [];
  public growl(rel: any, msg: any) {
    this.msgs = [];
    this.msgs.push({ severity: rel, summary: '', detail: msg })
  };
}
