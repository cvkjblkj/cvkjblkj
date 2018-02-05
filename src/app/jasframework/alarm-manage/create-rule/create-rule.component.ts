
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterContentInit, OnChanges } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { createTypeData, slbData, rdsData, redisData, ossData, ecsData, dockerData, dropDownServerMin, dropDownAvarageValue, dropDownServerSign, dropDownTime, listData } from './../shared/data'
import { AlarmService } from './../shared/alarmService';
import { INCONFIG } from './../../../core/global';
import { AppAdmin } from './../shared/modal'
declare var $: any; // 引入jQuery
@Component({
  selector: 'create-rule',
  templateUrl: 'create-rule.component.html',
  styleUrls: ['./create-rule.component.scss']
})

export class CreateRuleComponent implements OnInit, AfterContentInit, OnChanges {
  public event: boolean = true;
  public selectServerName: any;
  public selectObjectData: any;
  public dropDownServerNames: any;
  public loop: any; //筛选条件遍历的条件
  public dropDownServerStates: boolean = false;
  public limitValue: boolean = false;
  public sourceCars: any = [];
  public targetCars: any = [];
  public model = new AppAdmin();
  public dropDownServerPort: any; //监控类别
  public selectServerClass: any;//监控对象
  public filterSearchData: any;//规则内容
  public monitorObjectData: any
  public informMetod: any;//通知方式
  private ruleFilterData: any;
  public dropDownAvarageValue: any;//子组件传的值
  public itmeData: any = [];
  public itemLength: any = 1;
  public item: any = 1//子组件传的值
  public dropDownServerMinValue: any;//子组件传的值
  public lengthItem: boolean = false
  public dropDownServerContent: any;
  public selectServerContent: any;//规则内容选中值
  public selectServerMin: any;//分钟选中值
  public selectServerValue: any;//平均值
  public selectServerSign: any;//符号选中值
  public percent: any;//
  public limitPercent: any //
  public evaluationCount: any;//联系超过阈值报警
  public arr: any = [];//组件返回差入的数组
  public notifyUser: any;//通知人
  public informEmail: any;//邮箱通知方式
  public informMessage: any;//短信通知方式
  public notifyType: any;//通知方式
  public limitData: any;
  public defaultLabel: string = '请选择--'; //p-multiSelect 在没有选择时显示。
  public arrData: any;//通知列表选中的个数
  public port: any;//端口号参数
  public monitorAttributeContent: any//通知的的id
  public notifyUserName: any;//通知人
  public notifyUserNum: any;//通知人手机号
  public email: any;//通知人的邮箱
  public defaultLabelMonitor: string; // 监控对象默认的值
  public metricUnit: any;//单位
  public listData: any;
  public notifyUserId: any;
  public id: any;//路由id
  public isSure: any = undefined;//组件状态
  public metricDescribe: any;//描述
  public seletedData: any;
  public filterBy: any;
  public networkDeviceName: any;//硬盘设备
  public selectNetworkDevice: any//
  public networkStates: boolean = false;//硬盘设备的状态
  public selectServerPort: any;//
  public monitorAttributeName: any;//
  public deviceStates: boolean = false;//网络设备的状态
  public selectDeviceData: any;//
  public selectDevice: any;//
  public ecsData: any;
  public msgs: any;
  public limitStates: boolean = false;
  public buttonStates: boolean = false;
  @ViewChild('pickList') pickList: any
  constructor(
    public location: Location,
    public route: ActivatedRoute,
    public router: Router,
    public alarmService: AlarmService,
    public elementRef: ElementRef

  ) {
    this.loop = [0, 1, 2, 3, 4];
    Object.assign(this, { createTypeData, dropDownServerMin, dropDownAvarageValue, dropDownServerSign, dropDownTime });

  }
  ngOnInit() {
    this.id = this.route.snapshot.queryParams['id'] ? this.route.snapshot.queryParams['id'] : this.route.snapshot.params['id'];
    this.selectServerName = createTypeData[0].value;
    if (this.selectServerName == 'slb') {
      this.monitorAttributeName = 'port';
      this.dropDownServerStates = true;
      this.downServerPort()
    }
    this.selectServerMin = dropDownServerMin[0].value;
    this.selectServerValue = dropDownAvarageValue[0].value;
    this.selectServerSign = dropDownServerSign[0].value;
    this.evaluationCount = dropDownTime[0].value;
    this.rlueContent(this.selectServerName);
    this.monitorObject(this.selectServerName);
    this.getUserList();
    this.listData = listData;
    this.ecsData = ecsData;

  };
  ngAfterContentInit() {
  };
  ngOnChanges() {
  };
  /**
   * 监控类别
   * @param event
   */
  public onChangeService(event) {
    $('.ruleBox').find('.rule ').html('');
    this.itmeData = [];
    this.selectObjectData = undefined;
    if (event == 'slb') {
      this.monitorAttributeName = 'port';
      this.dropDownServerStates = true;
      this.networkStates = false;
      this.deviceStates = false;
      // localStorage.setItem('PropertyObj', JSON.stringify(this.dropDownServerStates));
      this.downServerPort()
    } else {
      this.dropDownServerStates = false;
      this.monitorAttributeName = '';
      // localStorage.removeItem('PropertyObj');
      this.monitorAttributeContent = '';
      this.networkStates = false;
      this.deviceStates = false;
    }
    this.selectServerName = event;
    this.monitorObject(event);
    this.rlueContent(event);
  };
  /**
   * 获取监控对象的值
   */
  // @ViewChild('pMutiSelect') pMutiSelect: any
  public monitorObjectItem: any;
  public monitorObject(event) {

    this.monitorObjectData = [];
    let __this = this;
    let url;
    let param;
    let arr = [];
    let arr1 = [];
    if (event == 'docker') {
      url = '/monitor/docker/v2/getValues'
      param = {
        "fields": "container_Name"
      };
      __this.alarmService.searchData(__this, url, param, function (res) {
        if (res.success == 1 && res['rows']) {
          __this.changedData(res['rows'][0].values);
          __this.monitorObjectData = res['rows'][0].values;
        }
      })
    } else {
      url = '/monitor/domain/v2/queryList';
      param = {
        'filters': [
          { "itemKey": "typeName", "filter": "contain", "itemValue": event }
        ]
      };
      __this.alarmService.searchData(__this, url, param, function (res) {
        if (res.success == 1 && res['rows']) {
          arr.push(res['rows']);
          arr1.push(res['rows']);
          __this.monitorObjectItem = arr1[0];
          __this.changeData(arr[0]);
          __this.monitorObjectData = arr[0];
        }
      })
    }
  };
  /**
   * 监控对象选中值
   * @param event
   */

