import { JournalInfoService } from './../../../journal-info/shared/journal-info.service';
import { GlobalState } from './../../../../global.state';
import { IOTDataShowService } from './../shared/IOT-data-show.service';
import { ViewChild } from '@angular/core';
import { historyListOption } from './../shared/data';
import { CommonRequestService } from './../../../../core/common-service/common-request.service';
import { Route, ActivatedRoute, Router, Params } from '@angular/router';
import { INCONFIG } from './../../../../core/global';
import { CommonService } from './../../../../core/common-service/common.service';
import { Component, OnInit } from '@angular/core';
declare var $: any; // jquery

@Component({
  selector: 'app-history-data',
  templateUrl: './history-data.component.html',
  styleUrls: ['./history-data.component.scss']
})
export class HistoryDataComponent implements OnInit {
  // 自定义选择时间
  private dateEnd: any = new Date(); // 自定义选择   结束时间 与插件  相联系
  private dateStart: any = new Date(); // 自定义选择 开始时间 与插件  相联系
  private dateStartShow: any = new Date(); // 自定义开始时间，在页面展示
  private dateEndShow: any; // 自定义结束时间，在页面展示
  private zn: any;  // 日历区域配置属性的
  private isSelectedDate: any = false;  //点击自定义，展示被选中的时间，是否显示
  public timeout: any = false;  // 超过最大时间
  // 第三方组件属性
  private emptyMessage: string = '未查到相关数据'; //primeng dataTable没有数据时，显示的内容
  // 页容量
  private rowsPerPageOptions = ['10', '20', '30'];
  private pageSize: any = 10; // 页容量
  private pageNum: any = 1; // 页码
  private maxSize: number = 5;
  private totalPages: any;  // 总页数
  private size: any; // 当前页容量
  private totalItems: any = 1000; // 总数据条数

  private totalData: any;
  // 按钮权限
  private button: any = {}; // button集合
  private menuId: any; // 菜单id值
  // 时间选择
  private isClick: any;  // 时间搜索条件被点击
  // 定义按钮是否可用
  private isDisabled: boolean = false;  // 下载按钮是否可用

  // 列表数据定义变量
  private historyListData: any; // 历史数据列表
  private listOption: any; // 历史数据options

  // echarts数据
  public echartsOption: any; // echartsOption
  public tagId: any; // 属性id
  public historyEchartsData: any; // echarts数据 
  // 列表数据修改
  public tagMessage: any;  // 具体的tag信息
  public attribute: any; // 属性名字
  public listDateType = {   // 数据类型
    "1": 'int8',
    "2": 'int16',
    "3": 'int32',
    "4": 'float32',
    "5": 'float64',
    "6": 'String'
  };
  public empty: any; // 数据是否为空
  @ViewChild('dt') dt: any; // primeng-dataTable 

