import { DataStrategyService } from './../shared/data-strategy.service';
import { AppAdminService } from './../../shared/app-admin.service';
import { CommonService } from './../../../../core/common-service/common.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';

declare var $: any; // 引用juery
@Component({
  selector: 'drag-priority-strategy',
  templateUrl: './drag-priority-strategy.component.html',
  styleUrls: ['./drag-priority-strategy.component.scss']
})
export class DragPriorityStrategyComponent implements OnInit {
  // 设置优先级的变量 
  public cancelBtnIsShow: any = false; // 控制 取消设置按钮的显隐,默认隐藏
  public fontConirmIsShow: any = true; // 控制 暂未设置优先级字体的显隐，默认显示
  // public ruleList: any = [{ text: '哈勒第1', id: 'hhh' }, { text: '哈勒第2', id: 'aaa' }, { text: '哈勒第3', id: 'bbb' }, { text: '哈勒第4', id: 'ccc' }, { text: '哈勒第5', id: 'ddd' }, { text: '哈勒第6', id: 'sss' }]; // 
  public dragobj: any = {}; // 存储移动中计算需要的值
  public appInfo = JSON.parse(window.localStorage['appObj']);
  public isPriority: boolean = true;  // 是否设置过优先级,默认是已设置过
  public isGlobal: boolean = true; // 是否是全局的 资源
  @Input() priorityList: any; // 优先级策略列表
  @Input() dataresourceId: any; // 资源id
  @Input() button: any; 
  constructor(public commonService: CommonService, public dataStrategyService: DataStrategyService) { }
  ngOnChanges() {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if ((typeof this.dataresourceId == 'string' && this.dataresourceId.length == 0) || !this.dataresourceId) {
      // 不存在dataresourceId,即需要查询全局
      this.isGlobal = true;
    } else {
      this.isGlobal = false;
    }
    // 判断当前按钮出现的条件
    if (this.priorityList && this.priorityList[0] && this.priorityList[0].priority != 0) {
      this.isPriority = true;
      // 已经设置过优先级，设置优先级和取消设置按钮出现
      this.cancelBtnIsShow = false;
      this.fontConirmIsShow = false;
    } else if ((this.priorityList && this.priorityList[0] && this.priorityList[0].priority == 0) || this.priorityList && this.priorityList.length == 0) {
      // 没有设置过优先级
      this.isPriority = false;
      this.cancelBtnIsShow = false;
      this.fontConirmIsShow = true;
      this.getRuleList();
    }
  }

  ngOnInit() {
    let that = this;
    window.onerror = function () {
      return false
    }
    // 给document添加鼠标移动事件
    document.onmousemove = function (e: any) {
      e = e || event;
      if (that.dragobj.o != null) {
        // 拖动的对象 的 left和top根据  鼠标的坐标位置-拖动对象的坐标位置-拖动对象的相对父元素的坐标位置
        that.dragobj.o.style.left = (e.x - that.dragobj.xx[0] - that.dragobj['offsetParent-xy'][1]) + "px";
        that.dragobj.o.style.top = (e.y - that.dragobj.xx[1] - that.dragobj['offsetParent-xy'][0]) + "px";
        // 传递鼠标移动的事件对象和拖动对象
        that.createtmpl(e, that.dragobj.o) //传递当前拖动对象  
      }
    }
    // 鼠标松开的触发函数
    document.onmouseup = function () {
      if (that.dragobj.o != null) {
        that.dragobj.o.style.width = "auto";
        that.dragobj.o.style.height = "auto";
        that.dragobj.otemp.parentNode.insertBefore(that.dragobj.o, that.dragobj.otemp);
        that.dragobj.o.style.position = "";
        that.dragobj.o.style = '';
        that.oDel(that.dragobj.otemp);
        that.dragobj = {};
      }
    }

  }


  /**
   * 点击 设置优先级 、保存  
   * 点击设置优先级按钮之后，取消设置按钮、优先级的顺序提示线出现。暂未设置优先级的字体消失
   * 点击保存之后，设置优先级按钮、取消设置、优先级顺序提示线 出现
   * @param {string} type 按钮的类别，可传可不传，值为 save或者不传
   * @memberof RuleStrategyComponent
   */
  setPriority(type?: string) {
    // 如果type有值，为保存按钮，type为 undefined,为设置优先级按钮
    // 取消 保存 按钮出现 
    this.cancelBtnIsShow = type ? false : true;
    // 暂未设置优先级提示字体消失
    this.fontConirmIsShow = false;
    if (type == 'save') {
      let newLevelArr = this.getPriorityOrder();
      this.saveNewLevel(newLevelArr);
    }

  }

