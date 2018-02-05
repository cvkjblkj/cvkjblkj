import { FormsModule } from '@angular/forms';
import { selectDeviceData, networkDeviceName } from './data'
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
  AfterContentChecked
} from '@angular/core';

@Component({
  selector: 'rule',
  templateUrl: 'rule.component.html',
  styleUrls: ['./rule.component.scss'],
})

export class RuleComponent implements OnInit, OnChanges, AfterContentChecked {
  public Property: boolean = false;//端口html的状态
  public ruleFilterData: any;//规则内容
  public ruleServerContent: any;
  public ruleAvarageContent: any//平均值选中值
  public ruleMinContent: any;//分钟选中值
  public ruleMarkContent: any;//符号选中值
  public obj: any;
  public ruleDownServerPort: any;//端口号的选中值
  public minPercent: boolean = false;//百分比框的状态
  public minPercentContent: any;//百分比值
  public limitPercent: any;//百分比值
  public limitData: any = [];
  public port: any;//端口号
  public monitorAttributeContent: any;//端口号内容
  public selectServerPort: any;//
  public metricUnit: any//单位
  public num: any = 1;
  public isSure: boolean;
  public metricDescribe: any;//描述
  public monitorAttributeName: any;
  public deviceStates: boolean = false;//网络设备的状态
  public selectNetworkDevice: any//
  public networkStates: boolean = false;//硬盘设备的状态
  public selectDevice: any;//
  public object: any;
  @Input() limitStates;
  public msgs: any;
  @Input() dropDownServerStates
  @Input() index: number;//向父组件发射下标
  @Input() listData: any;
  @Input() dropDownServerAvarageValue: any;//规则内容下拉框集合
  @Input() dropDownServerValue: any;//
  @Input() dropDownServerMinValue: any;//分钟选中值
  @Input() ecsData: any;
  @Output() onVoted = new EventEmitter<boolean>();//发射组件内容的事件
  @Output() onVote = new EventEmitter<boolean>();//发射按钮的状态
  @Output() onIndexVoted = new EventEmitter<boolean>();//发射下标的事件
  @Output() onGrowlVoted = new EventEmitter<boolean>();//提示消息发射事件
  @ViewChild('ruleDel') ruleDel: any;
  @Input() lengthItem: boolean = false;//接收父组件的保存事件
  @Input() dropDownServerPort: any;//端口号集合
  @Input() dropDownMarkValue: any;//符号下拉框集合


  constructor(

  ) {

    Object.assign(this, { selectDeviceData, networkDeviceName });

  }
  // @Input() index:number;
  ngOnInit() {
    if (this.dropDownServerValue) {
      this.ruleServerContent = this.dropDownServerValue[0].value;
      this.metricDescribe = this.dropDownServerValue[0].label;
    };
    if (this.ruleServerContent) {
      this.getMerticValue(this.ruleServerContent);
    };
    if (this.dropDownServerStates == true) {
      this.selectServerPort = this.dropDownServerPort[0].value;
      this.monitorAttributeContent = this.selectServerPort;
      this.monitorAttributeName = 'port';
    };
    this.ruleMinContent = this.dropDownServerMinValue[0].value;
    this.ruleAvarageContent = this.dropDownServerAvarageValue[0].value;
    this.ruleMarkContent = this.dropDownMarkValue[0].value;
    this.isSure = false;
    this.onVote.emit(this.isSure);
    // console.log(this.index);

  };

  ngAfterContentChecked() {
    this.dropDownServerStates;
    let arr = [];
    let obj = {};
    if (this.num === 2) {
      if (this.ruleFilterData && this.limitPercent !== undefined && this.minPercentContent !== undefined) {
        this.isSure = true;
        this.onVote.emit(this.isSure);
      } else {
        this.isSure = false;
        this.onVote.emit(this.isSure);
      };

    };
    if (this.num === 1) {
      if (this.ruleFilterData && this.limitPercent !== undefined) {
        this.isSure = true;
        this.onVote.emit(this.isSure);
      } else {
        this.isSure = false;
        this.onVote.emit(this.isSure);
      }
    };

  };
  /**
   * 检测组件输出属性变化
   */
  ngOnChanges() {
    if (this.lengthItem == true) {
      this.getObj();
      this.onVoted.emit(this.obj);
    };
    if (Number(this.limitPercent) > Number(this.minPercentContent)) {
      // this.growl('error', '阙值输入错误');
      this.isSure = false;
      this.limitStates = true;
      this.onGrowlVoted.emit(this.limitStates);
      this.onVote.emit(this.isSure);
    } else {
      this.isSure = true;
      this.limitStates = false;
      this.onGrowlVoted.emit(this.limitStates);
      this.onVote.emit(this.isSure);
    }
  };

