import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from './../../../core/common-service/common.service';
import { INCONFIG } from './../../../core/global';
import { MonitorService } from './../shared/monitor.service'
@Component({
  selector: 'master-monitor',
  templateUrl: './master-monitor.component.html',
  styleUrls: ['./master-monitor.component.scss']
})
export class MasterMonitorComponent implements OnInit {
  public isClick: any;  //时间搜索条件被点击
  public date: any;  //点击自定义，被选中的时间
  public isSelectedDate: any = false;  //点击自定义，展示被选中的时间，是否显示


  public dateEnd: Date; //自定义选择   结束时间
  public dateStart: Date; //自定义选择 开始时间
  public dateStartShow: any = new Date(); // 自定义开始时间，在页面展示
  public dateEndShow: any; // 自定义结束时间，在页面展示
  public maxDate: any; // 最大的时间
  private zn: any;  // 日历区域配置属性的

  public item: boolean = true;
  public Active: boolean = false;
  public isActive: boolean = true;
  public isItem: boolean = false;


  public typeNameList: any; // 下拉框数据
  private typeName: any; // 对象的值
  private selectedType: any = {}; // 选中的对象 数据  {typeName:'',instanceId:'' }
  private objRouteParams: any; //  给tab页面传的路由参数
  private routeStatesBasic: any;  // 基础监控的路由激活状态
  private routeStatesHandle: any;  // 操作系统监控的路由激活状态

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public commonService: CommonService,
    public monitorService: MonitorService
  ) {
    this.zn = INCONFIG.zn;
  }

  ngOnInit() {
    // 判断路由的激活状态
    this.routeStatesBasic = this.router.url.indexOf('base-monitor');
    this.routeStatesHandle = this.router.url.indexOf('handle-monitor');

    this.modalHidden();
    this.getTypeNameData();
    this.setMaxMinDate();


  }

  ////////////////  对象处理    /////////////////////

  /**
   * 获取  对象下拉框的内容
   *
   * @memberof MasterMonitorComponent
   */
  public getTypeNameData() {

    let __this = this;
    let url = '/monitor/domain/v2/queryList';
    let params = {
      'filters': [{ "itemKey": "typeName", "filter": "contains", "itemValue": "ecs" }]
    };
    __this.monitorService.searchData(__this, url, params, function (res) {
      if (res && res.code == 200 && res.success == 1) {

        __this.typeNameList = __this.changeTypeNameData(res['rows']);

        // 设置默认值
        __this.typeName = __this.typeNameList[1].value;
        __this.selectedType = {
          'typeName': __this.typeName,
          'instanceId': __this.typeNameList[1].value,
        };
        __this.getRouteParams();

      }
    })
  };

  /**
   * 改变 dropdown的 数据结构
   */
  public changeTypeNameData(arr: any) {
    let primengDropDown = [];
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var data = {
        label: item.instanceAlias,
        value: item.instanceId,
      }
      arr[i] = data;
      primengDropDown.push(data);
    }
    return primengDropDown;
  };



  /**
   * 下拉框选中值
   */

  public onChangeType(event) {
    let newParams = {};
    // 取当前的时间
    let currentRouteTime = this.route.queryParams['value'].rang ? this.route.queryParams['value'] : this.route.params['value'];

    for (let key in currentRouteTime) {
      newParams[key] = currentRouteTime[key];
    }
    newParams['typeName'] = event.label;
    newParams['instanceId'] = event.value;
    this.selectedType = {
      'typeName': event.label,
      'instanceId': event.value,
    };
    // 取路由的地址，不要参数
    var url = this.router.url.replace(/(;|\?)\S+/, '');
    this.router.navigate([url], { queryParams: newParams })
  }



  /**
   * 路由跳转
   *
   * @memberof MasterMonitorComponent
   */
  routelinkBasic() {
    this.routeStatesHandle = -1;
    this.routeStatesBasic = 1;
    // 取路由的地址，不要参数
    var urls = this.router.url.slice(0, this.router.url.indexOf('master-monitor')) + 'master-monitor/base-monitor';
    this.router.navigate([urls], { queryParams: this.objRouteParams });

  }
  /**
   * 跳转到操作系统
   *
   * @memberof MasterMonitorComponent
   */
  routelinkHandle() {
    this.routeStatesBasic = -1;
    this.routeStatesHandle = 1;
    // 取路由的地址，不要参数
    var urls = this.router.url.slice(0, this.router.url.indexOf('master-monitor')) + 'master-monitor/handle-monitor';
    // console.log(urls);
    this.router.navigate([urls], { queryParams: this.objRouteParams });

  }



  /**
   * 给body设置click事件，通过冒泡使弹窗消失
   *
   * @memberof MasterMonitorComponent
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
   * 设置日历的最大和最小可选择日期
   *
   * @memberof MasterMonitorComponent
   */
  public setMaxMinDate() {
    let today = new Date();
    let todayFormat = this.commonService.formatDate(today).formcatDate;
    let todayFormatTimes = todayFormat + ' 24:00';
    this.maxDate = new Date(todayFormatTimes);
  };

  /**
   * 选择时间
   *
   * @param {any} e
   * @returns
   * @memberof MasterMonitorComponent
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
    }

    this.dateRang(this.isClick);
  };
  /**
* 取消冒泡
* @param e 事件对象
*/
  stopBubble(e) {
    this.commonService.stopBubble(e);
  }

  /**
   * 确定当前选择的时间范围
   *
   * @param {string} clickedDom 当前选择的时间范围
   * @returns
   * @memberof MasterMonitorComponent
   */
  public dateRang(clickedDom: string) {
    this.dateEndShow = this.commonService.formatDate(this.dateEnd).formatTime;
    if (clickedDom == 'self') return;
    // 获取原本的路由参数
    let routeParam = this.route.params['value'];
    let routeQueryParams = this.route.queryParams['value'];
    this.objRouteParams = $.extend({}, routeParam, routeQueryParams);
    // 取路由的地址，不要参数
    var url = this.router.url.replace(/(;|\?)\S+/, '');
    //为了每次点击按钮，子组件都相应事件而加的，当路由发生改变的时候 子组件才出发事件。
    this.objRouteParams.key =  Math.random();
    switch (clickedDom) {
      case 'one':
        this.dateStart = new Date(new Date().getTime() - 3600000 * 1);
        this.objRouteParams.rang = '1h';
        this.objRouteParams.typeName = this.selectedType.typeName;
        this.objRouteParams.instanceId = this.selectedType.instanceId;;
        this.dateRequeset(url, this.objRouteParams);

        break;
      case 'three':
        this.dateStart = new Date(new Date().getTime() - 3600000 * 3);
        this.objRouteParams.rang = '3h';
        this.objRouteParams.typeName = this.selectedType.typeName;
        this.objRouteParams.instanceId = this.selectedType.instanceId;;
        this.dateRequeset(url, this.objRouteParams);

        break;
      case 'six':
        this.dateStart = new Date(new Date().getTime() - 3600000 * 6);
        this.objRouteParams.rang = '6h';
        this.objRouteParams.typeName = this.selectedType.typeName;
        this.objRouteParams.instanceId = this.selectedType.instanceId;;
        this.dateRequeset(url, this.objRouteParams);
        break;
      default:
        this.objRouteParams.rang = clickedDom;
        this.objRouteParams.typeName = this.selectedType.typeName;
        this.objRouteParams.instanceId = this.selectedType.instanceId;;
        this.dateStartShow = this.commonService.formatDate(this.dateStart).formatTime;
        this.dateEndShow = this.commonService.formatDate(this.dateEnd).formatTime;
        this.router.navigate([url], { queryParams: this.objRouteParams });

    }
  };
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





}