  /**
   * 点击 取消设置  按钮
   * 点击之后，删除之前已经设置的优先级，暂未设置优先级的字体出现，设置优先级按钮出现
   * @memberof RuleStrategyComponent
   */
  cancelSetPriority() {
    // 暂未设置优先级提示字体出现
    this.fontConirmIsShow = true;

    let params = {
      dataresourceId: this.dataresourceId,
      appId: this.appInfo.appId,
    };
    let __this = this;
    this.dataStrategyService.canclePriority(params, __this, (res) => {
      if (res.success && res.success == 1) {
        // 获取 数据规则列表
        this.getRuleList();
        __this.commonService.growl(__this, 'success', '优先级设置取消成功');
      }
    })
  }

  /**
   * 获取优先级策略  列表
   * 
   * @memberof DragPriorityStrategyComponent
   */
  public getPriorityList() {
    let params = {
      appId: this.appInfo.appId,
    };
    if (!this.isGlobal) {
      // 特定资源下
      params['dataresourceId'] = this.dataresourceId;
    }
    if (typeof this.dataresourceId == 'string' && this.dataresourceId.length > 0) {
      // 特定资源下的优先级策略列表;
      params['dataresourceId'];
    }
    let __this = this;
    this.dataStrategyService.getPriority(params, __this, (res) => {
      if (res && res.success == 1) {
        this.priorityList = res.rows;
        if (this.priorityList.length == 0) {
          // 暂未设置优先级
          this.fontConirmIsShow = true;
          this.getRuleList();


        }
      }
    })
  }
  /**
   * 获取 规则  列表
   * 
   * @memberof DragPriorityStrategyComponent
   */
  public getRuleList() {
    let params = {
      appId: this.appInfo.appId,
    };
    // if (!this.isGlobal) {
    //   // 特定资源下
    //   params['dataresourceId'] = this.dataresourceId;
    // } else {
    //   params['isGlobal'] = this.isGlobal;
    // }
    params['isGlobal'] = this.isGlobal;
    params['dataresourceId'] = this.dataresourceId;
    let __this = this;
    this.dataStrategyService.getRuleListData(params, __this, (res) => {
      if (res && res.success == 1) {
        this.priorityList = res.rows;
      }
    })
  }

  /**
   * 取消 
   * 点击取消之后， 设置优先级和取消设置的按钮出现, 保存和取消按钮消失
   * @memberof RuleStrategyComponent
   */
  cancelSavePriority() {
    // 取消设置按钮出现 
    this.cancelBtnIsShow = false;
    // if (this.isPriority) {
    // 设置过优先级,获取优先级策略列表
    this.getPriorityList();
    // } else {
    //   // 获取 数据规则列表
    //   this.getRuleList();
    // }

  }

  /**
   * 获取新的优先级顺序
   * 
   * @returns newOrder 新的优先级顺序
   * @memberof DragPriorityStrategyComponent
   */
  getPriorityOrder() {
    let liArr = $('.ul-set').children();
    let newOrder = [];
    let appInfo = JSON.parse(window.localStorage['appObj']);
    let dataresourceId = this.dataresourceId;
    for (let i = 0; i < liArr.length; i++) {
      let item = liArr[i];
      let index = item.id.slice(1, 2);
      let paramsObj = {
        ruleId: this.priorityList[index].ruleId,
        priority: i + 1,
        appId: appInfo.appId,
      };
      if (dataresourceId) {
        paramsObj['dataresourceId'] = dataresourceId
      }
      newOrder.push(paramsObj);
    }
    return newOrder;
  }

  /**
   * 保存 优先级设置
   * 
   * @param
   * @memberof DragPriorityStrategyComponent
   */
  saveNewLevel(param) {
    let params = param;
    let __this = this;
    this.dataStrategyService.savePriority(params, __this, (res) => {
      if (res.success && res.success == 1) {

        __this.commonService.growl(__this, 'success', '优先级设置成功');
      }
    })
  }