  /**
   * 获取值
   */
  getObj() {
    if (this.num === 1) {
      if (this.ruleFilterData != '' && this.ruleServerContent != '' && this.ruleMinContent != '' && this.limitPercent !== undefined && this.ruleMarkContent != '') {
        this.limitData = [];
        let limitData = [];
        if (this.minPercent == true) {
          limitData.push(this.minPercentContent, this.limitPercent);
          this.limitData = limitData.toString();
        } else {
          this.limitData = this.limitPercent;
        };
        this.obj = {
          ruleName: this.ruleFilterData,
          metric: this.ruleServerContent,
          period: this.ruleMinContent,
          comparisonOperator: this.ruleMarkContent,
          threshold: this.limitData,
          statistics: this.ruleAvarageContent,
          metricUnit: this.metricUnit,
          metricDescribe: this.metricDescribe,
          monitorAttributeName: this.monitorAttributeName ? this.monitorAttributeName : '',
          monitorAttributeContent: this.monitorAttributeContent ? this.monitorAttributeContent : ''
        };
      };
    };
    if (this.num === 2) {
      if (this.ruleFilterData != '' && this.ruleServerContent != '' && this.ruleMinContent != '' && this.limitPercent !== undefined && this.minPercentContent !== undefined && this.ruleMarkContent != '') {
        this.limitData = [];
        let limitData = [];
        if (this.minPercent == true) {
          // limitData.push(this.minPercentContent, this.limitPercent);
          if (this.limitPercent > this.minPercentContent) {

            limitData.push(this.minPercentContent, this.limitPercent);
          } else {
            limitData.push(this.limitPercent, this.minPercentContent);
          }
          this.limitData = limitData.toString();
        } else {
          this.limitData = this.limitPercent;
        };
        this.obj = {
          ruleName: this.ruleFilterData,
          metric: this.ruleServerContent,
          period: this.ruleMinContent,
          comparisonOperator: this.ruleMarkContent,
          threshold: this.limitData,
          statistics: this.ruleAvarageContent,
          metricUnit: this.metricUnit,
          metricDescribe: this.metricDescribe,
          monitorAttributeName: this.monitorAttributeName ? this.monitorAttributeName : '',
          monitorAttributeContent: this.monitorAttributeContent ? this.monitorAttributeContent : ''
        };
      };
    }

  };
  /**
   * 规则内容change
   */
  public dropDownServer(event) {
    this.ruleServerContent = "";
    this.ruleServerContent = event;
    for (var i = 0; i < this.listData.length; i++) {
      if (event == this.listData[i].Metric) {
        this.metricDescribe = this.listData[i].describe;
      }
    }

    this.getMerticValue(this.ruleServerContent);
    if (this.dropDownServerStates == false) {
      if (event !== this.ecsData[25].value || event !== this.ecsData[26].value || event !== this.ecsData[27].value || event !== this.ecsData[28].value || event !== this.ecsData[29].value || event !== this.ecsData[30].value || event !== this.ecsData[18].value || event !== this.ecsData[19].value || event !== this.ecsData[20].value || event !== this.ecsData[21].value || event !== this.ecsData[22].value || event !== this.ecsData[23].value || event !== this.ecsData[24].value) {
        this.monitorAttributeContent = "";
        this.monitorAttributeName = "";
      };
      if (event == this.ecsData[18].value || event == this.ecsData[19].value || event == this.ecsData[20].value || event == this.ecsData[21].value || event == this.ecsData[22].value || event == this.ecsData[23].value || event == this.ecsData[24].value) {
        this.getDiskName(event);
      } else {
        this.networkStates = false;
      };
      if (event == this.ecsData[25].value || event == this.ecsData[26].value || event == this.ecsData[27].value || event == this.ecsData[28].value || event == this.ecsData[29].value || event == this.ecsData[30].value) {
        this.getDevice(event);
      } else {
        this.deviceStates = false;
      };

    }


  };
  /**
  * 获取设备
  */
  public getDevice(item: any) {
    this.monitorAttributeName = "";
    this.monitorAttributeContent = "";
    this.monitorAttributeName = 'device';
    this.deviceStates = true;
    this.selectDevice = selectDeviceData[0].value;
    this.monitorAttributeContent = this.selectDevice
  };
  /**
   * 获取设备下拉事件
   */
  public ruleChangeDeviceStates(event) {
    this.monitorAttributeContent = event
  };
  /**
   * 获取硬盘
   */
  public getDiskName(item: any) {
    this.monitorAttributeName = "";
    this.monitorAttributeContent = "";
    this.monitorAttributeName = 'diskName';
    this.networkStates = true;
    this.selectNetworkDevice = networkDeviceName[0].value;
    this.monitorAttributeContent = this.selectNetworkDevice;
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
  public ruleChangeNetworkStates(event) {
    this.monitorAttributeContent = event;
  }

  /**
   * 分钟选中值
   */
  public dropDownMin(event) {
    this.ruleMinContent = "";
    this.ruleMinContent = event;
  };
  /**
   * 平均值选中值
   * @param event
   */
  public dropDownAvarage(event) {
    this.ruleAvarageContent = event;
  };
  /**
   * 符号选中值
   * @param event
   */
  public dropDownMark(event) {
    this.ruleMarkContent = "";
    this.ruleMarkContent = event;
    if (event == 'between') {
      this.minPercent = true;
      // this.minPercentContent = 0;
      this.num = 2;
      this.isSure = false;
    } else {
      this.minPercent = false;
      this.num = 1;
    };

  };
  public downServerPort(event) {
    this.selectServerPort = "";
    this.selectServerPort = event;
    this.monitorAttributeContent = this.selectServerPort;
  };
  delete() {
    this.ruleDel.nativeElement.innerHTML = '';
    this.ruleServerContent = '';
    this.ruleMinContent = '';
    this.ruleMarkContent = '';
    this.ruleDel.nativeElement.remove();
    this.isSure = true;
    this.onVote.emit(this.isSure);
    this.num = false;
    this.index--;
    let arr;
    arr = this.index;
    this.onIndexVoted.emit(arr);
  };
  /**
   * 获取单位
   * @param event
   */
  /**
   * 获取单位
   * @param event
   */
  public getMerticValue(event) {
    this.metricUnit = "";
    for (var i = 0; i < this.listData.length; i++) {

      if (event == this.listData[i].Metric) {
        this.metricUnit = this.listData[i].unit;

      }
    }
  };
  /**
   * 第一个阙值的的事件
   * @param event
   */
  public limitChange(event) {
    console.log(event);
  };
  /**
   * 第二个阙值的事件
   * @param event
   */
  public minChange(event) {
    console.log(event);
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