  constructor(
    private commonService: CommonService,
    private commonRequestService: CommonRequestService,
    private route: ActivatedRoute,
    private router: Router,
    private IOTDataShowService: IOTDataShowService,
    private globaStateService: GlobalState,
    private journalInfoService: JournalInfoService
  ) {
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
    this.zn = INCONFIG.zn;
    this.listOption = historyListOption;
    this.echartsOption = {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: [],
      },
      yAxis: {
        type: 'value',
      },
      xAxis: {
        type: 'category',
        data: [],
      },
      series: [{ name: '', type: 'line', data: [] }]
    };
  }

  ngOnInit() {
    this.menuId = this.route.snapshot.queryParams['id'] ? this.route.snapshot.queryParams['id'] : this.route.snapshot.params['id'];
    if (!this.journalInfoService.button) {
      this.getBtn();
    } else {
      this.button = this.journalInfoService.button;
    }

    let _that = this;
    this.setFrozenWidth(_that);
    window.onresize = () => {
      _that.setFrozenWidth(_that);
    }

    this.route.queryParams.subscribe((params: Params) => {
      if (params['deviceName']) {
        this.empty = false;
        if (params['attribute'] == '') {
          this.empty = true;
          this.historyListData = [];
          return
        }
        this.tagId = params['attribute'];
        this.getRouteParams();

      }
    })
  }

  //  设置dataTable的不冻结宽度
  public setFrozenWidth(that) {
    // that.dt.unfrozenWidth = $('.echarts-effect')[0] ? $('.echarts-effect')[0].clientWidth - 400 + "px" : '0px';
  }
  // 初始化数据
  private initData() {
    this.initEchartsData();
    this.initListData();
  }

  /**
   * 页面的 图表初始化数据
   * 
   * @memberof HistoryDataComponent
   */
  private initEchartsData() {
    let params = this.setConditon();
    let __this = this;
    this.IOTDataShowService.getHistoryData(__this, params, (res) => {
      if (res && res.success == 1) {
        if (res.rows.length > 0) {
          __this.historyEchartsData = res.rows;
          __this.echartsOption = __this.IOTDataShowService.setRealTimeOPtions(__this.historyEchartsData);
          //  console.log(__this.echartsOption);

        } else {
          this.historyEchartsData = [];
        }
      }
    })
  }

  /**
   * 页面的 列表初始化数据
   * 
   * @memberof HistoryDataComponent
   */
  private initListData() {
    let params = this.setConditon();
    params.interval = 1;
    let __this = this;

    __this.IOTDataShowService.getHistoryDataById(__this, { 'tagId': this.tagId }, (res) => {
      if (res && res.success == 1) {
        __this.tagMessage = res.rows[0];
        __this.attribute = res.rows[0].tagName.slice(res.rows[0].tagName.indexOf('.') + 1, res.rows[0].tagName.length);
        __this.tagMessage['deviceName'] = res.rows[0].tagName.slice(0, res.rows[0].tagName.indexOf('.'));
        __this.tagMessage['dataType'] = this.listDateType[__this.tagMessage['dataType']];
        this.IOTDataShowService.getHistoryData(__this, params, (res) => {
          if (res && res.success == 1) {
            if (res.rows.length > 0) {
              __this.totalData = res.rows.reverse();
              let data = res.rows.reverse();
              __this.historyListData = data.slice(0, __this.pageSize);
              __this.totalPages = 1000 / __this.pageSize;
              __this.size = 10;
              // __this.changeListData(__this.historyListData, __this.tagMessage, __this);
            } else {
              __this.historyListData = [];
            }
          }
        })
      }
    })



  }

  /**
   * 处理listData
   * 
   * @param {any} arr  历史的列表数据 后台返回
   * @param {any} idMessage  tag的信息，根据id获取的
   * @param {any} that this指向
   * @memberof HistoryDataComponent
   */
  changeListData(arr, idMessage, that) {
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      item.attribute = item.tagName.slice(item.tagName.indexOf('.') + 1, item.tagName.length);
      // item.dataType = that.listDateType[item.dataType];
      item.description = idMessage.description;
      item.descriptionEx = idMessage.descriptionEx;
      item.address = idMessage.address;
      item.deviceName = idMessage.tagName.slice(0, idMessage.tagName.indexOf('.'));
    }
  }


  /**
   * 设置搜索条件
   * 
   * @returns 
   * @memberof HistoryDataComponent
   */
  setConditon() {
    let startTime = this.commonService.formatDate(this.dateStart).times;
    let endTime = this.commonService.formatDate(this.dateEnd).times;
    let params = {
      tagIds: this.tagId,
      beginTime: startTime,
      endTime: endTime,
      interval: Math.ceil((endTime - startTime) / (200 * 1000)),
      count: 40000
    };
    return params
  }

  /**
   * 获取初始化按钮数据
   * 
   * @memberof HistoryDataComponent
   */
  private getBtn() {
    let _that = this;
    this.commonRequestService.getMenuBtn(this.menuId, _that, (res) => {
      if (res && res.success == 1) {
        _that.button = _that.commonService.viewBtn(res.rows);
        // _that.journalInfoService.button = _that.button;
      } else if (res.success == -1) { }
    }
    )
  }
  /**
   * 按照筛选条件 搜索
   * 
   * @memberof HistoryDataComponent
   */
  search() {
    this.initData();
  }

  /**
   * 确定当前选择的时间范围
   * 
   * @param {string} clickedDom 当前选择的时间范围
   * @returns 
   * @memberof HistoryDataComponent
   */
  private dateRang(clickedDom: string) {
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
        this.dateRequeset(url, obj);
    }
  }

  /**
   * 获取当前的路由参数并设置日期区间到路由参数
   */
  private getRouteParams() {
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
   * 自定义选择时间
   * 
   * @param {any} e 
   * @returns 
   * @memberof HistoryDataComponent
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
    this.dateRang(clickedDom);
    this.commonService.stopBubble(e);
  }

  /**
   * 用户选择完时间，点击确定
   * 
   * @param {any} e 
   * @memberof HistoryDataComponent
   */
  sure(e) {
    //  显示当前选择时间
    this.isSelectedDate = true;
    //  时间选择弹窗消失
    this.isClick = 'date-picker';
    //  阻止冒泡
    this.commonService.stopBubble(e);
    this.dateEnd = this.dateEndShow;
    this.dateStart = this.dateStartShow;
    let msDateEnd = this.commonService.formatDate(this.dateEnd).times;
    let msDateStart = this.commonService.formatDate(this.dateStart).times;
    if (msDateEnd - msDateStart > 10 * 3600 * 1000) {
      this.timeout = true;
      this.dateRang('one');
      this.isClick = 'one';
      this.isSelectedDate = false;
      return
    } else {
      this.timeout = false;
    }

    //  时间范围
    let rang = this.commonService.formatDate(this.dateStart).formcatDate + ',' + this.commonService.formatDate(this.dateEnd).formcatDate;
    this.dateRang(rang);
  }
  /**
   * 阻止冒泡
   * @param e 事件对象
   */
  stopBubble(e) {
    this.commonService.stopBubble(e);
  }
  /**
   * 改变路由和时间区间
   * 
   * @param url 路由
   * @param obj 时间区间
   */
  dateRequeset(url, obj) {
    this.dateEnd = new Date();
    this.dateStartShow = this.commonService.formatDate(this.dateStart).formatTime;
    this.dateEndShow = this.commonService.formatDate(this.dateEnd).formatTime;
    this.router.navigate([url], { queryParams: obj });
    this.initData();
  }


  /**
   * 下载数据
   * 
   * @returns 
   * @memberof HistoryDataComponent
   */
  downloadShow() {
    let _that = this;
    if (this.historyListData && this.historyListData.length == 0) {
      this.commonService.growl(_that, 'error', '没有数据可供导出');
      return;
    }
    let token = window.localStorage['jasToken'];
    let downloadItems = "{'tagName': '设备-属性','value': '值','unit': '单位','dataType': '数据类型','timestamp': '时间', 'quality': '质量','description': '描述','descriptionEx': '扩展描述'}";
    let itemParams = {
      'downloadItems': downloadItems,
      'token': token,
    }
    let tagParams = this.setConditon();
    tagParams.interval = 1;
    tagParams.count = 1000;
    let params = $.extend({}, itemParams, tagParams)
    let url = '/realtime/nosqlt/history/v2/download';
    let urls = this.IOTDataShowService.IOTServerSrc + url;
    this.journalInfoService.DownLoadFile({ url: urls, data: params })
  }

  /**
   * 给body设置click事件，通过冒泡使弹窗消失
   */
  public modalHidden() {
    let that = this;
    let component = $('.login-journal')[0];
    this.commonService.addEvent(component, 'click', function (event) {
      //  是日历的弹窗消失
      if (!that.isClick) return;
      if (that.isClick && that.isClick == 'self') {
        that.getRouteParams();
      }
    }, false);
  }

  //开始时间
  selectStartDate(e) {
    this.dateStartShow = this.commonService.formatDate(e).formatTime;
  }
  // 结束时间
  selectEndDate(e) {
    this.dateEndShow = this.commonService.formatDate(e).formatTime;
  }

  /**
  * 翻页
  * @param event 存放当前页码和页容量
  */
  private paginate(event) {
    this.pageNum = event.currentPage;
    this.pageSize = event.itemsPerPage;
    this.historyListData = this.totalData.slice(this.pageSize * (this.pageNum - 1), this.pageNum * this.pageSize);
    this.changeListData(this.historyListData, this.tagMessage, this);

  }
  /**
   * 页容量改变
   * @param event 存放页容量
   */
  private sizeChanged(event) {
    this.pageSize = event;
    // this.pageNum = 1; //页容量改变时，页码值为1
    this.size = this.pageSize; //页容量改变时，页码值为1
    // this.initData();
    this.historyListData = this.totalData.slice(this.pageSize * (this.pageNum - 1), this.pageNum * this.pageSize);
    this.changeListData(this.historyListData, this.tagMessage, this);
  }
}