  public onChangeObjectData(event, event1) {
    this.selectObjectData = event.value;
    if (event.value.length == 1) {
      for (var i = 0; i < event.value.length; i++) {
        for (var j = 0; j < this.monitorObjectItem.length; j++) {
          if (event.value[i] == this.monitorObjectItem[j].value) {
            this.downServerPort(this.monitorObjectItem[j].instanceId);
          }
        }
      }
    } else {
      this.dropDownServerPort = [
        { label: 443, value: 443 }
      ]
    }
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
        value: item.instanceAlias,
        instanceId: item.instanceId
      }
      arr[i] = data;
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
   * 规则内容下拉列表
   * @param event
   */
  public rlueContent(event) {
    // this.dropDownServerContent = [];
    if (event == 'ecs') {
      this.dropDownServerContent = ecsData;
    } else if (event == 'slb') {
      this.dropDownServerContent = slbData;
    } else if (event == 'redis') {
      this.dropDownServerContent = redisData;
    } else if (event == 'oss') {
      this.dropDownServerContent = ossData;
    } else if (event == 'rds') {
      this.dropDownServerContent = rdsData;
    } else if (event == 'docker') {
      this.dropDownServerContent = dockerData;
    };

    this.selectServerContent = this.dropDownServerContent[0].value;
    this.metricDescribe = this.dropDownServerContent[0].label;
    this.getMerticValue(this.selectServerContent);
  };
  /**
   * 规则内容选中值
   * @param event
   */
  public onChangeSelectServerContent(event) {
    this.selectServerContent = "";
    this.selectServerContent = event;
    this.metricDescribe = "";
    for (var i = 0; i < listData.length; i++) {
      if (event == listData[i].Metric) {
        this.metricDescribe = listData[i].describe;
      };
    };
    this.getMerticValue(this.selectServerContent);
    if (this.dropDownServerStates == false) {
      if (event !== ecsData[25].value || event !== ecsData[26].value || event !== ecsData[27].value || event !== ecsData[28].value || event !== ecsData[29].value || event !== ecsData[30].value || event !== ecsData[18].value || event !== ecsData[19].value || event !== ecsData[20].value || event !== ecsData[21].value || event !== ecsData[22].value || event !== ecsData[23].value || event !== ecsData[24].value) {
        this.monitorAttributeContent = "";
        this.monitorAttributeName = "";
      };
      if (event == ecsData[25].value || event == ecsData[26].value || event == ecsData[27].value || event == ecsData[28].value || event == ecsData[29].value || event == ecsData[30].value) {
        this.getDevice(event);
      } else {
        this.deviceStates = false;
      };
      if (event == ecsData[18].value || event == ecsData[19].value || event == ecsData[20].value || event == ecsData[21].value || event == ecsData[22].value || event == ecsData[23].value || event == ecsData[24].value) {
        this.getDiskName(this.selectServerContent);
      } else {
        this.networkStates = false;
      };
    }


  };
  /**
   * 获取设备
   */
  public getDevice(item: any) {
    this.monitorAttributeName = 'device';
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
        __this.selectDevice = __this.selectDeviceData[0].value;
        __this.monitorAttributeContent = __this.selectDevice;
      }
    })
  };
  /**
   * 获取设备下拉事件
   */
  public changedownDeviceStates(event) {
    this.monitorAttributeContent = event;

  }
  /**
   * 获取硬盘
   */
  public getDiskName(item: any) {

    this.monitorAttributeName = 'diskName';
    this.networkStates = true;
    let __this = this;
    // __this.networkDeviceName = [];
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
        __this.selectNetworkDevice = __this.networkDeviceName[0].value;
        __this.monitorAttributeContent = __this.selectNetworkDevice;
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
   *硬盘下拉框
   */
  public changedownNetworkStates(event) {
    this.monitorAttributeContent = event;
  }


  /**
   * 分钟选中值
   * @param event
   */
  public onChangeSelectServerMin(event) {
    this.selectServerMin = "";
    this.selectServerMin = event;
  };
  /**
   * 平均值选中值
   * @param event
   */
  public onChangeSelectServerValue(event) {
    this.selectServerValue = "";
    this.selectServerValue = event;
  };
  /**
   * 符号选中值
   * @param event
   */
  public onChangeSelectServerSign(event) {
    this.selectServerSign = "";
    this.selectServerSign = event;
    if (event == 'between') {
      this.limitValue = true;
    } else {
      this.limitValue = false;
    };
  };
  /**
   *连续超过几次阈值后报警
   */
  public evaluationChange(event) {
    this.evaluationCount = event.value;

  };
  /**
   * 端口号
   */
  public downServerPort(event?: any) {
    let __this = this;
    let url = '/monitor/slb/v2/getValues';
    let param;
    if (event) {
      param = {
        "fields": "port",
        'filters': [{ "itemKey": "instanceId", "filter": "contain", "itemValue": event }],
      };
    } else {
      param = {
        "fields": "port",

      };
    }


    __this.alarmService.searchData(__this, url, param, function (res) {
      if (res.success == 1 && res['rows']) {
        __this.portDownchange(res['rows'][0].values);
        __this.dropDownServerPort = res['rows'][0].values;
        __this.monitorAttributeContent = __this.dropDownServerPort[0].value;
        __this.selectServerPort = __this.dropDownServerPort[0].value
      };
    });
  };
  public changedownServerPort(event) {
    this.monitorAttributeContent = event;
    this.monitorAttributeName = 'port'
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
      };
      arr[i] = data;
    };
  };

  /**
   * 动态加载组件
   *
   * @param event
   */
  public add() {
    this.itemLength++;
    this.itmeData.push(this.itemLength);
    // this.itemLength.length < 2
  };
  /**
   * 返回
   */
  public goback() {
    let id = {
      id: this.id
    };
    this.router.navigate(['/alarm-manage/alarm/alarm-rule'], { queryParams: id });
  };
  /**
   * 保存按钮
   */
  public ruleSave() {
    this.lengthItem = true;
    this.limitData = {};
    let id = {
      id: this.id
    }
    var time;
    let params;
    let obj;
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
    if (!this.ruleFilterData && this.itmeData.length != 0) {
      time = setTimeout(() => {
        this.ruleSave();
      }, 1000);
      return;
    };
    if (this.ruleFilterData) {
      obj = {
        ruleName: this.filterSearchData,
        metric: this.selectServerContent,
        period: this.selectServerMin,
        statistics: this.selectServerValue,
        comparisonOperator: this.selectServerSign,
        threshold: this.limitData,
        metricDescribe: this.metricDescribe,
        metricUnit: this.metricUnit,
        monitorAttributeName: this.monitorAttributeName ? this.monitorAttributeName : '',
        monitorAttributeContent: this.monitorAttributeContent ? this.monitorAttributeContent : ''
      };
      this.ruleFilterData.push(obj);
      params = {
        monitorType: this.selectServerName,
        monitorObject: this.selectObjectData,
        notifyUserId: this.notifyUserId,
        notifyUserName: this.notifyUserName,
        notifyUserNum: this.notifyUserNum,
        notifyUserMail: this.email,
        notifyType: this.notifyType,
        evaluationCount: this.evaluationCount,
        rulesList: this.ruleFilterData,

      }
    };
    if (!this.ruleFilterData) {
      obj = {
        ruleName: this.filterSearchData,
        metric: this.selectServerContent,
        period: this.selectServerMin,
        metricDescribe: this.metricDescribe,
        statistics: this.selectServerValue,
        metricUnit: this.metricUnit,
        comparisonOperator: this.selectServerSign,
        threshold: this.limitData,
        monitorAttributeName: this.monitorAttributeName ? this.monitorAttributeName : '',
        monitorAttributeContent: this.monitorAttributeContent ? this.monitorAttributeContent : ''
      };
      arr2.push(obj)
      params = {
        notifyUserName: this.notifyUserName,
        notifyUserNum: this.notifyUserNum,
        notifyUserId: this.notifyUserId,
        notifyUserMail: this.email,
        notifyType: this.notifyType,
        monitorType: this.selectServerName,
        monitorObject: this.selectObjectData,
        evaluationCount: this.evaluationCount,
        rulesList: arr2
      };
    };
    let url = '/alarm/alarmRules/add';
    let __this = this;
    __this.alarmService.searchData(__this, url, params, function (res) {
      if (res.success == 1 && res['rows']) {
        __this.buttonStates = true;
        __this.growl('error', '创建规则成功');
        __this.router.navigate(['/alarm-manage/alarm/alarm-rule'], { queryParams: id });
      }
    })
  };
  public hide() {
    let id = {
      id: this.id
    };
    this.router.navigate(['/alarm-manage/alarm/alarm-rule'], { queryParams: id });
  }
  /**
   * 获取组件数据
   * @param event
   */
  public onVoted(event) {

    if (event.ruleName != undefined && event.metric != undefined && event.comparisonOperator != undefined && event.statistics != undefined && event.period != undefined && event.threshold != undefined) {
      this.arr.push(event);
      this.ruleFilterData = this.arr;

    };
  };
  /**
   * 获取子组件传给父组件的下表
   */
  public onIndexVoted(event) {
    this.itmeData.length = event;

  };

  /**
   * 获取通知列表
   */
  public getUserList() {
    let id = INCONFIG.enterpriseId;
    let __this = this;
    let url = '/user/getListByEnterprise';
    let param = {
      enterpriseId: id,
      'pageNum': -1
    };
    __this.alarmService.getList(url, param, __this, function (res) {
      if (res.success == 1 && res['rows']) {

        __this.sourceCars = res['rows'];


      }
    })
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
    this.arrData = {};
    if (this.targetCars.length > 0) {
      this.targetCars.length;
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
    };
  };
  /**
   *向右移动
   */
  public onMoveToSource(event) {
    let arr = [];
    this.arrData = {};
    let objArr = [];
    let nameArr = [];
    let numArr = [];
    let emailArr = [];
    if (this.targetCars.length > 0) {
      this.targetCars.length;
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
    };
  };
  /**
   * 组件状态
   * @param event
   */
  public onVote(event) {
    this.isSure = event;
  };
  public onGrowlVoted(event) {
    console.log(event);
    if (event == true) {
      this.growl('error', '阙值取值错误')
    }
  }
  /**
   * 获取单位
   * @param event
   */
  public getMerticValue(event) {
    this.metricUnit = {};

    for (var i = 0; i < listData.length; i++) {

      if (event == listData[i].Metric) {
        this.metricUnit = listData[i].unit;

      };

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
  }
}
