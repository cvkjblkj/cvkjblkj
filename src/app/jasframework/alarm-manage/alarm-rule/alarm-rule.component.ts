import { concatStatic } from 'rxjs/operator/concat';
import { chownSync } from 'fs';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { alarmOpions, ruleStatesData, isEnableData, monitorTypeData, listData } from './../shared/data'
import { AlarmService } from './../shared/alarmService';
import { ConfirmationService } from 'primeng/primeng';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonRequestService } from './../../../core/common-service/common-request.service';
import { CommonService } from './../../../core/common-service/common.service';
declare var $: any;
@Component({
  selector: 'alarm-rule',
  templateUrl: './alarm-rule.component.html',
  styleUrls: ['./alarm-rule.component.scss', './../../journal-info/journal-info.component.scss', './../../journal-info/business-log/business-log.component.scss', './../../journal-info/system-log/system-log.component.scss']
})
export class AlarmRuleComponent implements OnInit {
  public loop: any; //筛选条件 遍历的条件
  public filterSearchData: any; //筛选条件的初始化数据
  public row: any = 0; //筛选条件的初始列数
  public isClick: any;  //时间搜索条件被点击
  public date: any;  //点击自定义，被选中的时间
  public isSelectedDate: any = false;  //点击自定义，展示被选中的时间，是否显示
  public maxSelectedLabels: number = 0;
  public dateEnd: Date; //自定义选择   结束时间
  public dateStart: Date; //自定义选择 开始时间
  public ruleDate: any;
  public startUse: boolean = false;
  public defaultLabel: string = '请选择--'; //p-multiSelect 在没有选择时显示。
  public dropdownData: any;
  public isSearched: boolean = true;
  public rowsPerPageOptions = ['10', '20', '30'];
  public pageSize: string = '10'; //页容量
  public pageNum: any = 1; //页码
  public maxSize: number = 5;
  public totalPages: any;  //总页数
  public size: any; // 当前页容量
  private totalItems: any; //总数据条数
  public msgs: any;//操作提示
  public emptyMessage: string = '未查到相关数据'; //primeng dataTable没有数据时，显示的内容
  public menuId: any;//按钮id
  public button: any;//按钮集合
  public metricDescribe: any;//规则描述
  public message: string;
  public sortF = "ruleStates";
  public sortO = -1;
  public orderName: any = 'a.rule_states asc';
  constructor(
    public alarmService: AlarmService,
    public confirmationService: ConfirmationService,
    public router: Router,
    public route: ActivatedRoute,
    public commonRequestService: CommonRequestService,
    public commonService: CommonService
  ) {
    Object.assign(this, { alarmOpions });
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
  };

  ngOnInit() {

    this.menuId = this.route.snapshot.queryParams['id'] ? this.route.snapshot.queryParams['id'] : this.route.snapshot.params['id'];

    if (!this.alarmService.button) {
      this.getBtn();

    } else {
      this.button = this.alarmService.button;
      this.initLoginListData();
    };



  }
  /**
* 获取初始化按钮数据
*/
  public getBtn() {
    let _that = this;
    this.commonRequestService.getMenuBtn(this.menuId, _that, (res) => {
      if (res && res.success == 1) {

        _that.button = _that.commonService.viewBtn(res.rows);

        _that.alarmService.button = _that.button;
        _that.initLoginListData();

      } else if (res.success == -1) { }
    }
    )

  }
  /**
   * 查看
   * @param modal
   */
  public ruleValue: any;
  public look(modal: any, addModal: any) {
    addModal.show();
    if (modal.notifyType == 0) {
      modal.notifyType = '短信';
    } else if (modal.notifyType == 1) {
      modal.notifyType = '邮件';
    } else if (modal.notifyType == 2) {
      modal.notifyType = '短信,邮件';
    };
    this.ruleValue = modal;

  };
  /**
   *
   * @param modal 历史
   */
  public history(modal: any) {
    this.alarmService.status = true;
    let ruleName = {
      ruleName: modal.ruleName,
      ruleId: modal.ruleId,
      id: this.menuId
    };
    this.router.navigate(['/alarm-manage/alarm/alarm-history'], { queryParams: ruleName });
  };
  /**
   * 编辑
   * @param modal
   */
  public edit(modal: any) {
    let params = {
      objectId: modal.ruleId,
      id: this.menuId
    };

    this.router.navigate(['/alarm-manage/edit-rule'], { queryParams: params })
  };


