import { IOTDataShowService } from './shared/IOT-data-show.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from './../../../core/common-service/common.service';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ITreeOptions, IActionMapping } from 'angular-tree-component';

declare var $: any;

@Component({
  selector: 'IOT-data-show',
  templateUrl: './IOT-data-show.component.html',
  styleUrls: ['./IOT-data-show.component.scss']
})
export class IOTDataShowComponent implements OnInit {
  private treeValue: any;   // tree的数据
  private routeParams: any;  // 路由参数
  private url: any;  // 当前路由
  private selectedAttribute: any;  // 选中属性
  public routeStatesRealData: any; // 实时数据的路由激活状态
  public routeStatesHistoryData: any; // 历史数据的路由激活状态
  constructor(
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private IOTDataShowService: IOTDataShowService
  ) {
  }

  ngOnInit() {
    // 初始化数据源选中节点
    this.getAllSource();
    // 判断路由的激活状态
    this.routeStatesRealData = this.router.url.indexOf('real-time');
    this.routeStatesHistoryData = this.router.url.indexOf('history');
  }

  /**
   * 获取设备名称
   * 
   * @memberof IOTDataShowComponent
   */
  getAllSource() {
    let _that = this;
    this.IOTDataShowService.getTreeIOT(_that, {}, (res) => {
      if (res && res.success == 1) {
        let sourceParams;
        _that.treeValue = res.rows.length == 0 ? [] : _that.changeSourceData(res.rows);
        if (_that.treeValue.length > 0 && _that.treeValue[0].children.length > 0) {
          _that.treeValue[0].isExpanded = true;
          _that.treeValue[0].children[0].isExpanded = true;
          _that.treeValue[0].children[0].children[0].checked = true;
          _that.treeValue[0].children[0].children[0].disabled = false;
          sourceParams = {
            deviceName: _that.treeValue[0].children[0].text,
            attribute: _that.treeValue[0].children[0].children[0].id
          }
        } else {
          sourceParams = {};
        }
        _that.mergeRouteParams(sourceParams);
      }
    })
  }


  /**
   * 修改数据结构
   * 
   * @param {Array<any>} arr 后台返回数据
   * @returns 修改过的 tree结构数据
   * @memberof IOTDataShowComponent
   */
  changeSourceData(arr: Array<any>) {
    let i; let j;
    let treeNodeArr = [];
    for (i = 0; i < arr.length; i++) {
      let rootTree = {};
      let item = arr[i];
      rootTree['text'] = item.name;
      rootTree['isExpanded'] = false;
      rootTree['id'] = item.name;
      rootTree['root'] = true;
      rootTree['children'] = [];
      for (let m = 0; m < item.datas.length; m++) {
        let treeValue = {};
        let childItem = item.datas[m];
        treeValue['text'] = childItem.name;
        treeValue['isExpanded'] = false;
        treeValue['id'] = childItem.name;
        treeValue['root'] = true;
        treeValue['children'] = [];
        for (j = 0; j < childItem.datas.length; j++) {
          let lastItem = childItem.datas[j];
          let childrenValue = {
            'text': lastItem.name.slice(lastItem.name.indexOf('.') + 1, lastItem.name.length),
            'id': lastItem.id,
            'checked': false,
            'disabled': true,
            'children': []
          }
          treeValue['children'].push(childrenValue);
        }
        rootTree['children'].push(treeValue);
      }
      treeNodeArr.push(rootTree);
    }
    // 设置默认的第一个选中，且第一个节点的可用
    return treeNodeArr;
  }



  /**
   * 合并路由参数
   * 
   * @memberof IOTDataShowComponent
   */
  mergeRouteParams(sourceParams) {
    let sourceRouteParams = this.route.params['value'].id ? this.route.params['value'] : this.route.queryParams['value'];
    this.url = this.router.url.slice(0, this.router.url.indexOf('?'));
    let routeParams = {};
    // 如果之后的路由有设备名称，即 用户重新操作数据源
    if (sourceRouteParams.deviceName) {
      for (let key in sourceRouteParams) {
        routeParams[key] = sourceRouteParams[key];
      }

      delete routeParams['deviceName'];
      delete routeParams['attribute'];
    }
    this.routeParams = $.extend({}, sourceParams, sourceRouteParams['deviceName'] ? routeParams : sourceRouteParams);
    this.router.navigate([this.url], { queryParams: this.routeParams });
  }

  /**
   * 选中节点
   * 
   * @param {any} node 选中节点信息
   * @param {any} $event 当前事件对象
   * @memberof IOTDataShowComponent
   */
  public checkedNode(node, $event) {
    node.data.checked = $event.target.checked;
    this.inputDisabled(node, $event.target.checked);
    let sourceParams;
    if (node.data.checked) {
      sourceParams = {
        deviceName: node.parent.data.text,
        attribute: node.data.id,
      }
    } else {
      sourceParams = {
        deviceName: node.parent.data.text,
        attribute: '',
      }
    }
    this.mergeRouteParams(sourceParams);


  }


  // tree 配置项
  treeOptions: ITreeOptions = {
    displayField: 'text',
  };


  /**
   * 禁用tree的复选框  属性的复选框
   * 
   * @private
   * @param {any} node 被选中的属性节点
   * @memberof IOTDataShowComponent
   */
  private inputDisabled(node, checked) {
    let i; let j; let m;
    for (i = 0; i < this.treeValue.length; i++) {
      let item = this.treeValue[i];
      for (j = 0; j < item.children.length; j++) {
        let childItem = item.children[j];
        for (m = 0; m < childItem.children.length; m++) {
          let lastItem = childItem.children[m]; 
          if (checked) {
            // 选中
            lastItem.disabled = node.id == lastItem.id ? false : true;
          } else {
            lastItem.disabled = false;
          }
        }
      }
    }
  }

  /**
   * 跳转实时数据
   * 
   * @memberof IOTDataShowComponent
   */
  routelinkRealData() {
    this.routeStatesRealData = 1;
    this.routeStatesHistoryData = -1;
    var urls = this.router.url.slice(0, this.router.url.indexOf('data-show')) + 'data-show/real-time';
    this.router.navigate([urls], { queryParams: this.routeParams })
  }
  /**
  * 跳转历史数据
  * 
  * @memberof IOTDataShowComponent
  */
  routelinkHistoryData() {
    this.routeStatesRealData = -1;
    this.routeStatesHistoryData = 1;
    var urls = this.router.url.slice(0, this.router.url.indexOf('data-show')) + 'data-show/history';
    this.router.navigate([urls], { queryParams: this.routeParams })
  }

}
