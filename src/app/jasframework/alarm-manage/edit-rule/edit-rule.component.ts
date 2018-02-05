import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlarmService } from './../shared/alarmService';
import { monitorTypeData, slbData, rdsData, redisData, ossData, ecsData, dockerData, dropDownServerMin, dropDownAvarageValue, dropDownServerSign, listData, dropDownTime } from './../shared/data'
import { INCONFIG } from './../../../core/global';
@Component({
  selector: 'edit-rule',
  templateUrl: 'edit-rule.component.html',
  styleUrls: ['./edit-rule.component.scss']
})

export class EditRuleComponent implements OnInit {

  public monitorKind: any;//监控类别
  public monitorObject: any;//监控对象
  public ruleName: any;//规则名称
  public ruleId: any;//路由id
  public searchData: any;//初始化的值
  public monitorKindData: any;//传给后台的监控类别
  public monitorObjectData: any;//传给后台的的监控对象
  public selectdropDownServerContent: any;//规则内容
  public dropDownServerContent: any;//规则内容集合
  public selectMinute: any;//周期
  public selectAvarageValue: any;//平均值
  public selectServerSign: any;//符号值
  public metricUnit: any;//单位
  public limitPercent: number;//百分比
  public limitValue: boolean = false;//百分比的状态
  public percent: any;//第一个百分比的值
  public dropDownServer: boolean = false;//端口号的的状态
  public dropDownServerPort: any;//端口号集合
  public port: any;//端口号；
  public monitorAttributeContent: any;//端口号
  public lengthItem: boolean = false;
  public itemLength: any = 1;
  public itmeData: any = [];
  public arr: any = [];
  public ruleFilterData: any;//组件数据
  public listData: any;
  public evaluationCount: any;//阈值报警
  public informEmail: any;//
  public informMessage: any;//
  public targetCars: any = [];//通知人左侧列表
  public sourceCars: any = [];//通知人右侧列表
  public notifyUserId: any;//用户id
  public notifyUserName: any;//用户名称
  public notifyUserNum: any;//用户电话
  public email: any;//用户邮箱
  public limitData: any;//
  public notifyType: any;//通知方式
  public id: any;//路由id
  public metricDescribe: any;
  public selectServerPort: any;//端口号
  public networkStates: boolean = false;//端口号状态
  public monitorAttributeName: any;
  public deviceStates: boolean = false;//网络设备的状态
  public selectDeviceData: any;//
  public selectDevice: any;//
  public networkDeviceName: any;
  public selectNetworkDevice: any;
  public msgs: any;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public alarmService: AlarmService
  ) {
    Object.assign(this, { dropDownServerMin, dropDownAvarageValue, dropDownServerSign, dropDownTime });
  };
  ngOnInit() {
    this.ruleId = this.route.snapshot.queryParams['objectId'] ? this.route.snapshot.queryParams['objectId'] : this.route.snapshot.params['objectId'];
    this.id = this.route.snapshot.queryParams['id'] ? this.route.snapshot.queryParams['id'] : this.route.snapshot.params['id'];
    this.initList(this.ruleId);
    this.listData = listData;
  };
  /**
   * 初始化值
   * @param id
   */
  public initList(id: any) {
    let __this = this;
    this.targetCars = [];
    this.sourceCars = [];
    let url = '/alarm/alarmRules/queryById';
    let param = {
      ruleId: id,

    };
    __this.alarmService.editList(url, param, __this, function (res) {
      if (res.success == 1 && res['rows']) {
        __this.searchData = res['rows'][0];
        __this.monitorKindData = __this.searchData.monitorType;
        __this.monitorObjectData = __this.searchData.monitorObject;
        __this.ruleName = __this.searchData.ruleName;
        __this.getdropDownServerContent(__this.monitorKindData, __this.searchData.metric);
        __this.getPortDown(__this.monitorKindData, __this.searchData.monitorAttributeContent);
        if (__this.searchData.metric == ecsData[25].value || __this.searchData.metric == ecsData[26].value || __this.searchData.metric == ecsData[27].value || __this.searchData.metric == ecsData[28].value || __this.searchData.metric == ecsData[29].value || __this.searchData.metric == ecsData[30].value) {
          __this.getDevice(__this.searchData.metric, __this.searchData.monitorAttributeContent);
        };
        if (__this.searchData.metric == ecsData[18].value || __this.searchData.metric == ecsData[19].value || __this.searchData.metric == ecsData[20].value || __this.searchData.metric == ecsData[21].value || __this.searchData.metric == ecsData[22].value || __this.searchData.metric == ecsData[23].value || __this.searchData.metric == ecsData[24].value) {
          __this.getDiskName(__this.searchData.metric, __this.searchData.monitorAttributeContent);
        };
        __this.getMonitorObject(__this.monitorKindData, __this.monitorObjectData);
        __this.getselectdropDownServerContent(__this.searchData.period);
        __this.getselectAvarageValue(__this.searchData.statistics);
        __this.getselectServerSign(__this.searchData.comparisonOperator);
        __this.getlimitPercent(__this.searchData.comparisonOperator, __this.searchData.threshold);
        __this.getMerticUnit(__this.searchData.metric);
        __this.getEvaluationCount(__this.searchData.evaluationCount);
        __this.itemChanged(__this.searchData);
        __this.getInformWay(__this.searchData.notifyType);
        __this.getAlramList(__this.searchData.notifyUserId);
      }
    })
  };
  /**
  * 获取设备
  */
  public getDevice(item: any, item1?: any) {
    this.monitorAttributeName = "";
    this.monitorAttributeContent = "";
    this.deviceStates = true;
    let __this = this;
    let url = '/monitor/ecs/v2/getValues';
    let params = {
      "fields": "device",
      "filters": [{
        "itemKey": "metric", "filter": "term",
        "itemValue": item
      }]
    };
    __this.alarmService.searchData(__this, url, params, function (res) {
      if (res.success == 1 && res['rows']) {
        __this.networkChange(res['rows'][0].values);
        __this.selectDeviceData = res['rows'][0].values;
        if (item1) {
          for (var i = 0; i < __this.selectDeviceData.length; i++) {
            if (item1 == __this.selectDeviceData[i].value) {
              __this.selectDevice = __this.selectDeviceData[i].value;
              __this.monitorAttributeContent = __this.selectDevice;
              __this.monitorAttributeName = 'device';
            }
          };
        } else {
          __this.selectDevice = __this.selectDeviceData[0].value;
          __this.monitorAttributeContent = __this.selectDevice;
          __this.monitorAttributeName = 'device';
        };

      }
    })
  };

  /**
   * 获取设备下拉事件
   */
  public changedownDeviceStates(event) {
    this.monitorAttributeContent = event;
  };
  /**
 *硬盘下拉框
 */
  public changedownNetworkStates(event) {

    this.monitorAttributeContent = event;
  };
  /**
   * 获取硬盘
   */
  public getDiskName(item: any, item1?: any) {
    this.monitorAttributeName = "";
    this.monitorAttributeContent = "";
    this.networkStates = true;
    let __this = this;
    let url = '/monitor/ecs/v2/getValues';
    let params = {
      "fields": "device",
      "filters": [{
        "itemKey": "metric", "filter": "term",
        "itemValue": item
      }]
    };
    __this.alarmService.searchData(__this, url, params, function (res) {
      if (res.success == 1 && res['rows']) {
        __this.networkChange(res['rows'][0].values)
        __this.networkDeviceName = res['rows'][0].values;
        if (item1) {
          for (var i = 0; i < __this.networkDeviceName.length; i++) {
            if (item1 == __this.networkDeviceName[i].value) {
              __this.selectNetworkDevice = __this.networkDeviceName[i].value;
              __this.monitorAttributeContent = __this.selectNetworkDevice;
              __this.monitorAttributeName = 'diskName';
            }
          };
        } else {
          __this.selectNetworkDevice = __this.networkDeviceName[0].value;
          __this.monitorAttributeContent = __this.selectNetworkDevice;
          __this.monitorAttributeName = 'diskName';
        }
      }
    })
  };

  /**
 *改变硬盘数据
 */
  public networkChange(arr: any) {
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var data = {
        label: item,
        value: item,
      };
      arr[i] = data;
    };
  };
  /**
   * 获取monitorKind的label
   * @param item
   */
  public itemChanged(item: any) {
    this.monitorKind = item.monitorType;
    for (var i = 0; i < monitorTypeData.length; i++) {
      if (this.monitorKind == monitorTypeData[i].value) {
        this.monitorKind = monitorTypeData[i].label
      }
    };

  };
  /**
   * 获取监控对象的lable
   */
  public getMonitorObject(item, item1) {
    let __this = this;
    let url;
    let param;
    if (item == 'docker') {
      url = '/monitor/docker/v2/getValues'
      param = {
        "fields": "container_Name"
      };
      __this.alarmService.searchData(__this, url, param, function (res) {
        if (res.success == 1 && res['rows']) {
          __this.changedData(res['rows'][0].values);
          for (var i = 0; i < res['rows'][0].values.length; i++) {
            if (item1 == res['rows'][0].values[i].value) {

              __this.monitorObject = res['rows'][0].values[i].label;
            }
          }
        }
      })
    } else {
      url = '/monitor/domain/v2/queryList';
      param = {
        'filters': [
          { "itemKey": "typeName", "filter": "contain", "itemValue": item }
        ]
      };
      __this.alarmService.searchData(__this, url, param, function (res) {
        if (res.success == 1 && res['rows']) {
          __this.changeData(res['rows']);

          for (var i = 0; i < res['rows'].length; i++) {
            if (item1 == res['rows'][i].value) {
              __this.monitorObject = res['rows'][i].label;
            }
          }
        }
      })
    }
  };
  /**
   *获取通知列表
   */
  public getAlramList(item) {

    let arrData1 = [];
    let arrData2 = [];
    let arr = item.split(',');
    let id = INCONFIG.enterpriseId;
    let __this = this;
    let itemArr = [];
    let arr1 = [];
    let url = '/user/getListByEnterprise';
    let param = {
      enterpriseId: id,
      'pageNum': -1
    };
    __this.alarmService.getList(url, param, __this, function (res) {
      if (res.success == 1 && res['rows']) {
        for (var k = 0; k < arr.length; k++) {
          for (var i = 0; i < res['rows'].length; i++) {
            if (arr[k] == res['rows'][i].objectId) {
              __this.targetCars.push(res['rows'][i]);
            };
            if (arr[k] !== res['rows'][i].objectId) {
              itemArr.push(res['rows'][i]);

            }
          };
        };
        /**
         * 数组去重
         */
        for (var i = 0, l = itemArr.length; i < l; i++) {
          if (arr1.indexOf(itemArr[i]) == -1) {
            arr1.push(itemArr[i]);
          }
        };

        for (var s = 0; s < __this.targetCars.length; s++) {
          for (var k = 0; k < arr1.length; k++) {
            if (__this.targetCars[s] == arr1[k]) {
              arr1.splice(k, 1);
              k = k - 1;
            }
          }
        }
        __this.sourceCars = arr1;
      }
    })
  };


  /**
   * 获取通知方式
   */
  public getInformWay(item) {
    if (item == 0) {
      this.informMessage = true;
    } else if (item == 1) {
      this.informEmail = true;
    };
    if (item == 2) {
      this.informEmail = true;
      this.informMessage = true;
    }
  };
  /**
   * 获取端口号
   */
  public getPortDown(item: any, item1: any) {
    console.log(item);
    if (item == 'slb') {

      this.monitorAttributeName = 'port';
      this.selectServerPort = item1;
      this.monitorAttributeContent = item1;
      this.dropDownServer = true;
      console.log(this.monitorAttributeName);
      console.log(this.monitorAttributeContent);
    } else {
      this.dropDownServer = false;


    };
  };
  /**
  * 改变端口号的数据
  */
  public portDownchange(arr: any) {
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var data = {
        label: item,
        value: item,
      }
      arr[i] = data;
    }
  };

  /**
   * 获取百分比的值
   */
  public getlimitPercent(item: any, item1: any) {
    console.log(item1);
    if (item == 'between') {
      this.limitValue = true;
      let arr = item1.split(',');
      this.percent = Number(arr[1]);
      this.limitPercent = Number(arr[0]);
    } else {
      this.limitValue = false;
      this.limitPercent = Number(item1)

      console.log(typeof this.limitPercent);
    };
  };

  /**
   * 获取单位值
   */
  public getMerticUnit(item: any) {
    this.metricUnit = {};
    for (var i = 0; i < listData.length; i++) {
      if (item == listData[i].Metric) {
        this.metricUnit = listData[i].unit;
      }
    }
  };
  /**
   *阈值报警
   */
  public getEvaluationCount(item: any) {
    for (var i = 0; i < dropDownTime.length; i++) {
      if (item == dropDownTime[i].value) {
        this.evaluationCount = dropDownTime[i].value;
      }
    }
  };

  /**
   * 获取符号值
   */
  public getselectServerSign(item: any) {
    for (var i = 0; i < dropDownServerSign.length; i++) {
      if (item == dropDownServerSign[i].value) {
        this.selectServerSign = dropDownServerSign[i].value;
      }
    };
  };
  /**
   * 获取平均值
   */

  public getselectAvarageValue(item: any) {
    for (var i = 0; i < dropDownAvarageValue.length; i++) {
      if (item == dropDownAvarageValue[i].value) {
        this.selectAvarageValue = dropDownAvarageValue[i].value;
      }
    }
  };
  /**
   * 获得周期当前值
   */
  public getselectdropDownServerContent(item) {

    for (var i = 0; i < dropDownServerMin.length; i++) {
      if (item == dropDownServerMin[i].value) {
        this.selectMinute = dropDownServerMin[i].value;
      }
    }
  };

  /**
   * 获取规则内容
   */
  public getdropDownServerContent(item: any, item1: any) {
    if (item == 'ecs') {
      this.dropDownServerContent = ecsData;
    } else if (item == 'slb') {
      this.dropDownServerContent = slbData;
    } else if (item == 'redis') {
      this.dropDownServerContent = redisData;
    } else if (item == 'oss') {
      this.dropDownServerContent = ossData;
    } else if (item == 'rds') {
      this.dropDownServerContent = rdsData;
    } else if (item == 'docker') {
      this.dropDownServerContent = dockerData;
    };
    for (var i = 0; i < this.dropDownServerContent.length; i++) {
      if (item1 == this.dropDownServerContent[i].value) {
        this.selectdropDownServerContent = this.dropDownServerContent[i].value;
      }
    }
  };


  /**
  * docker
  * @param arr
  */
  public changedData(arr: any) {

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
  * ecs slb rds redis oss
  * @param arr
  */
  public changeData(arr: any) {
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var data = {
        label: item.instanceAlias,
        value: item.instanceId,
      }
      arr[i] = data;
    }
  };
  /**
   * 规则内容的下拉框事件
   * @param event
   */
  public onChangeSelectServerContent(event) {
    this.selectdropDownServerContent = event;
    this.metricDescribe = "";
    for (var i = 0; i < listData.length; i++) {
      if (event == listData[i].Metric) {
        this.metricDescribe = listData[i].describe;
      };
    };
    this.getMerticUnit(event);
    if (this.dropDownServer == false) {
      if (event !== ecsData[25].value || event !== ecsData[26].value || event !== ecsData[27].value || event !== ecsData[28].value || event !== ecsData[29].value || event !== ecsData[30].value || event !== ecsData[18].value || event !== ecsData[19].value || event !== ecsData[20].value || event !== ecsData[21].value || event !== ecsData[22].value || event !== ecsData[23].value || event !== ecsData[24].value) {
        this.monitorAttributeContent = "";
        this.monitorAttributeName = "";
      };
      if (event == ecsData[18].value || event == ecsData[19].value || event == ecsData[20].value || event == ecsData[21].value || event == ecsData[22].value || event == ecsData[23].value || event == ecsData[24].value) {
        this.getDiskName(event);
      } else {
        this.networkStates = false;
      };

      if (event == ecsData[25].value || event == ecsData[26].value || event == ecsData[27].value || event == ecsData[28].value || event == ecsData[29].value || event == ecsData[30].value) {
        this.getDevice(event);
      } else {
        this.deviceStates = false;

      };
    }



  };
  /**
   * 周期下拉框事件
   */
  public onChangeSelectServerMin(event) {
    this.selectMinute = event;
  };
  /**
   * 平均值
   * @param event
   */
  public onChangeSelectServerValue(event) {
    this.selectAvarageValue = event;
  };
  /**
   *
   * @param event 符号
   */
  public onChangeSelectServerSign(event) {
    this.selectServerSign = event;
    if (event == 'between') {
      this.limitValue = true;
    } else {
      this.limitValue = false;
    };
  }

  /**
   * 返回
   */
  public goback() {
    let id = {
      id: this.id
    }
    this.router.navigate(['/alarm-manage/alarm/alarm-rule'], { queryParams: id });
  };
  /**
 *向右移动
 */
  public onMoveToSource(event) {
    let arr = [];
    let objArr = [];
    let nameArr = [];
    let numArr = [];
    let emailArr = [];
    if (this.targetCars.length > 0) {
      // this.arrData = this.targetCars.length;
      for (var i = 0; i < this.targetCars.length; i++) {
        let item = this.targetCars[i].objectId;
        let nameItem = this.targetCars[i].userName;
        let numItem = this.targetCars[i].mobileNum;
        let emailItem = this.targetCars[i].email;
        emailArr.push(emailItem);
        objArr.push(item);
        nameArr.push(nameItem);
        numArr.push(numItem);


      };
      this.alarmService.rightData = arr;
      this.notifyUserId = objArr.toString();
      this.notifyUserName = nameArr.toString();
      this.notifyUserNum = numArr.toString();
      this.email = emailArr.toString();
    }

  };
  /**
 *向左移动
 */
  public onMoveToTarget(event) {
    let arr = [];
    let objArr = [];
    let nameArr = [];
    let numArr = [];
    let emailArr = [];
    if (this.targetCars.length > 0) {
      for (var i = 0; i < this.targetCars.length; i++) {
        let item = this.targetCars[i].objectId;
        let nameItem = this.targetCars[i].userName;
        let numItem = this.targetCars[i].mobileNum;
        let emailItem = this.targetCars[i].email;
        emailArr.push(emailItem);
        objArr.push(item);
        nameArr.push(nameItem);
        numArr.push(numItem);
      };
      this.alarmService.rightData = arr;
      this.notifyUserId = objArr.toString();
      this.notifyUserName = nameArr.toString();
      this.notifyUserNum = numArr.toString();
      this.email = emailArr.toString();
    }
  };
  /**
   * 编辑保存
   */
  public ruleSave() {
    let id = {
      id: this.id
    };
    this.lengthItem = true;
    this.limitData = {};
    var time;
    let params;
    let rulesList;
    let arr = [];
    let limitData = [];
    let arr2 = [];
    /**
     * 复选框的值
     */
    if (this.informEmail == true) {
      this.notifyType = '1';
    } else if (this.informMessage == true) {
      this.notifyType = '0';
    };
    if (this.informEmail == true && this.informMessage == true) {
      this.notifyType = '2';
    };
    /**
     * 判断百分比的取值
     */
    if (this.limitValue == true) {
      if (this.limitPercent > this.percent) {
        limitData.push(this.percent, this.limitPercent);
      } else {
        limitData.push(this.limitPercent, this.percent);
      }

      this.limitData = limitData.toString();
    } else {
      this.limitData = this.limitPercent
    };
    /**
     * 保存按钮再次点击
     */
    console.log(this.monitorAttributeName);
    console.log(this.monitorAttributeContent);
    params = {
      ruleId: this.ruleId,
      ruleName: this.ruleName,
      metric: this.selectdropDownServerContent,
      period: this.selectMinute,
      statistics: this.selectAvarageValue,
      metricUnit: this.metricUnit,
      comparisonOperator: this.selectServerSign,
      threshold: this.limitData,
      monitorAttributeName: this.monitorAttributeName ? this.monitorAttributeName : '',
      monitorAttributeContent: this.monitorAttributeContent ? this.monitorAttributeContent : '',
      notifyUserName: this.notifyUserName,
      notifyUserNum: this.notifyUserNum,
      notifyUserId: this.notifyUserId,
      notifyUserMail: this.email,
      notifyType: this.notifyType,
      monitorType: this.monitorKind,
      monitorObject: this.monitorObjectData,
      evaluationCount: this.evaluationCount,
      metricDescribe: this.metricDescribe
    };
    let url = '/alarm/alarmRules/update';
    let __this = this;
    __this.alarmService.searchData(__this, url, params, function (res) {
      if (res.success == 1 && res['rows']) {
        __this.growl('success', '编辑成功');
        __this.router.navigate(['/alarm-manage/alarm/alarm-rule'], { queryParams: id });
      }
    })
  };
  /**
 *连续超过几次阈值后报警
 */
  public evaluationChange(event) {
    this.evaluationCount = event.value;

  }
  /**
   * 取消
   */
  public hide() {
    let id = {
      id: this.id
    }
    this.router.navigate(['/alarm-manage/alarm/alarm-rule'], { queryParams: id });
  }
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