  /**
 * 选择过滤的条件
 * @param e 事件对象
 * @param i 当前的索引
 */
  public changeSelectData(e, i) {
    // console.log(this.filterSearchData[i][1])
    this.filterSearchData[i][1] = null;
    if (e.value.name == 'ruleStates') {
      this.filterSearchData[i][2] = 'ruleStates';

    }
    else if (e.value.name == 'isEnable') {
      this.filterSearchData[i][2] = 'isEnable'
    } else if (e.value.name == 'monitorType') {
      this.filterSearchData[i][2] = 'monitorType'
    } else {
      //如果没有下拉选项，清除数组的最后一项

      this.filterSearchData[i].pop();
    }
    this.dropdownListData(this.filterSearchData[i][2]);

  };
  public dropdownListData(obj) {
    if (obj == 'ruleStates') {
      this.dropdownData.ruleStates = ruleStatesData;
    };
    if (obj == 'isEnable') {
      this.dropdownData.isEnable = isEnableData;
    };
    if (obj == 'monitorType') {
      this.dropdownData.monitorType = monitorTypeData;
    };
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
  * 添加下一列
  * @param row 当前列数
  */
  addValue(e, row) {
    this.isSearched = false;
    if (row < 25) {
      this.row = row + 1;
    }
  }
  // 移除输入框的输入内容
  removeValue(e) {
    this.isSearched = false;
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
    if ( e.field == 'isEnable') {
      // 全部小写
      orderField = e.field;
    } else if (e.field == 'notifyUserName') {
      orderField = 'notify_user_name';
    } else if (!e.field.match(/[A-Z]/g)) {
      orderField = e.field;
    } else {
      let upperString = e.field.match(/[A-Z]/g).join(",");
      orderField = e.field.replace(/[A-Z]/g, "_" + upperString.toLowerCase());

    }
    // if (e.field.match(/[A-Z]/g)) {
    //   // 有大写
    //   let upperString = e.field.match(/[A-Z]/g).join(",");
    //   orderField = e.field.replace(/[A-Z]/g, "_" + upperString.toLowerCase());

    // } else {
    //   orderField = e.field;
    // }

    if (orderField == 'rule_states') {
      orderField = 'a.' + orderField;
    } else {
      orderField = orderField
    }

    this.orderName = orderField + " " + order;
    // this.initLoginListData();
    this.initLoginListData();
  }
  /**
   * 页面列表初始化
   */

  public initLoginListData() {
    let __this = this;
    let url = '/alarm/alarmRules/query';
    var value = __this.searchCondition()
    // console.log(value ? value : '')
    let arr = [];
    let param;
    param = {
      'pageSize': __this.pageSize,
      'pageNum': __this.pageNum,
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
    };

    __this.alarmService.searchData(__this, url, param, function (res) {
      if (res.success == 1 && res['rows']) {
        __this.ruleDate = res['rows'];

        for (var i = 0; i < __this.ruleDate.length; i++) {

          if (__this.ruleDate[i].monitorType == 'slb') {
            __this.ruleDate[i].monitorType = '负载均衡';
          } else if (__this.ruleDate[i].monitorType == 'ecs') {
            __this.ruleDate[i].monitorType = '主机';
          } else if (__this.ruleDate[i].monitorType == 'docker') {
            __this.ruleDate[i].monitorType = 'Docker容器';
          } else if (__this.ruleDate[i].monitorType == 'redis') {
            __this.ruleDate[i].monitorType = 'Redis';
          } else if (__this.ruleDate[i].monitorType == 'oss') {
            __this.ruleDate[i].monitorType = '对象存储';
          } else if (__this.ruleDate[i].monitorType == 'rds') {
            __this.ruleDate[i].monitorType = 'RDS';
          };

          if (__this.ruleDate[i].ruleStates == 0) {
            __this.ruleDate[i].ruleStatesData = ' 报警状态';

          } else if (__this.ruleDate[i].ruleStates == 1) {
            __this.ruleDate[i].ruleStatesData = ' 数据不足';

            // console.log(__this.ruleDate[i].event);
          } else if (__this.ruleDate[i].ruleStates == 2) {
            __this.ruleDate[i].ruleStatesData = '正常状态';

            // console.log(__this.ruleDate[i].);
          } else if (__this.ruleDate[i].ruleStates == 3) {
            __this.ruleDate[i].ruleStatesData = '暂停';

            // console.log(__this.ruleDate[i]);
          };

          if (__this.ruleDate[i].isEnable == false) {

            __this.ruleDate[i].isEnable = '已禁用';
          } else if (__this.ruleDate[i].isEnable == true) {
            __this.ruleDate[i].isEnable = '已启用';
          };
          if (__this.ruleDate[i].statistics == 'average') {
            __this.ruleDate[i].statistics = '平均值';
          } else if (__this.ruleDate[i].statistics == 'always') {
            __this.ruleDate[i].statistics = '总是';
          } else if (__this.ruleDate[i].statistics == 'once') {
            __this.ruleDate[i].statistics = '只要有一次';
          };
          if (__this.ruleDate[i].comparisonOperator == 'gte') {
            __this.ruleDate[i].comparisonOperator = '>=';
          } else if (__this.ruleDate[i].comparisonOperator == 'gt') {
            __this.ruleDate[i].comparisonOperator = '>';
          } else if (__this.ruleDate[i].comparisonOperator == 'lte') {
            __this.ruleDate[i].comparisonOperator = '<=';
          } else if (__this.ruleDate[i].comparisonOperator == 'lt') {
            __this.ruleDate[i].comparisonOperator = '<';
          } else if (__this.ruleDate[i].comparisonOperator == 'e') {
            __this.ruleDate[i].comparisonOperator = '==';
          } else if (__this.ruleDate[i].comparisonOperator == 'ne') {
            __this.ruleDate[i].comparisonOperator = '!=';
          };

          if (__this.ruleDate[i].comparisonOperator == 'between') {
            let arr = [];
            arr = __this.ruleDate[i].threshold.split(',');
            if (__this.ruleDate[i].monitorAttributeName == 'port') {
              __this.ruleDate[i].metric = '端口' + '' + __this.ruleDate[i].monitorAttributeContent + ' ' + __this.ruleDate[i].metricDescribe + '  ' + __this.ruleDate[i].period + '分钟' + '  '
                + __this.ruleDate[i].statistics + ' ' + __this.ruleDate[i].comparisonOperator + ' ' + arr[0] + __this.ruleDate[i].metricUnit + '~ ' + arr[1] + __this.ruleDate[i].metricUnit + '连续超过' +
                __this.ruleDate[i].evaluationCount + '次则报警';
            } else if (__this.ruleDate[i].monitorAttributeName == 'device') {
              __this.ruleDate[i].metric = '网络设备' + '' + __this.ruleDate[i].monitorAttributeContent + ' ' + __this.ruleDate[i].metricDescribe + '  ' + __this.ruleDate[i].period + '分钟' + '  '
                + __this.ruleDate[i].statistics + ' ' + __this.ruleDate[i].comparisonOperator + ' ' + arr[0] + __this.ruleDate[i].metricUnit + '~ ' + arr[1] + __this.ruleDate[i].metricUnit + '连续超过' +
                __this.ruleDate[i].evaluationCount + '次则报警';
            } else if (__this.ruleDate[i].monitorAttributeName == 'diskName') {
              __this.ruleDate[i].metric = '磁盘设备' + '' + __this.ruleDate[i].monitorAttributeContent + ' ' + __this.ruleDate[i].metricDescribe + '  ' + __this.ruleDate[i].period + '分钟' + '  '
                + __this.ruleDate[i].statistics + ' ' + __this.ruleDate[i].comparisonOperator + ' ' + arr[0] + __this.ruleDate[i].metricUnit + '~ ' + arr[1] + __this.ruleDate[i].metricUnit + '连续超过' +
                __this.ruleDate[i].evaluationCount + '次则报警';
            } else {
              __this.ruleDate[i].metric = __this.ruleDate[i].metricDescribe + '  ' + __this.ruleDate[i].period + '分钟' + '  '
                + __this.ruleDate[i].statistics + ' ' + __this.ruleDate[i].comparisonOperator + ' ' + arr[0] + __this.ruleDate[i].metricUnit + '~ ' + arr[1] + __this.ruleDate[i].metricUnit + '连续超过' +
                __this.ruleDate[i].evaluationCount + '次则报警';
            }

          } else {
            if (__this.ruleDate[i].monitorAttributeName == 'port') {
              __this.ruleDate[i].metric = '端口' + '' + __this.ruleDate[i].monitorAttributeContent + ' ' + __this.ruleDate[i].metricDescribe + '  ' + __this.ruleDate[i].period + '分钟' + '  '
                + __this.ruleDate[i].statistics + ' ' + __this.ruleDate[i].comparisonOperator + ' ' + __this.ruleDate[i].threshold + __this.ruleDate[i].metricUnit + ' ' + '连续超过' +
                __this.ruleDate[i].evaluationCount + '次则报警';
            } else if (__this.ruleDate[i].monitorAttributeName == 'device') {
              __this.ruleDate[i].metric = '网络设备' + '' + __this.ruleDate[i].monitorAttributeContent + ' ' + __this.ruleDate[i].metricDescribe + '  ' + __this.ruleDate[i].period + '分钟' + '  '
                + __this.ruleDate[i].statistics + ' ' + __this.ruleDate[i].comparisonOperator + ' ' + __this.ruleDate[i].threshold + __this.ruleDate[i].metricUnit + ' ' + '连续超过' +
                __this.ruleDate[i].evaluationCount + '次则报警';
            } else if (__this.ruleDate[i].monitorAttributeName == 'diskName') {
              __this.ruleDate[i].metric = '磁盘设备' + '' + __this.ruleDate[i].monitorAttributeContent + ' ' + __this.ruleDate[i].metricDescribe + '  ' + __this.ruleDate[i].period + '分钟' + '  '
                + __this.ruleDate[i].statistics + ' ' + __this.ruleDate[i].comparisonOperator + ' ' + __this.ruleDate[i].threshold + __this.ruleDate[i].metricUnit + ' ' + '连续超过' +
                __this.ruleDate[i].evaluationCount + '次则报警';
            } else {
              __this.ruleDate[i].metric = __this.ruleDate[i].metricDescribe + '  ' + __this.ruleDate[i].period + '分钟' + '  '
                + __this.ruleDate[i].statistics + ' ' + __this.ruleDate[i].comparisonOperator + ' ' + __this.ruleDate[i].threshold + __this.ruleDate[i].metricUnit + ' ' + '连续超过' +
                __this.ruleDate[i].evaluationCount + '次则报警';
            }

          };

        };


        __this.totalItems = res['totalElements'];
        __this.size = res['size'];
        __this.totalPages = res['totalPages'];
        __this.isSearched = true;
        __this.growl('success', '页面刷新成功')
      } else if (res.success == -1) {
        this.growl('error', res.code)
      }
    })
  };
  // public getValue(item) {
  //   item = item.replace(",", "");
  //   return item;
  // }
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

  public searchData() {
    this.initLoginListData();
  };
  /**
   * 停止使用
   * @param modal
   */
  public defaultClick(modal) {
    let __this = this;
    let url = '/alarm/alarmRules/disable';
    let param = {
      ruleId: modal.ruleId
    };
    __this.confirmationService.confirm({
      message: '  确定暂停选择的报警规则 ？ 暂停报警后将收不到报警通知',
      header: '暂停报警规则',
      accept: () => {
        __this.alarmService.searchData(__this, url, param, function (res) {
          if (res['success'] == 1 && res['rows']) {
            __this.growl('success', '已禁用该应用');
            __this.initLoginListData();
          }
        })
      }
    })

  };
  /**
   * 启用
   * @param modal
   */
  public startClick(modal) {
    let __this = this;
    let url = '/alarm/alarmRules/enable';
    let param = {
      ruleId: modal.ruleId
    };
    __this.confirmationService.confirm({
      message: '  确定启用选择的报警规则 ？ 启用报警后又能收到报警通知',
      header: '启用报警规则',
      accept: () => {
        __this.alarmService.searchData(__this, url, param, function (res) {
          if (res['success'] == 1 && res['rows']) {
            __this.growl('success', '已启用该应用');
            __this.initLoginListData();
          }
        })
      }
    })
  };
  /**
   * 删除应用
   * @param modal
   */
  public deleteClick(modal) {
    let __this = this;
    let url = '/alarm/alarmRules/delete';
    let param = {
      ruleId: modal.ruleId
    };
    __this.confirmationService.confirm({
      message: '  确定是否删除该报警规则 ？ 删除后将不能恢复',
      header: '删除报警规则',
      accept: () => {
        __this.alarmService.searchData(__this, url, param, function (res) {
          if (res['success'] == 1 && res['rows']) {
            __this.growl('success', '已删除该应用');
            __this.initLoginListData();
          }
        })
      }
    })
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
   * 提示消息
   * @param rel
   * @param res
   */
  public growl(rel: string, res: string) {
    this.msgs = [];
    this.msgs.push({ severity: rel, summary: '', detail: res });
  }

}
