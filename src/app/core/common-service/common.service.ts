/**
 * 公共的方法
 *
 * 改变primeNg的treeTable
 * 改变树的数据结构 primeng tree
 * 改变菜单的路由，在url后面添加变量
 * 移除编辑节点的子节点 removeChidNode
 * 提示信息  growl
 */

import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';

@Injectable()
export class CommonService {

  constructor(public confirmationService: ConfirmationService, public route: Router) {
  }

	/**
	 * 改变数据结构 primgNg treeTable
     * @param array 数组
	 */
  changeData(array: any) {
    for (var i = 0; i < array.length; i++) {
      var item = array[i];
      var name = item['text'];
      var id = item['id'];
      var children = item['children'];
      var attr = item['attributes'];

      if (children) {
        var datas = {
          'data': {
            name: name,
            id: id,
            managerName: attr.managerName,
            creatUserName: attr.creatUserName,
            creatTime: attr.creatTime,
            hierarchy: attr.hierarchy

          },
          'attributes': attr,
          'children': children,
          'expanded': true,
        }
        array[i] = datas;
        if (children.length >= 1) {
          this.changeData(children);
        }
      }
    }
  }
  /**
   * 改变树的数据结构 primeng tree
   * @param arr 数组
   */
  changeTree(arr: any) {
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var label = item['text'];
      var id = item['id'];
      var children = item['children'];
      var attr = item['attributes'];
      if (children) {
        var datas = {
          'label': label,
          'id': id,
          'children': children,
          'attributes': attr,
          'expanded': true
        }
        arr[i] = datas;
        if (children.length >= 1) {
          this.changeTree(children);
        }
      }
    }
  }
  /**
   * 改变菜单的路由，在url后面添加变量
   * @param arr 菜单数组
   */
  public changeMenuRoute(arr: any) {
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      let children = item.children;
      let variable = eval(item.attributes.handler);
      console.log(variable)
      item.attributes.route = item.attributes.url + "/";
      if (children.length >= 1) {
        this.changeMenuRoute(children);
      }
    }
  }

  /**
   * 移除编辑节点的子节点
   * 编辑弹窗 tree
   * @param arr 获取到的后台数据
   * @param id 选中节点的id
   */
  removeChidNode(arr, id) {
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      if (item.id == id) {
        arr.splice(i, 1);
      }
      if (item.children.length > 0) {
        this.removeChidNode(item.children, id);
      }
    }

  }


  /**
   * 数组去重
   *
   * @param {any} arr
   * @param {string} [name] 需要去重的项
   * @returns  去重的数组
   * @memberof CommonService
   */
  public arrUnique(arr, name?: string) {
    let res = [];
    let json = {};
    for (var i = 0; i < arr.length; i++) {
      if (name) {
        if (!json[arr[i][name]] && arr[i][name]) {
          res.push(arr[i]);
          json[arr[i][name]] = 1;
        }
      } else {
        if (!json[arr[i]] && arr[i]) {
          res.push(arr[i]);
          json[arr[i]] = 1;
        }
      }
    }
    return res;
  }


  /**
   * 获取按钮
   * @param arr 按钮的数组数据
   * 以对象的形式返回数据:{platRoleAddBtn:1,platRoleEditBtn:1}
   */
  public viewBtn(arr: Array<any>) {
    let button = {};
    for (let item of arr) {
      let name = item.attributes.viewFuncCode;
      button[name] = '1';
    }
    return button;
  }

  /**
  * 获取返回数据的默认选中id值
  * @param nodes 树的数据
  * 返回值 数组
  */
  getDefultCheckId(nodes: any) {
    let newRoleTree = this.parentCheckNode(nodes);
    let checkedList = this.checkedNode(newRoleTree, []);
    let checkListId = [];
    for (let item of checkedList) {
      checkListId.push(item.id);
    }
    return checkListId;
  }



	/**
	 * 获取checked为true的数据
	 * @param arr tree数组
     * @param isComponent 组件调用
	 */

  public defaultId: any = [];
  public checkedNode(arr: Array<any>, defaultId: Array<any>) {
    for (let item of arr) {
      if (item.checked) {
        defaultId.push(item);
      }
      if (item.children.length > 0) {

        this.checkedNode(item.children, defaultId);
      }
    }
    return defaultId;
  }
  /**
   * 使父节点选中
   * @param arr Tree数组数据
   */
  public parentCheckNode(arr: Array<any>) {
    let newArr = arr;
    let checkedArr = this.checkedNode(newArr, []);
    for (let item of newArr) {
      let reg = new RegExp("^" + item.attributes.hierarchy);
      for (let check of checkedArr) {

        let str = check.attributes.hierarchy;
        if (reg.test(str)) {
          item.checked = true;
        }
      }
      if (item.children.length > 0) {
        this.parentCheckNode(item.children);
      }

    }
    return newArr;
  }

  /**
   * 当用户重新选择后
   * 获取当前被选中的节点id值
   */

  public getCheckedNodeIds() {
    var checkNodeList = '';
    //当前被选中的节点
    let node = this.checkedNodeData;

    for (let item of node.treeModel.roots) { //遍历根节点
      let rootNode = item; //根节点
      console.log(rootNode);
      let rootId = rootNode.data.id; //根节点id值
      if (rootNode.data.checked) {
        checkNodeList = checkNodeList + ',' + rootId;
      }
      let list = this.getChildrenActivedNode(rootNode.data.children, []);
      checkNodeList = checkNodeList + ',' + list.join(',');
    }

    return checkNodeList.split(',');
  }
  /**
   * 遍历根节点的子节点 获取所有的被选中的节点id值
   * @param arr :Array<any> 根节点的children
   * @param activedList :Array<any> 选中的节点id值返回值
   */
  public getChildrenActivedNode(arr: Array<any>, activedList: Array<any>) {

    for (let item of arr) { //遍历children
      if (item.checked) {
        activedList.push(item.id);
      }
      if (item.children.length > 0) {
        this.getChildrenActivedNode(item.children, activedList);
      }
    }
    return activedList;
  }


  /**
   *  tree的事件触发
   *
  */
  public checkedNodeData: any;//当前被选中的节点
  public check(node, $event) {
    this.checkedNodeData = node;

    this.updateChildNodesCheckBox(node, $event.target.checked);
    this.updateParentNodesCheckBox(node.parent);
  }
  public updateChildNodesCheckBox(node, checked) {
    node.data.checked = checked;
    if (node.children) {
      node.children.forEach((child) => this.updateChildNodesCheckBox(child, checked));
    }
  }
  public updateParentNodesCheckBox(node) {

    if (node && node.level > 0 && node.children) {
      let allChildChecked = true;
      let noChildChecked = true;

      for (let child of node.children) {
        if (!child.data.checked) {
          allChildChecked = false;
        } else if (child.data.checked) {
          noChildChecked = false;
        }
      }

      if (allChildChecked) {
        node.data.checked = true;
        node.data.indeterminate = false;
      } else if (noChildChecked) {
        node.data.checked = false;
        node.data.indeterminate = false;
      } else {
        node.data.checked = true;
        node.data.indeterminate = true;
      }
      this.updateParentNodesCheckBox(node.parent);
    }
  }


  /**
    * 登录超时
    */

  public loginTimeOut() {
    this.confirmationService.confirm({
      message: '登录超时，请重新登录',
      accept: () => {
        this.route.navigate(['./login']);
        window.localStorage.clear();
      },
      reject: () => {
        this.route.navigate(['./login']);
        window.localStorage.clear();
      }

    })
  }

  /**
   * 提示信息
   * @param that 调用方法的组件 this指向
   * @param rel 结果
   * @param msg 显示信息
   * @param multiple 多个信息显示
   */
  public msgs: any;
  public growl(that: any, rel: any, msg: any, multiple?: any) {
    that.msgs = [];
    if (multiple) {
      for (let item of multiple) {
        that.msgs.push(item);
      }
      return;
    }
    that.msgs.push({ severity: rel, summary: '', detail: msg })
  }




  /**
   * 转换中国标准时间
   * @param date 格式：中国标准时间，yyyy-mm-dd,yyyy/mm/dd,毫秒数
   * @return dates.times：当前时间的毫秒数
   * @return dates.formcatDate：当前时间的新格式 yyyy-mm-dd
   * @return dates.formatTime yyyy-mm-dd hh-mm
   */
  public formatDate(date) {
    if (typeof (date) == 'string' && date.indexOf('-') != -1) {
      var newDate = date.replace(/-/g, '/');
    } else {
      newDate = date;
    }
    var dateObj = new Date(newDate);
    var year = dateObj.getFullYear();
    var month: any = dateObj.getMonth() + 1;
    var day: any = dateObj.getDate();
    var hours = dateObj.getHours();
    var mins: any = dateObj.getMinutes();
    var second: any = dateObj.getSeconds() ? dateObj.getSeconds() : '';
    if (month < 10) { month = '0' + month; }
    if (day < 10) { day = '0' + day; }
    if (mins < 10) { mins = '0' + mins; }
    if (second < 10) { second = '0' + second; }
    if (second == 0) { second = '00'; }
    let time = year + "-" + month + "-" + day + ' ' + hours + ':' + mins + ':' + second;
    let timeIE = year + "/" + month + "/" + day + ' ' + hours + ':' + mins + ':' + second;
    let times = new Date(time).getTime() ? new Date(time).getTime() : new Date(timeIE).getTime(); //得到毫秒数
    let dates = {
      times: times, //毫秒数
      formcatDate: year + "-" + month + "-" + day,
      formatTime: year + "-" + month + "-" + day + ' ' + hours + ':' + mins + ':' + second,
      date: dateObj,
      monthDay: month + "-" + day,
    }
    // return  + " " + hours + ":" + mins + ":" + second;
    return dates;
  }

  /**
   * 阻止事件冒泡
   * @param e  事件对象
   */
  public stopBubble(e) {
    // 如果提供了事件对象，则这是一个非IE浏览器
    if (e && e.stopPropagation) {
      // 因此它支持W3C的stopPropagation()方法
      e.stopPropagation();
    } else {
      // 否则，我们需要使用IE的方式来取消事件冒泡
      window.event.cancelBubble = true;
    }
  }
  /**
   * 兼容addEventListener
   * @param elm dom元素
   * @param evType 事件类型
   * @param fn 执行函数
   * @param useCapture 使用捕获 boolean
   */
  public addEvent(elm, evType, fn, useCapture) {
    if (elm.addEventListener) {
      elm.addEventListener(evType, fn, useCapture);//DOM2.0
      return true;
    }
    else if (elm.attachEvent) {
      var r = elm.attachEvent('on' + evType, fn);//IE5+
      return r;
    }
    else {
      elm['on' + evType] = fn;//DOM 0
    }
  }

  /**
   * 获取 数组中的最大值
   *
   * @param {any} arr
   * @returns
   * @memberof CommonService
   */
  public arrMaxNum(arr) {
    var maxNum = -Infinity;
    for (var i = 0; i < arr.length; i++) {
      arr[i] > maxNum ? maxNum = arr[i] : null;
    };
    return maxNum;
  }
  /**
    * 获取 数组中的最小值
    *
    * @param {any} arr
    * @returns
    * @memberof CommonService
    */
  public arrMinNum(arr) {
    var minNum = Infinity;
    for (var i = 0; i < arr.length; i++) {
      arr[i] < minNum ? minNum = arr[i] : null;
    };
    return minNum;
  }
  /**
    * 获取 数组中的平均值
    *
    * @param {any} arr
    * @returns
    * @memberof CommonService
    */
  public arrAverageNum(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
      sum += arr[i];
    };

    // console.log(sum);
    // console.log(arr.length)
    return sum / arr.length;
  }
  /**
   * 计算累加
   * @param arr
   */
  public arrCountNum(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
      sum += arr[i];
    };
    return sum;
  }
  /**
   * 获取相隔的月份
   *
   * @param {any} start 格式：yyyy-mm-dd
   * @param {any} end 格式：yyyy-mm-dd
   * @returns
   * @memberof CommonService
   */
  public getMonthBetween(start, end) {
    var result = [];
    var s = start.split("-");
    var e = end.split("-");
    var min = new Date();
    var max = new Date();
    min.setFullYear(s[0], s[1]);
    max.setFullYear(e[0], e[1]);

    var curr = min;
    while (curr <= max) {
      var month = curr.getMonth();
      result.push(curr.getFullYear() + "-" + (month < 10 ? ("0" + month) : month));
      curr.setMonth(month + 1);
    }
    return result;
  }


  /**
   * 改变企业的 认证状态及应用使用类型、测试类型、企业规模的值
   *
   * @param {any} name 参数值为：认证状态、企业类型、应用使用类型、企业规模
   * @param {any} value 对应的值例如：1或者未认证
   * @return value:改变后的值
   */
  changeEnpAttrValue(name?: any, value?: any) {
    if (value.length == 1) {
      // 传入的数字
      if (name == '认证状态') {
        switch (value) {
          case '-1':
            value = '认证驳回';
            break;
          case '0':
            value = '未认证';
            break;
          case '1':
            value = '认证通过';
            break;
          case '2':
            value = '待审核';
            break;
          default:
            value = 'null';
        }
      } else if (name == '企业类型') {
        switch (value) {
          case '0':
            value = '测试企业';
            break;
          case '1':
            value = '正式企业';
            break;
          default:
            value = 'null';
        }
      } else if (name == '应用使用类型') {
        switch (value) {
          case '0':
            value = '试用';
            break;
          case '1':
            value = '协议';
            break;
          default:
            value = 'null';
        }
      } else if (name == '企业规模') {
        switch (value) {
          case '1':
            value = '50人以下';
            break;
          case '2':
            value = '50-100人';
            break;
          case '3':
            value = '100-200人';
            break;
          case '4':
            value = '200-500人';
            break;
          case '5':
            value = '500人以上';
            break;
          default:
            value = 'null';
        }
      }
    } else if (value.length > 1) {
      // 传入的是汉字
      if (name == '认证状态') {
        switch (value) {
          case '认证驳回':
            value = '-1';
            break;
          case '未认证':
            value = '0';
            break;
          case '认证通过':
            value = '1';
            break;
          case '待审核':
            value = '2';
            break;
          default:
            value = 'null';
        }
      } else if (name == '企业类型') {
        switch (value) {
          case '测试':
            value = '0';
            break;
          case '正式':
            value = '1';
            break;
          default:
            value = 'null';
        }
      } else if (name == '应用使用类型') {
        switch (value) {
          case '试用':
            value = '0';
            break;
          case '协议':
            value = '1';
            break;
          default:
            value = 'null';
        }
      } else if (name == '企业规模') {
        switch (value) {
          case '50人以下':
            value = '1';
            break;
          case '50-100人':
            value = '2';
            break;
          case '100-200人':
            value = '3';
            break;
          case '200-500人':
            value = '4';
            break;
          case '500人以上':
            value = '5';
            break;
          default:
            value = 'null';
        }
      }
    }
    return value;
  }



}
