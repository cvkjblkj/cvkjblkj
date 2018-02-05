import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { alarmHistoryData } from './../shared/data';
import { INCONFIG } from './../../../core/global';
import { CommonService } from './../../../core/common-service/common.service';
import { AlarmService } from './../shared/alarmService';
import { monitorTypeData, historyStatesData } from './../shared/data';
import { MonitorService } from './../../monitoring-info/shared/monitor.service';
import { listData, dockerRankData } from './../shared/data';
@Component({
  selector: 'alarm-history',
  templateUrl: './alarm-history.component.html',
  styleUrls: ['./alarm-history.component.scss', './../../journal-info/journal-info.component.scss', './../../journal-info/business-log/business-log.component.scss', './../../journal-info/system-log/system-log.component.scss']
})
export class AlarmHistoryComponent implements OnInit {
  public isSearched: boolean = true;
  public loop: any; //筛选条件 遍历的条件
  public filterSearchData: any; //筛选条件的初始化数据
  public row: any = 0; //筛选条件的初始列数
  public dropdownData: any; //下拉框的数据（例如：应用名称）
  public msgs: any;
  public isClick: any;  //时间搜索条件被点击
  public isDisabled: boolean = false;
  public exchartsData: any = [];//echarts配置项
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
  public id: any;
  public startTime: any;
  public ruleName: any;//规则名称
  public titleName: any;
  public timeArr: any = [];//docker时间轴
  public dataArr: any = [];//
  public ruleId: any;//
  public sourceCars: any = [];
  public sortF = "createTime";
  public sortO = -1;
  public orderName: any = 'create_time desc';
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public commonService: CommonService,
    public alarmService: AlarmService,
    public monitorService: MonitorService
  ) {
    Object.assign(this, { alarmHistoryData });
    this.loop = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    this.filterSearchData = [
      [null, null], [null, null], [null, null], [null, null], [null, null], [null, null],
      [null, null], [null, null], [null, null], [null, null], [null, null], [null, null],
      [null, null], [null, null], [null, null], [null, null], [null, null], [null, null],
      [null, null], [null, null], [null, null], [null, null], [null, null], [null, null],
      [null, null],
      [null, null]
    ],
      this.dropdownData = {};
    this.zn = INCONFIG.zn;
  }

  ngOnInit() {
    this.modalHidden();

    this.ruleName = this.route.snapshot.queryParams['ruleName'] ? this.route.snapshot.queryParams['ruleName'] : this.route.snapshot.params['ruleName'];
    this.ruleId = this.route.snapshot.queryParams['ruleId'] ? this.route.snapshot.queryParams['ruleId'] : this.route.snapshot.params['ruleId'];
    if (this.ruleName) {
      let arr = [];
      let arr1 = [];
      arr.push(this.ruleName);
      this.filterSearchData[0][0] = alarmHistoryData[2].value;
      this.filterSearchData[0][1] = arr;
      this.addValue("", 0)
    };
    this.getRouteParams();

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
* 设置日历的最大和最小可选择日期
*/
  public MaxDate: any;
  public setMaxMinDate() {
    var timestamp1 = Date.parse(this.dateStart);
    var todayFormat = this.commonService.formatDate(timestamp1).formcatDate;
    let todayFormatTimes = todayFormat + ' 24:00';
    this.MaxDate = new Date(todayFormatTimes);
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
  };


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
        this.initLoginListData();
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
    this.initLoginListData();
  };

  /**
* 选择过滤的条件
* @param e 事件对象
* @param i 当前的索引
*/
  public changeSelectData(e, i) {
    // console.log(this.filterSearchData[i][1])
    this.filterSearchData[i][1] = null;
    if (e.value.name == 'monitorType') {
      this.filterSearchData[i][2] = 'monitorType';

    } else if (e.value.name == 'alarmHistoryStates') {
      this.filterSearchData[i][2] = 'alarmHistoryStates'
    } else {
      //如果没有下拉选项，清除数组的最后一项

      this.filterSearchData[i].pop();
    }
    this.dropdownListData(this.filterSearchData[i][2]);

  };

  public dropdownListData(item) {
    if (item == 'monitorType') {
      this.dropdownData.monitorType = monitorTypeData;
    };
    if (item == 'alarmHistoryStates') {
      this.dropdownData.alarmHistoryStates = historyStatesData;
    }
  };
  /**
   *
   */
  public search() {
    this.initLoginListData()
  };
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
    if (!e.field.match(/[A-Z]/g)) {
      orderField = e.field;
    }else if(e.field=='alarmHappenTime'){
       orderField= 'alarm_happen_time';
    }else if(e.field=='alarmHistoryStates'){
      orderField = 'alarm_history_states';
    } else {
      let upperString = e.field.match(/[A-Z]/g).join(",");
      orderField = e.field.replace(/[A-Z]/g, "_" + upperString.toLowerCase());
    }



    this.orderName = orderField + " " + order;
    // this.initLoginListData();
    this.initLoginListData();
  }
  /**
   * 初始化的值
   */
  public initLoginListData() {
    let __this = this;
    let url = '/alarm/alarmHistory/query';
    let dateEnd = this.dateEndShow ? this.dateEndShow : this.dateEnd;
    let dateStart = this.dateStartShow ? this.dateStartShow : this.dateStart;
    let startTime = this.commonService.formatDate(dateStart).times;
    let endTime = this.commonService.formatDate(dateEnd).times;
    let value = __this.searchCondition();
    let param;
    param = {
      'pageSize': __this.pageSize,
      'pageNum': __this.pageNum,
      'startTime': startTime,
      'endTime': endTime,
      'orderBy': __this.orderName

    };
    /**
     * 数组相同对象合并
     */
    if (value) {
      var categories = {};
      value.forEach(function (item, i) {
        if (!categories[item.key]) {
          categories[item.key] = [item];
        } else {
          categories[item.key].push(item);
        }
      });
      var data = [];
      for (var key in categories) {
        var i, l;
        let arr = [];
        if (categories.hasOwnProperty(key)) {
          for (i = 1; i < categories[key].length; ++i) {
            ///   第一个的值 = '，' +  下一个的值
            if (categories[key][0].value.indexOf(',') != -1) {//第一个筛选框为两个值得时候
              if (categories[key][i].value.indexOf(',') != -1) {//第二个筛选框为两个值得时候
                categories[key][0].value = categories[key][0].value.split(',');
                categories[key][i].value = categories[key][i].value.split(',');
                let arr;
                for (var k = 0; k < categories[key][0].value.length; k++) {
                  for (var j = 0; j < categories[key][i].value.length; j++) {

                    if (categories[key][0].value[k] == categories[key][i].value[j]) {
                      arr += ',' + categories[key][0].value[k];

                    }
                  }
                }
                categories[key][0].value = arr;
              } else if (categories[key][i].value.indexOf(',') == -1) {//德尔格筛选框为1个值得时候
                categories[key][0].value = categories[key][0].value.split(',');
                for (var j = 0; j < categories[key][0].value.length; j++) {
                  if (categories[key][0].value[j] == categories[key][i].value) {//精准搜索的时候
                    categories[key][0].value[j] += ',' + categories[key][i].value;
                  } else {
                    categories[key][0].value[j] += categories[key][i].value;//模糊搜素
                  }
                }
              }
              if (categories[key][0].value.indexOf('undefined') != -1) {
                categories[key][0].value = categories[key][0].value.replace(/undefined/g, '')
              } else {
                categories[key][0].value = categories[key][0].value.toString();
              }
            } else {
              if (categories[key][i].value.indexOf(',') != -1) {//第一个筛选狂为1个值，第二个筛选框为两个值得时候
                let arr;
                let arr1 = [];
                let arr2;
                categories[key][i].value = categories[key][i].value.split(',');
                for (var j = 0; j < categories[key][i].value.length; j++) {
                  if (categories[key][0].value == categories[key][i].value[j]) {//精准搜索的时候
                    arr2 += ',' + categories[key][0].value

                  } else {
                    let obj = categories[key][0].value + categories[key][i].value[j];//模糊搜索的时候
                    arr1.push(obj);
                    arr = arr1.toString();
                  }
                }
                if (arr2 && arr) {
                  if (arr2.indexOf('undefined') != -1) {
                    arr2 = arr2.replace(/undefined/g, '')
                  }
                  categories[key][0].value = arr + ',' + arr2
                } else {
                  categories[key][0].value = arr;
                }
              } else {
                if (categories[key][0].value == categories[key][i].value) {//第一个筛选框为一个值，第二个筛选框为一个值精准搜索
                  categories[key][0].value += ',' + categories[key][i].value;
                } else {
                  categories[key][0].value += categories[key][i].value;//第一个筛选框为一个值，第二个筛选框为一个值模糊搜索
                }
              }
            }
            // 删除下一个
            categories[key].splice(i, 1);
            --i;
          }
          data.push(categories[key][0]);
        }
      };

      JSON.stringify(data, null, 2);

      for (var j = 0; j < data.length; j++) {
        let item = data[j];
        param[item.key] = item.value;
      };

      if (this.ruleId) {
        param['ruleId'] = this.ruleId
      }
    };
    __this.alarmService.searchData(__this, url, param, function (res) {
      if (res.success == 1 && res['rows']) {
        __this.selectListData = res['rows'];
        for (var i = 0; i < __this.selectListData.length; i++) {
          if (__this.selectListData[i].monitorType == 'slb') {
            __this.selectListData[i].monitorType = '负载均衡';
          } else if (__this.selectListData[i].monitorType == 'ecs') {
            __this.selectListData[i].monitorType = '主机';
          } else if (__this.selectListData[i].monitorType == 'docker') {
            __this.selectListData[i].monitorType = 'Docker容器';
          } else if (__this.selectListData[i].monitorType == 'redis') {
            __this.selectListData[i].monitorType = 'Redis';
          } else if (__this.selectListData[i].monitorType == 'oss') {
            __this.selectListData[i].monitorType = '对象存储';
          } else if (__this.selectListData[i].monitorType == 'rds') {
            __this.selectListData[i].monitorType = 'RDS';
          };



          if (__this.selectListData[i].alarmHistoryStates == 0) {
            __this.selectListData[i].alarmHistoryStates = ' 报警发生';
          } else if (__this.selectListData[i].alarmHistoryStates == 1) {
            __this.selectListData[i].alarmHistoryStates = '通道沉默';
          } else if (__this.selectListData[i].alarmHistoryStates == 2) {
            __this.selectListData[i].alarmHistoryStates = '恢复正常';
          }
          if (__this.selectListData[i].notifyType == 0) {
            __this.selectListData[i].notifyType = '短信';
          } else if (__this.selectListData[i].notifyType == 1) {
            __this.selectListData[i].notifyType = '邮件';
          } else if (__this.selectListData[i].notifyType == 2) {
            __this.selectListData[i].notifyType = '短信,邮件';
          };
          __this.getMertic(__this.selectListData[i])
        };

        __this.totalItems = res['totalElements'];
        __this.size = res['size'];
        __this.totalPages = res['totalPages'];
        __this.isSearched = true;
        __this.growl('success', '页面刷新成功');
      };

    })
  };
  public getMertic(item) {
    for (var i = 0; i < listData.length; i++) {
      if (item.metric == listData[i].Metric) {
        item.describe = listData[i].describe;

      }
    }

  }


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
    if (msDateEnd - msDateStart < 0) {
      // 如果结束时间小于开始时间,提示用户结束时间不得小于开始时间,并且搜索按钮禁用
      this.isDisabled = true;
    }

    // 时间范围
    let rang = this.commonService.formatDate(this.dateStart).formatTime + ',' + this.commonService.formatDate(this.dateEnd).formatTime;
    this.dateRang(rang);
  };
  /**
  * 添加下一列
  * @param row 当前列数
  */
  addValue(e?: any, row?: any) {
    this.isSearched = false;

    if (row < 25) {

      this.row = row + 1;
    }
  };
  // 移除输入框的输入内容
  removeValue(e) {
    this.isSearched = false;
  };
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
  };

  /**
  * 展开事件
  * @param event
  */
  onRowExpand(event: any) {
    if (event.originalEvent.srcElement) {
      let arr = [];
      arr = event.originalEvent.srcElement.parentElement.parentElement.parentElement.parentElement.children;
      for (var i = 0; i < arr.length; i++) {
        if (i % 2) {
          arr[i].style.backgroundColor = '#fafafb';
        } else {
          arr[i].style.backgroundColor = "#fff";
        }
      };
      var originalEvent = event.originalEvent.srcElement.parentElement.parentElement.parentElement.style.backgroundColor = '#ddf1ea';
      //火狐没有srcElement属性 所以做target兼容
      event.originalEvent.srcElement ? originalEvent : '';

    };
    if (event.originalEvent.target) {
      let arr1 = [];
      arr1 = event.originalEvent.target.parentElement.parentElement.parentElement.parentElement.children;
      for (var j = 0; j < arr1.length; j++) {
        if (j % 2) {
          arr1[j].style.backgroundColor = '#fafafb';
        } else {
          arr1[j].style.backgroundColor = "#fff";
        }
      };
      var targetEvent = event.originalEvent.target.parentElement.parentElement.parentElement.style.backgroundColor = '#ddf1ea';
      event.originalEvent.target ? targetEvent : '';

    };
    this.RowExpandData(event);
  };
  /**
   * 收缩事件
   * @param event
   */
  onRowCollapse(event) {
    if (event.originalEvent.srcElement) {
      let arr = [];
      arr = event.originalEvent.srcElement.parentElement.parentElement.parentElement.parentElement.children;
      for (var i = 0; i < arr.length; i++) {
        if (i % 2) {
          arr[i].style.backgroundColor = '#fafafb';
        } else {
          arr[i].style.backgroundColor = "#fff";
        }
      };
      var originalEvent = event.originalEvent.srcElement.parentElement.parentElement.parentElement.style.backgroundColor = '#ddf1ea';
      //火狐没有srcElement属性 所以做target兼容
      event.originalEvent.srcElement ? originalEvent : '';

    };
    if (event.originalEvent.target) {
      let arr1 = [];
      arr1 = event.originalEvent.target.parentElement.parentElement.parentElement.parentElement.children;
      for (var j = 0; j < arr1.length; j++) {
        if (j % 2) {
          arr1[j].style.backgroundColor = '#fafafb';
        } else {
          arr1[j].style.backgroundColor = "#fff";
        }
      };
      var targetEvent = event.originalEvent.target.parentElement.parentElement.parentElement.style.backgroundColor = '#ddf1ea';
      event.originalEvent.target ? targetEvent : '';

    };

  };
  /**
 * 提示消息
 * @param rel
 * @param res
 */
  public growl(rel: string, res: string) {
    this.msgs = [];
    this.msgs.push({ severity: rel, summary: '', detail: res });
  };
  sizeChanged($event: any) {
    this.pageSize = $event;
    this.pageNum = 1;
    this.initLoginListData();
  };
  /**
   * 分页
   * @param event
   */
  paginate(event: any) {
    this.pageNum = event.currentPage;
    this.pageSize = event.itemsPerPage;
    this.initLoginListData();
  };
  /**
   * 筛选条件
   */
  public searchCondition() {
    let arr = [];

    for (var i = 0; i < this.filterSearchData.length; i++) {
      let item = this.filterSearchData[i];

      let value;
      if (this.filterSearchData[0][0] == null && this.filterSearchData[0][1] == null) {
        // 如果数组的第一项为null
        return;
      } else if (item[0] != null && item[1] != null) {

        value = {
          key: item[2] ? item[2] : item[0].name,
          value: item[1].join(',')
        };
        arr.push(value);
      };
    };
    return arr;
  };
  /**
   *
   * @param event
   */
  public RowExpandData(event) {
    this.exchartsData = [];
    let url;
    let __this = this;
    let item = event.data.monitorType;
    let dateStart = this.commonService.formatDate(event.data.alarmHappenTime).times - 6 * 60 * 60 * 1000;
    let dateEnd = this.commonService.formatDate(event.data.alarmHappenTime).times + 6 * 60 * 60 * 1000;
    // let frequency = INCONFIG.setSamplingFrequency(dateStart, dateEnd).statisticsInterval;
    let frequency = 1;
    let statisticsType = INCONFIG.setSamplingFrequency(dateStart, dateStart).statisticsType;
    let params;
    if (event.data.monitorType == 'docker') {
      __this.getChangeDockerData(event);
    } else if (event.data.monitorType == 'oss') {
      url = '/monitor/' + item + '/v2/statistics'
      params = {
        "dataFieldsKeys": ["value"],
        'filters': [],
        "statisticsInterval": frequency,
        "pageNum": 1,
        "statisticsEnd": dateEnd,
        "statisticsBegin": dateStart,
        "statisticsType": statisticsType,
        "metricName": [event.data.metric],
      };
      __this.monitorService.searchData(__this, url, params, function (res) {
        if (res && res.code == 200 && res.success == 1) {

          __this.getValue(res['rows'], event.data);
        }
      });
    } else if (event.data.monitorType == 'slb') {
      url = '/monitor/' + item + '/v2/statistics';
      params = {
        "dataFieldsKeys": ["maximum"],
        'filters': [

          { 'itemKey': 'instanceId', 'filter': 'contain', 'itemValue': event.data.instanceId },
          { 'itemKey': event.data.monitorAttributeName, 'filter': 'term', 'itemValue': event.data.monitorAttributeContent }
        ],
        "statisticsInterval": frequency,
        "pageNum": 1,
        "statisticsEnd": dateEnd,
        "statisticsBegin": dateStart,
        "statisticsType": statisticsType,
        "metricName": [event.data.metric],
      };
      __this.monitorService.searchData(__this, url, params, function (res) {
        if (res && res.code == 200 && res.success == 1) {

          __this.getValue(res['rows'], event.data);
        }
      })
    } else {
      if (event.data.monitorAttributeName == 'device' || event.data.monitorAttributeName == 'diskName') {
        url = '/monitor/' + item + '/v2/statistics';
        params = {
          "dataFieldsKeys": "average",
          'filters': [

            { 'itemKey': 'instanceId', 'filter': 'term', 'itemValue': event.data.instanceId },
            { 'itemKey': 'device', 'filter': 'term', 'itemValue': event.data.monitorAttributeContent }
          ],
          "statisticsInterval": frequency,
          "pageNum": 1,
          "statisticsEnd": dateEnd,
          "statisticsBegin": dateStart,
          "statisticsType": statisticsType,
          "metricName": [event.data.metric],
        };
        __this.monitorService.searchData(__this, url, params, function (res) {
          if (res && res.code == 200 && res.success == 1) {

            __this.getValue(res['rows'], event.data);
          }
        })
      } else {
        url = '/monitor/' + item + '/v2/statistics'
        params = {
          "dataFieldsKeys": ["maximum"],
          'filters': [

            { 'itemKey': 'instanceId', 'filter': 'contain', 'itemValue': event.data.instanceId },

          ],
          "statisticsInterval": frequency,
          "pageNum": 1,
          "statisticsEnd": dateEnd,
          "statisticsBegin": dateStart,
          "statisticsType": statisticsType,
          "metricName": [event.data.metric],
        };
        __this.monitorService.searchData(__this, url, params, function (res) {
          if (res && res.code == 200 && res.success == 1) {

            __this.getValue(res['rows'], event.data);
          }
        })
      };

    }
  };
  /**
   * 处理docker数据
   */
  public getChangeDockerData(event) {
    // console.log(event);
    this.exchartsData = [];
    this.timeArr = [];
    this.dataArr = [];
    let dateStart = this.commonService.formatDate(event.data.alarmHappenTime).times - 6 * 60 * 60 * 1000;
    let dateEnd = this.commonService.formatDate(event.data.alarmHappenTime).times + 6 * 60 * 60 * 1000;
    let endTime = Math.round(this.commonService.formatDate(dateEnd).times / 60000);
    let intervalTimes = 60000000;
    let statisticsInterval = INCONFIG.setSamplingFrequency(this.commonService.formatDate(dateStart).times, this.commonService.formatDate(dateEnd).times).statisticsInterval;
    let filters = [
      { 'itemKey': 'timestamp', 'filter': 'gte', 'itemValue': this.commonService.formatDate(dateStart).times * 1000 },
      { 'itemKey': 'timestamp', 'filter': 'lte', 'itemValue': this.commonService.formatDate(dateEnd).times * 1000 },
      { 'itemKey': 'container_Name', 'filter': 'contain', 'itemValue': event.data.monitorObject },
      // {
      //   'itemKey': '', 'filter': 'script', 'itemValue': "(" + endTime + "-doc['timestamp'].value.intdiv" + "(" + intervalTimes + ")" + ")" + "%" + statisticsInterval + "==0"
      // }
    ]
    let url = '/monitor/docker/v2/queryList';
    let __this = this;
    let params = {
      'filters': filters,
      'orderBy': 'timestamp desc',
      'pageNum': -1
    };
    __this.monitorService.searchData(__this, url, params, function (res) {
      if (res && res.code == 200 && res.success == 1) {
        __this.getDockerValue(res['rows'].reverse(), event);
      }
    })
  };
  public itemObj = {
    cpu: [],
    memory: [],
    netInwork: [],
    netOutwork: [],

  };
  /**
   * 处理docker的数据
   * @param item
   * @param data
   */
  public getDockerValue(item, data) {
    this.itemObj.cpu = [];
    this.itemObj.netInwork = [];
    this.itemObj.memory = [];
    this.itemObj.netOutwork = [];
    for (var i = 0; i < item.length; i++) {
      this.timeArr.push(this.commonService.formatDate(item[i].timestamp / 1000).formatTime);
      if (data.data.metric == 'cpu') {
        this.itemObj.cpu.push((Math.floor((item[i].container_stats.cpu.usage.user + item[i].container_stats.cpu.usage.system) / item[i].container_stats.cpu.usage.total * 100) / 100) * 100);
      };
      if (data.data.metric == 'memory') {
        this.itemObj.memory.push(item[i].container_stats.memory.usage);
      };
      if (data.data.metric == 'rx_bytes') {
        this.itemObj.netInwork.push(item[i].container_stats.network.rx_bytes);
      };
      if (data.data.metric == 'tx_bytes') {
        this.itemObj.netOutwork.push(item[i].container_stats.network.tx_bytes);
      };

    };
    this.objChanged(this.itemObj, this.timeArr, data);

  };
  /**
   * 处理
   * @param item
   * @param date
   * @param data
   */
  public objChanged(item, date, data) {
    let netInItem;//流入带宽
    let memoryData;//内存
    let netOutItem;//流出带宽
    let netInworkArr = [];
    let netOutworkArr = [];
    let memoryArr = [];
    let datas;
    let name;
    let netInData = [];//流入带宽
    let netOutData = [];//流出带宽
    let cpuData = []
    if (item.cpu.length > 0) {
      datas = item.cpu;
      name = data.data.metric;
      cpuData.push({ datas, name })
      this.valueChange(item.cpu, date, data, cpuData);
    };
    if (item.memory.length > 0) {
      datas = item.memory;
      name = data.data.metric;
      memoryArr.push({ datas, name });
      memoryData = this.monitorService.unitChanged(dockerRankData[1].unit, memoryArr).value[0].datas;
      this.valueChange(memoryData, date, data, memoryArr);
    };
    if (item.netInwork.length > 0) {
      for (var i = 1; i < item.netInwork.length; i++) {
        netInData.push(item.netInwork[i] - item.netInwork[i - 1])
      };
      //计算值小于0的时候取0
      for (var j = 0; j < netInData.length; j++) {
        if (netInData[j] < 0) {
          netInData[j] = 0;
        }
      };
      datas = netInData;
      name = data.data.metric;
      netInworkArr.push({ datas, name });
      netInItem = this.monitorService.unitChanged(dockerRankData[2].unit, netInworkArr).value[0].datas;
      this.valueChange(netInItem, date, data, netInworkArr);
    };
    if (item.netOutwork.length) {
      for (var i = 1; i < item.netOutwork.length; i++) {
        netOutData.push(item.netOutwork[i] - item.netOutwork[i - 1])
      };
      //计算值小于0的时候取0
      for (var j = 0; j < netOutData.length; j++) {
        if (netOutData[j] < 0) {
          netOutData[j] = 0;
        }
      };
      datas = netOutData;
      name = data.data.metric;
      netOutworkArr.push({ datas, name });
      netOutItem = this.monitorService.unitChanged(dockerRankData[3].unit, netOutworkArr).value[0].datas;
      this.valueChange(netOutItem, date, data, netOutworkArr);
    }
  };
  /**
   * echarts配置项
   * @param item
   * @param date
   * @param data
   */
  public valueChange(item, date, data, ItemArr?: any) {
    let arr = [];
    let lineArr1 = [];
    let lineArr2 = [];
    let line1 = [];
    let line2 = [];
    let lineStyle;
    let itemStyle;
    var oneName;
    var twoName;
    let describe;
    let name;
    let datas;
    let unit;
    let oneArr;
    let twoArr;
    // let lineArr1 =[];
    lineStyle = INCONFIG.setColorStatus().buleColor.lineStyle;
    itemStyle = INCONFIG.setColorStatus().buleColor.itemStyle;
    // console.log(data);
    if (data.data.threshold.indexOf(',') == -1) {
      arr.push(data.data.threshold);
    } else {
      arr = data.data.threshold.split(',');
    };
    for (var i = 0; i < item.length; i++) {
      if (arr.length > 1) {
        line1.push(arr[0]);
        line2.push(arr[1]);
        oneName = '报警线1';
        twoName = '报警线2';
      } else {
        line1.push(arr[0]);
        oneName = '报警线';
      }
    };
    if (line1.length !== 0 && line2.length !== 0) {
      name = data.data.metric;
      unit = data.data.metricUnit;
      datas = line1;
      lineArr1.push(datas);
      // console.log(unit);
      oneArr = this.monitorService.historyUnitConversion(unit, ItemArr, lineArr1).value[1].value2;
      datas = line2;
      lineArr2.push(datas);
      twoArr = this.monitorService.historyUnitConversion(unit, ItemArr, lineArr2).value[1].value2;
    } else {

      name = data.data.metric;
      unit = data.data.metricUnit;
      datas = line1;
      lineArr1.push(datas);
      oneArr = this.monitorService.historyUnitConversion(unit, ItemArr, lineArr1).value[1].value2;
    }
    for (var i = 0; i < dockerRankData.length; i++) {
      if (data.data.metric == dockerRankData[i].Metric) {
        describe = dockerRankData[i].describe;
      }
    };
    var objItem = {
      num: "5%",
      title: describe,
      data: [describe ? describe : '', oneName ? oneName : '', twoName ? twoName : '',],
      xAxis: {
        data: date ? date : ''
      },

      series: [
        {
          name: describe ? describe : '',
          type: 'line',
          data: item ? item : '',
          lineStyle,
          itemStyle,

        },
        {
          name: oneName ? oneName : '',
          type: 'line',
          data: oneArr ? oneArr : '',
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
          name: twoName ? twoName : '',
          type: 'line',
          data: twoArr ? twoArr : '',
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
      ]
    };
    this.exchartsData.push(objItem)
  }
  /**
   *
   * @param item 后台数据对接描述列表
   */
  public getValue(item, data) {
    this.titleName = "";
    for (var i = 0; i < listData.length; i++) {
      if (item[0].name == listData[i].Metric) {
        item[0].describe = listData[i].describe;
        item[0].unit = listData[i].unit;
        this.titleName = listData[i].describe;
      }
    };
    this.echartsItem(item, data);
  };
  public echartsItem(obj: any, data) {

    let timeArr = [];
    let lineArr1 = [];
    let lineArr3 = [];
    let line1 = [];
    let line2 = [];
    let arr = [];
    let name;
    let datas;
    let oneArr;
    let lineArr2 = [];
    let twoArr;
    if (data.threshold.indexOf(',') == -1) {
      arr.push(data.threshold);
    } else {
      arr = data.threshold.split(',');
    };
    let unit;
    let lineStyle;
    let itemStyle;
    let oneName;
    let twoName;

    lineStyle = INCONFIG.setColorStatus().buleColor.lineStyle;
    itemStyle = INCONFIG.setColorStatus().buleColor.itemStyle;
    lineArr1 = this.monitorService.unitChanged(obj[0].unit, obj).value[0].datas;
    unit = this.monitorService.unitChanged(obj[0].unit, obj).unit;
    for (var i = 0; i < obj[0].sources.length; i++) {
      timeArr.push(obj[0].sources[i].dateFormat);
      if (arr.length > 1) {
        line1.push(arr[0]);
        line2.push(arr[1]);
        oneName = '报警线1';
        twoName = '报警线2'
      } else {
        line1.push(arr[0]);
        oneName = '报警线';
      }
    }

    if (line1.length !== 0 && line2.length !== 0) {
      name = data.metric;
      unit = data.metricUnit;
      datas = line1;
      lineArr2.push(datas);

      oneArr = this.monitorService.historyUnitConversion(unit, obj, lineArr2).value[1].value2;
      // console.log(this.monitorService.historyUnitConversion(unit, obj, lineArr2));
      // console.log(this.monitorService.historyUnitConversion(unit, obj, lineArr3));
      datas = line2;
      lineArr3.push(datas);
      twoArr = this.monitorService.historyUnitConversion(unit, obj, lineArr3).value[1].value2;
    } else {
      // console.log(data.metric);
      // console.log( data.metricUnit);
      name = data.metric;
      unit = data.metricUnit;
      datas = line1;
      lineArr2.push(datas);
      oneArr = this.monitorService.historyUnitConversion(unit, obj, lineArr2).value[1].value2;
    }
    var objItem = {
      num: "5%",
      title: obj[0].describe + '(' + unit + ')',
      data: [obj[0].describe ? obj[0].describe : '', oneName ? oneName : '', twoName ? twoName : '',],
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
        {
          name: oneName ? oneName : '',
          type: 'line',
          data: oneArr ? oneArr : '',
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
          name: twoName ? twoName : '',
          type: 'line',
          data: twoArr ? twoArr : '',
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
      ]
    };
    this.exchartsData.push(objItem);
  };
}
