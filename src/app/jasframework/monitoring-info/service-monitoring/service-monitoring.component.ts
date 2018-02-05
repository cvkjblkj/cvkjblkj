import { Params } from '@angular/router';
import { Timestamp } from 'rxjs/Rx';
import { relative } from 'path';
import { FormsModule } from '@angular/forms';
import { CarService } from './../../../cars/car.service';
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { MonitorService } from './monitoring.service';
import Global = require('./../../../core/global.ts');
import { SelectItem } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { Message } from 'primeng/primeng';
import { INCONFIG } from './../../../core/global';
import { CommonService } from './../../../core/common-service/common.service'
declare var $: any;
@Component({
  selector: 'app-monitoring',
  templateUrl: './service-monitoring.component.html',
  styleUrls: ['./service-monitoring.component.css'],
  providers: [
    MonitorService
  ]
})
export class servicetorComponent implements OnInit, AfterViewInit {
  public serviceData: any; // 服务的列表数据
  public topDuration: any; // 显示当前列表的请求数据
  public lookback: any; // 开始时间到结束时间的时间段微秒单位
  public minDuration: any; // 持续时间
  public dialogVisible: boolean; // 弹出框状态
  public serviceName: any; // 服务
  public limit: any = 10;//限制条数
  public methodItem: any = [];//第二个下拉框的数据
  public spanName: any;//接口
  public serviceItem: SelectItem[];
  public delayDate: any;//向前延迟的时间;
  public startTime: any;//开始
  public endTime: any;//结束
  public selectedItem: any;//点击选中
  public annotations: any;//弹出框数据
  public binaryAnnotations: any;//弹出框第二个列表的数据
  public ServiceDetail: any = [];//插入数据的空数组
  public topTitle: any;//弹出框标题
  public topMethod: any;//弹出框标题
  public msgs: any;//提示消息
  public durationInterval: any;
  public arry: any = [];//接收异常百分比
  public selectItem: any;//下选框内容
  private zn: any;  //日历区域配置属性的
  public relativeTime: any;//相对时间
  public key: any;//关键值
  public binaryAnnotation: any = [];
  public value: any;//
  public localAddress: any;//地址
  public service: any;//服务
  public binaryItme: any;
  public sortF = "createTime";
  public emptyMessage: string = '未查到相关数据'; // primeng dataTable没有数据时，显示的内容

  constructor(
    private monitorService: MonitorService,
    private commonService: CommonService
  ) {
    this.zn = INCONFIG.zn;
  }
  ngOnInit() {
    this.delayDate = new Date();//延迟时间
    this.startTime = new Date(this.delayDate.getTime() - 1000 * 60 * 60);
    this.endTime = new Date();
    this.getService();


  };
  /**
  * 也面初始化数据
  */
  getList() {
    let _that = this;
    let url = '/traces';
    if (!this.minDuration) {
      this.minDuration = '';
    }
    var endTime = this.endTime.getTime();
    var lookTime = this.endTime.getTime() - this.startTime.getTime();
    let params = {
      endTs: endTime,
      limit: _that.limit ? _that.limit : '',
      lookback: lookTime,
      minDuration: _that.minDuration ? _that.minDuration * 1000 : '',
      serviceName: _that.serviceName,
      spanName: _that.spanName
    }
    _that.monitorService.search(url, params, _that, function (res) {
      _that.serviceData = _that.listData(res);
      _that.growl('success', '列表刷新成功');
    })

  }
  /**
   * 获得serviceName
   */
  getService() {
    let _that = this;
    let url = '/services';
    let parms = undefined;
    _that.monitorService.getServices(url, parms, _that, function (res) {

      _that.getchange(res);
      _that.serviceItem = res;
      _that.serviceName = _that.serviceItem[0].label;
      _that.spanName = "all";
      _that.getList();
      _that.getSpanName(_that.serviceItem[0].label);
      if (res.length > 0) {
        _that.getSpanName(_that.serviceItem[0].value);
      };
    });
  }