  /**
   * 移除 拖动时添加的预览效果
   * 
   * @param {any} obj 需要删除的元素
   * @memberof DragPriorityStrategyComponent
   */
  public oDel(obj) {
    if (obj) {
      obj.parentNode.removeChild(obj);
    }
  }
  /**
   * 鼠标按下  
   * 
   * 得到当前鼠标的坐标位置，拖拽元素相对父元素的坐标位置，
   * @param {any} e 
   * @param {any} index 
   * @returns 
   * @memberof DragPriorityStrategyComponent
   */
  public mouseDown(e, index) {
    let that = this;
    if (that.dragobj.o != null)
      return false
    e = e || event;
    let eledom = e.srcElement ? e.srcElement : e.target;
    if (eledom.className != 'move-nr') {
      that.dragobj.o = document.getElementsByClassName('move-nr')[index].parentNode;
    } else {
      that.dragobj.o = eledom.parentNode;
    }
    // 有定位的父级元素的 top。left、width、height (ul)
    that.dragobj['offsetParent-xy'] = that.getxy(that.dragobj.o.offsetParent);
    // 元素本身的 top。left、width、height 
    that.dragobj['xy'] = that.getxy(that.dragobj.o);
    // 获取鼠标在元素中的位置 x轴和y轴 left top
    that.dragobj['xx'] = new Array((e.x - this.dragobj.xy[1]), (e.y - that.dragobj['xy'][0]));
    // 改变移动元素的width、height、left、top等样式
    that.dragobj.o.style.width = that.dragobj.xy[2] + "px";
    that.dragobj.o.style.height = that.dragobj.xy[3] + "px";
    that.dragobj.o.style.left = (e.x - that.dragobj.xx[0] - that.dragobj['offsetParent-xy'][1]) + "px";
    that.dragobj.o.style.top = (e.y - that.dragobj.xx[1] - that.dragobj['offsetParent-xy'][0]) + "px";
    that.dragobj.o.style.position = "absolute";
    // 新增一个占位的元素
    var om = document.createElement("div");
    that.dragobj.otemp = om;
    om.style.width = that.dragobj.xy[2] + "px";
    om.style.height = that.dragobj.xy[3] + "px";
    om.style.marginBottom = 5 + "px";
    om.style.backgroundColor = "rgba(0,0,0,.4)"; //效果添加 背景色
    that.dragobj.o.parentNode.insertBefore(om, that.dragobj.o);
    return false
  }


  /**
   * 将当前拖动层在拖动时可变化大小，预览效果  
   * 
   * @param {any} e 鼠标移动的事件对象
   * @param {any} elm 当前拖动的元素
   * @memberof DragPriorityStrategyComponent
   */
  public createtmpl(e, elm) {
    for (var i = 0; i < this.priorityList.length; i++) {
      if (document.getElementById("m" + i) == null) //已经移出的层不再遍历  
        continue;
      if ($("#m" + i)[0] == this.dragobj.o)
        continue;
      var b = this.inner($("#m" + i)[0], e);
      if (b == 0)
        continue;
      this.dragobj.otemp.style.width = $("#m" + i)[0].offsetWidth;
      elm.style.width = $("#m" + i)[0].offsetWidth;
      //1为下移，2为上移  
      if (b == 1) {
        $("#m" + i)[0].parentNode.insertBefore(this.dragobj.otemp, $("#m" + i)[0]);
      } else {
        if ($("#m" + i)[0].nextSibling == null) {
          $("#m" + i)[0].parentNode.appendChild(this.dragobj.otemp);
        } else {
          $("#m" + i)[0].parentNode.insertBefore(this.dragobj.otemp, $("#m" + i)[0].nextSibling);
        }
      }
      return
    }
  }

  /**
   * 计算鼠标移动时与每个元素的位置，判断是下移还是上移
   * 
   * @param {any} o 拖动的元素
   * @param {any} e 鼠标移动时的事件对象
   * @returns 返回值0，1（下移），2（上移），
   * @memberof DragPriorityStrategyComponent
   */
  public inner(o, e) {
    var a = this.getxy(o);
    if (e.y > a[0] && e.y < (a[0] + a[3])) {
      if (e.y < (a[0] + a[3] / 2))
        return 1;
      else
        return 2;
    } else
      return 0;
  }
  /**
   * 计算对象的 left、top、width、height
   * 
   * @param {any} e dom元素
   * @returns 数组【top,left,width,height】
   * @memberof DragPriorityStrategyComponent
   */
  public getxy(e) {
    var a = new Array();
    var t = e.offsetTop;
    var l = e.offsetLeft;
    var w = e.offsetWidth;
    var h = e.offsetHeight;
    while (e = e.offsetParent) {
      t += e.offsetTop;
      l += e.offsetLeft;
    }
    a[0] = t;
    a[1] = l;
    a[2] = w;
    a[3] = h
    return a;
  }

}