  /**
   * 接口获得spanName
   * @param serviceName
   */
  public getSpanName(serviceName: any) {
    let _that = this;
    let url = '/spans';
    let params = serviceName;
    _that.monitorService.getList(url, params, _that, function (res) {
      _that.getchange(res);
      res.unshift({ label: 'All', value: 'all' });
      _that.methodItem = res;
      _that.spanName = res[0].value;
    })
  };
  /**
  * 下拉框获取serviceName
  * @param event
  */
  public onServicesChange(event) {
    this.getSpanName(event.value);
  };
  /**
   * 改变res数据
   * @param arr
   */
  public getchange(arr: any) {
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
   * 弹出框
   * @param startTime
   * @param item
   * @param viewModal
   */
  @ViewChild('modalContent') modalContent;//获取弹出框的内容
  public showServiceDetail(startTime: any, item: any, viewModal: any) {

    if (this.modalContent.nativeElement.style.height < '500px') {
      this.modalContent.nativeElement.style.height = this.modalContent.nativeElement.style.height;
    } else {
      this.modalContent.nativeElement.style.height = $('body')[0].clientHeight - 120 + 'px';
      this.modalContent.nativeElement.style.overflow = "auto";
    }

    this.selectedItem = item;
    viewModal.show();//弹出框显现
    this.ServiceDetail = [];
    this.binaryAnnotation = [];
    this.binaryItme = {};
    this.annotations = item.annotations;//取值
    this.binaryAnnotations = item.binaryAnnotations;//取值
    //关键值栏的内容
    if (this.binaryAnnotations) {
      for (var j = 0; j < this.binaryAnnotations.length; j++) {
        //得到Local Component  Local Address
        if (this.binaryAnnotations[j].key == 'lc') {
          this.key = 'Local Component';
          this.localAddress = 'Local Address';
          this.service = this.binaryAnnotations[j].endpoint.ipv4 + ':' + this.binaryAnnotations[j].endpoint.port + '(' + this.binaryAnnotations[j].endpoint.serviceName + ')'
        } else {
          this.key = this.binaryAnnotations[j].key;
        };
        //得到 key value
        if (this.binaryAnnotations[j].key == 'sa') {
          this.key = 'Server Address';
          this.value = this.binaryAnnotations[j].endpoint.ipv4 + ':' + this.binaryAnnotations[j].endpoint.port + '(' + this.binaryAnnotations[j].endpoint.serviceName + ')'
        } else {
          this.value = this.binaryAnnotations[j].value;

        };

        var binaryObj = {
          key: this.key, value: this.value,
        }
        this.binaryItme = {
          localAddress: this.localAddress, service: this.service
        }

        this.binaryAnnotation.push(binaryObj)
      }
    }
    /**
     * 日期栏内容
     */
    if (this.annotations) {
      //标题内容
      this.topTitle = this.annotations[0].endpoint.serviceName;
      for (var i = 0; i < this.annotations.length; i++) {
        var address = this.annotations[i].endpoint.ipv4 + ':' + this.annotations[i].endpoint.port + '(' + this.annotations[i].endpoint.serviceName + ')';//地址
        var starttime = this.commonService.formatDate(new Date(parseInt(this.annotations[i].timestamp) / 1000)).formatTime;//开始时间
        var relativeTime = this.annotations[i].timestamp - startTime;//相对时间
        if (relativeTime == 0) {
          this.relativeTime = '';
        } else {
          this.relativeTime = (relativeTime / 1000).toFixed(3) + "ms";
        };
        var value = this.annotations[i].value;//备注
        if (value == "sr") {
          value = "Server Receive";
        } else if (value == "ss") {
          value = "Server Send";
        } else if (value == "cr") {
          value = "Client Receive";
        } else if (value == "cs") {
          value = "Client Send";
        };
        var annotationsObj = {
          address: address, date: starttime, value: value, relativeTime: this.relativeTime
        };
        this.ServiceDetail.push(annotationsObj);
      }
    } else if (item.binaryAnnotations) {
      this.topTitle = item.binaryAnnotations[0].endpoint.serviceName;
    };
    this.topDuration = item.duration / 1000;//时间段
    this.topMethod = item.name;//表头

  };

  /**
   *
   * 搜索事件
   * @param managerName
   * @param spanName
   * @param lookback
   * @param endTs
   * @param minDuration
   */
  public searchFor(serviceName: any, spanName: any, startTime: any, endTime: any, minDuration: any, limit: any, ) {
    if (startTime == undefined && !startTime) {
      this.growl('error', '开始时间必须大于0');
      return;
    };
    if (endTime == undefined && !endTime) {
      this.growl('error', '结束时间必须大于0');
      return;
    };
    endTime = (new Date(endTime)).getTime();
    if (minDuration == "0") {
      this.growl('error', '持续时长必须大于0');
      return;
    };
    if (minDuration < 0) {
      this.growl('error', '持续时长必须大于0');
      return;
    };
    if (limit == '0') {
      this.growl('error', '数量必须大于0');
      return;
    };
    startTime = endTime - (new Date(startTime)).getTime();
    let _that = this;
    let url = '/traces';
    let params = {
      endTs: endTime,
      limit: limit ? limit : '',
      lookback: startTime,
      minDuration: minDuration ? minDuration * 1000 : '',
      serviceName: _that.serviceName,
      spanName: _that.spanName
    }
    _that.monitorService.search(url, params, _that, function (res) {
      _that.serviceData = _that.listData(res);
      console.log(_that.serviceData)
      _that.growl('success', '列表刷新成功');
    })

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


  /**
 * 获取列表数据
 * @param data 后台返回数据
 * @return
 * newData ：页面渲染需要的数据
 */

  public listData(data) {

    let newData = []; // 页面需要的数据
    for (var i = 0; i < data.length; i++) {
      let item = data[i]; //每一项数组
      let startTime = item[0].timestamp; //第一个请求开始时间
      let maxDuration = item[0].duration; //最大的持续时长，定义第一个span的duration为最长持续时长
      let parentNode = item[0]; //每一项的父亲节点
      parentNode.hierarchy = 0;
      parentNode.children = [];
      let endTime = item[0].duration + item[0].timestamp;//结束时间

      this.arry = [];
      // 遍历每一项数组
      for (var j = 0; j < item.length; j++) {
        let element = item[j]; //每一条数据
        let eleDuration = element.duration + element.timestamp - startTime; //每一项的总持续时长 = 每一项的duration + 每一项的开始时间
        let eleTime = element.duration + element.timestamp;
        // 判断最长的持续时长
        if (endTime < eleTime) {
          maxDuration = eleDuration; //有异常情况
          let servicePercent = parseInt(String((item[0].duration + element.duration) / maxDuration * 100)) + '%';
          this.arry.push(servicePercent);
        }
      }
      let changeChildren = this.getchildData(parentNode, item, 0, [], []);

      //将树装格式数据封装成数组
      var childrenList = [];
      childrenList.push(parentNode);
      // childrenlist 重新封装为数组
      let newChilredList = childrenList.concat(changeChildren.childrenList);
      this.durationInterval = (maxDuration / 5000);
      var durations = {
        one: Math.floor(this.durationInterval * 1000 * 1) / 1000 + 'ms',
        two: Math.floor(this.durationInterval * 1000 * 2) / 1000 + 'ms',
        three: Math.floor(this.durationInterval * 1000 * 3) / 1000 + 'ms',
        four: Math.floor(this.durationInterval * 1000 * 4) / 1000 + 'ms',
        five: Math.floor(this.durationInterval * 1000 * 5) / 1000 + 'ms',
      };
      var listItem = {
        'serviceName': item[0].annotations ? item[0].annotations[0].endpoint.serviceName : item[0].binaryAnnotations[0].endpoint.serviceName, //服务名字
        'method': item.length > 1 ? item[1].name : item[0].name,
        'spanCount': item.length, //跨度
        'duration': maxDuration / 1000,
        'servicePercent': this.arry.length > 0 ? this.arry[0] : '100%',
        'timestampFormat': this.startTimeFormcat(startTime),
        'deepth': changeChildren.deepth,
        'children': newChilredList,
        "hierarchy": 0,
        "durations": durations,
        "timestamp": startTime,
        "traceId": item[0].traceId
      };

      newData.push(listItem);
    }
    return newData;

  }
  /**
 * 获取 请求开始时间，时间转换
 *@return 时间 格式："2017-6-12 11:04:49"
 */
  public startTimeFormcat(ns: any) {
    return this.commonService.formatDate(new Date(parseInt(ns) / 1000)).formatTime;
  }

  /**
* 封装自节点
* @param parentObj 父节点
* @param arr 被遍历的数组
* @param index 被递归的次数
* @param indexArr 递归次数的数组
* @return
* children:封装好的子节点
* deepth：深度
*/
  public getchildData(parentObj, arr, index, indexArr, childrenList) {
    var obj = new Object();
    obj = parentObj;
    index++;
    indexArr.push(index);
    for (var i = 0; i < arr.length; i++) {
      if (parentObj.id == arr[i].parentId) {
        arr[i].hierarchy = parentObj.hierarchy + 1;
        obj['children'].push(arr[i]);
        arr[i].children = [];
        childrenList.push(arr[i]);
        this.getchildData(arr[i], arr, index, indexArr, childrenList);
      }
    }
    var deepth = Math.max.apply(null, indexArr);
    return {
      'children': obj['children'],
      'deepth': deepth,
      "childrenList": childrenList
    };
  };
  /**
   * 展开事件
   * @param event
   */
  onRowExpand(event: any) {
    if (event.originalEvent.srcElement) {
      var originalEvent = event.originalEvent.srcElement.parentElement.parentElement.parentElement.style.backgroundColor = '#ddf1ea';
      //火狐没有srcElement属性 所以做target兼容
      event.originalEvent.srcElement ? originalEvent : '';
    };
    if (event.originalEvent.target) {
      var targetEvent = event.originalEvent.target.parentElement.parentElement.parentElement.style.backgroundColor = '#ddf1ea';
      event.originalEvent.target ? targetEvent : '';

    };

  };
  /**
   * 收缩事件
   * @param event
   */
  onRowCollapse(event) {

    if (event.originalEvent.srcElement) {
      var originalEvent = event.originalEvent.srcElement.parentElement.parentElement.parentElement.style.backgroundColor = '#fff';
      //火狐没有srcElement属性 所以做target兼容
      event.originalEvent.srcElement ? originalEvent : '';
    };
    if (event.originalEvent.target) {
      var targetEvent = event.originalEvent.target.parentElement.parentElement.parentElement.style.backgroundColor = '#fff';
      event.originalEvent.target ? targetEvent : '';

    };

  };
  ngAfterViewInit() {

  };

}
