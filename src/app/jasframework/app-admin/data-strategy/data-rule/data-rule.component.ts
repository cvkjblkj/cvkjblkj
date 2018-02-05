import { AppAdminService } from './../../shared/app-admin.service';
import { DataStrategyService } from './../shared/data-strategy.service';
import { ConfirmationService } from 'primeng/primeng';
import { CommonService } from './../../../../core/common-service/common.service';
import { CommonRequestService } from './../../../../core/common-service/common-request.service';
import { Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'data-rule',
  templateUrl: './data-rule.component.html',
  styleUrls: ['./data-rule.component.scss']
})
export class DataRuleComponent implements OnInit {
  public appInfo: any = JSON.parse(window.localStorage['appObj']); // 应用的信息（应用名称、应用code、应用id）
  // 弹窗   需要的变量
  public ruleFormData: any = {}; // 规则的表单数据
  public modalName: any; // 弹窗名字
  public resourceData: any; // 资源的 数据
  public selectedDropDownFile: any; // 所属资源的下拉框 选中项数据
  public errorMsg: any; // 错误信息的提示
  public dropDownTree: any; // 资源树的数据
  // 搜索   需要的变量
  public searchValue: any; // 搜索内容
  public selectName: any; // 下拉框选中的名字
  searchNodeValue: any; // 弹窗中搜索框的值
  // 列表   需要的变量
  public dataRuleListData: any;  // 资源的列表数据
  public emptyMessage = '未查到相关数据';
  public selectedDataRule: any; // 选中的节点数据
  public parentNodeObj: any = {};  // 父节点的id集合
  // primeng 插件 growl 的 提示参数
  public growlMsgs: any; // 成功提示信息
  // 按钮权限控制
  public button: any = {};
  // 删除提示
  dialogDisplay: boolean = false;
  public isRelieve: any = false; // 是否删除关联的数据标识,默认为false
  public ruleName: any; // 被删除的规则的名称
  // 成功提示
  public successMsg: any = []; // confirm 组件的提示信息
  public menuId: any; // 菜单的id
  @ViewChild('Modal') modal: any; // 添加和修改 弹窗
  @ViewChild('viewModal') viewModal: any; // 弹窗
  @ViewChild('modalForm') modalForm: any; // 添加和修改资源的form表单
  @ViewChild('childModal') childModal: any; // 弹窗


  // 分页参数
  public rowsPerPageOptions = ['10', '20', '30'];
  public pageSize: string = '10'; //页容量
  public pageNum: any = 1; //页码
  public maxSize: number = 5;
  public totalPages: any;  //总页数
  public size: any; // 当前页容量
  private totalItems: any; //总数据条数

  constructor(public dataStrategyService: DataStrategyService,
    public commonService: CommonService,
    private confirmationService: ConfirmationService,
    public appAdminService: AppAdminService,
    public commonRequestService: CommonRequestService,
    public router: ActivatedRoute) {
  }

  ngOnInit() {
    this.selectName = 'ruleName';
    this.getDataRuleListData();
    this.getBtn();

    this.addEnterEvent();

  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    $('.search-input').unbind("keypress")
  }

  /**
   * 给搜索框添加enter事件
   *
   * @memberof AppFuncComponent
   */
  addEnterEvent() {
    let _that = this;
    $('.search-input').bind('keypress', function (event) {
      if (event.keyCode == 13 && this == document.activeElement) {
        _that.search();
      }
    })
  }

  /**
   * 弹窗中的搜索按钮
   *
   * @memberof AppFuncComponent
   */
  nodeModalSearch() {
    console.log('---------');
    this.resourceTreeData('', '', 'search', 'modal');
  }

  /**
   * 弹窗中的 搜索框加enter事件
   *
   * @memberof AppFuncComponent
   */
  addModalEnterEvent() {
    console.log("enter---press");
    let _that = this;
    $('.searchText').bind('keypress', function (event) {
      if (event.keyCode == 13 && this == document.activeElement) {
        _that.resourceTreeData('', '', 'search', 'modal');
      }
    })
  }





  /**
   * 获取按钮集合的值
   *
   * @memberof DataResourceComponent
   * */
  public getBtn() {
    let _that = this;
    _that.menuId = this.router.snapshot.params['id'] ? this.router.snapshot.params['id'] : this.router.snapshot.queryParams['id'];
    this.commonRequestService.getMenuBtn(_that.menuId, _that, (res) => {
      if (res.success == 1) {
        _that.button = _that.commonService.viewBtn(res.rows);
      }
    });
  };


  /**
   * 获取资源树的数据
   *
   * @param {string} [modalCategory] 点击的弹窗类别
   * @param {*} [data] 当前点击的选中列表项的数据
   * @memberof DataRuleComponent
   */
  resourceTreeData(modalCategory?: string, data?: any, type?: any, modal?: any) {
    let body = {
      appId: this.appInfo['appId']
    };
    if (type && type == "search" && modal) {
      // 弹窗中的搜索
      body['resourceName'] = this.searchNodeValue ? this.searchNodeValue : '';
    }
    let __this = this;
    this.appAdminService.getResList(body, __this, (res) => {
      if (res && res.success == 1) {
        // 弹窗的搜索结果
        if (type && type == 'search' && modal) {
          // 弹窗的搜索框
          if (this.searchNodeValue && this.searchNodeValue) {
            // 搜索结果为列表
            this.dropDownTree = this.appAdminService.changeDropDownData(res.rows, []);
            // 判断是否是父节点；
            this.IsParentNode(this.dropDownTree);
          console.log(this.dropDownTree);
          } else if ((this.searchNodeValue && this.searchNodeValue.length == 0) || !this.searchNodeValue) {
            // 没有搜索内容，搜索结果为 全部数据
            this.dropDownTree = this.appAdminService.changeDropDownData(res.rows, [])[0].children;
            // 获取用户之前已经选中的节点值状态
            this.getEditResource(this.dropDownTree, this.selectIdObj);
          }
          return;
        }
        // 弹窗打开的 资源树数据
        __this.dropDownTree = __this.appAdminService.changeDropDownData(res.rows, [])[0].children;
        __this.saveParentNode(__this.dropDownTree);

        // 设置默认值
        if (modalCategory == 'edit') {
          // 编辑
          // 设置资源树的默认选中状态
          let checkedValueObj = {};
          for (let dataresourceItem of data.dataresourceRange.split(',')) {
            // 已经选中的资源范围
            checkedValueObj[dataresourceItem] = dataresourceItem;
          }
          this.getEditResource(this.dropDownTree, checkedValueObj);
        } else {
          //  添加时
        }
      }
    })
  }


  /**
   * 存储父节点数据
   *
   * @param {any} arr 遍历的数据
   * @memberof DataRuleComponent
   */
  public saveParentNode(arr) {
    // 将父节点存储起来
    for (let item of arr) {
      if (item.children && item.children.length>0) {
        this.parentNodeObj[item.id] = 1;
        this.saveParentNode(item.children);
      }
    }
  }
  /**
   * 判断当前是否是父节点
   *
   * @param {any} arr
   * @memberof DataRuleComponent
   */
  public IsParentNode(arr) {
    for (let item of arr) {
      if (item.children && this.parentNodeObj[item.id]) {
        item.isParent = true;
if(item.children.length>0){
  this.IsParentNode(item.children);
}

      }
    }
  }

  /**
   * 获取编辑时的 资源数据
   * 将资源的节点添加自动选中效果
   * @param {any} arr 处理的资源树数据
   * @param {any} dataresourceId 所属资源的id
   * @returns
   * @memberof DataRuleComponent
   */
  public getEditResource(arr, dataresourceIdObj) {
    for (let item of arr) {
      if (dataresourceIdObj[item.id]) {
        item.checked = true;
      }
      if (item.children && item.children.length > 0) {
        this.getEditResource(item.children, dataresourceIdObj);
      }
    }
  }


  /**
   * 获取规则的列表数据
   *
   * @memberof ResourceAdminComponent
   */
  getDataRuleListData(searchCondition?: any, modal?: any) {
    let params = {
      pageSize: this.pageSize,
      pageNum: this.pageNum,
      appId: this.appInfo['appId']
    };
    if (this.searchValue) {
      params[this.selectName] = this.searchValue ? this.searchValue : '';
    }
    // if (searchCondition) {
    //   Object.assign(params, searchCondition);
    // }
    if (searchCondition && searchCondition == 'search' && modal) {
      params['resourceName'] = this.searchNodeValue ? this.searchNodeValue : '';
    }
    let _that = this;
    _that.successMsg = [];
    this.dataStrategyService.getRuleListData(params, _that, (res) => {
      if (res && res.success == 1) {
        _that.dataRuleListData = res.rows;
        for (let item of res.rows) {
          if (item.dataresourceRangeName == "ALL") {
            item.dataresourceRangeName = '所有资源';
          } else if (!item.dataresourceRangeName || item.dataresourceRangeName.length == 0) {
            item.dataresourceRangeName = '-';
          }
        }
        _that.totalItems = res["totalElements"];
        _that.size = res['size'];
        _that.totalPages = res['totalPages'];

        _that.successMsg.push({ severity: 'success', summary: '', detail: '数据规则刷新成功' });
      } else {
        _that.successMsg.push({ severity: 'error', summary: '', detail: res.msgs });
      }
      _that.commonService.growl(_that, 'success', res.msgs, _that.successMsg);
    })
  }


  /**
   * 保存添加或者修改的资源信息
   *
   * @params {any} category 类别，add/edit
   * @memberof ResourceAdminComponent
   */
  public dataReourceConfirm: boolean = false;
  addSave(category: string) {
    if (this.ruleFormData.dataresourceRangeValue == '特定资源' && (!this.ruleFormData.dataresourceRangeName || this.ruleFormData.dataresourceRangeName.length == 0)) {
      console.log(this.ruleFormData.dataresourceRangeName);
      this.dataReourceConfirm = true;
      return;
    }
    if (!this.ruleFormData.content || (this.ruleFormData.content && this.ruleFormData.content.length == 0)) {
      this.ruleFormData.contentConfirm = true;
      return;
    }
    let __this = this;
    let body = category === 'add' ? this.ruleFormData : this.modalForm.value;
    this.successMsg = [];
    delete body.resourceName;
    // console.log('添加');
    // console.log(this.ruleFormData);
    // console.log('编辑');
    // console.log(this.modalForm.value);
    // return;
    if (category == 'add') {
      // 添加保存
      delete body.contentConfirm;
      delete body.dataresourceRangeValue;

      if (body.dataresourceRangeValue == "特定资源") {
        let valueRange = '';
        for (let key in this.modalForm.value) {
          if (this.modalForm.value[key] === true) {
            valueRange = valueRange + "," + key;
          }
        }
        body.dataresourceRange = valueRange.slice(1);
      }
      delete body.dataresourceRangeName;
      body['appId'] = this.appInfo.appId;
      this.dataStrategyService.addRuleReq(body, __this, (res) => {
        if (res && res.success == 1) {
          // 弹窗消失
          this.modalHide();
          this.successMsg.push({ severity: 'success', summary: '', detail: '添加规则成功' });
          // 调取列表数据
          this.getDataRuleListData();
        } else {
          this.errorMsg = res.msg;
          this.childModal.show();
        }
        __this.commonService.growl(__this, 'success', '', this.successMsg);
      })
    } else {
      // 编辑保存
      body.objectId = this.ruleFormData.ruleId;
      body.appId = this.appInfo.appId;

      if (body.dataresourceRangeValue == '所有资源') {
        body.dataresourceRange = "ALL";
      } else {
        body.dataresourceRange = '';
        // 特定资源
        let valueRange = '';
        for (let key in body) {
          if (body[key] === true) {
            valueRange = valueRange + "," + key;
            delete body[key];
          } else if (body[key] === false) {
            delete body[key];
          }
        }
        body.dataresourceRange = valueRange.slice(1);
        delete body.dataresourceRangeName;
      }
      delete body.dataresourceRangeValue;
      delete body.search;
      this.dataStrategyService.updateRuleReq(body, __this, (res) => {
        if (res && res.success == 1) {
          // 弹窗消失
          this.modalHide();
          this.successMsg.push({ severity: 'success', summary: '', detail: '更新规则成功' });
          __this.commonService.growl(__this, '', '', this.successMsg);
          // 调取列表数据
          this.getDataRuleListData();
        }
      })
    }
  }
  stopBublle(e) {
    this.commonService.stopBubble(e);
  }

  /**
   * 弹窗 弹出
   *
   * @memberof ResourceAdminComponent
   */
  modalShow(modalCategory: string, data?: any) {
    // 初始化下拉框
    $('.dropdowntree').css('display', 'none');
    $('.modal-content').click((event) => {
      let targetDom = event.target;
      if (targetDom.id != 'dropdownTree' && targetDom.parentElement.id != 'dropdownTree') {
        if ($('.dropdowntree').css('display') != 'none') {
          $('.dropdowntree').css('display', 'none')
        }
      }
    })
    this.ruleFormData = {};
    this.dataReourceConfirm = false;
    // 不是添加窗口，获取规则数据
    if (modalCategory != 'add') {
      let params = {
        ruleId: data.ruleId
      };
      let __this = this;
      this.dataStrategyService.getRuleListData(params, __this, (res) => {
        if (res && res.success == 1) {
          __this.ruleFormData = res.rows[0];
          if (modalCategory == 'view') {
            __this.ruleFormData.dataresourceRangeName = __this.ruleFormData.dataresourceRangeName == "ALL" ? "所有资源" : __this.ruleFormData.dataresourceRangeName;
          }
          if (modalCategory != 'view') {
            // 编辑
            this.ruleFormData.dataresourceRangeName = data.dataresourceRangeName ? data.dataresourceRangeName == "所有资源" || data.dataresourceRangeName == "-" ? '' : data.dataresourceRangeName : '';
            this.ruleFormData.dataresourceRange = data.dataresourceRange ? data.dataresourceRange : '';
            if (!data.dataresourceRange || data.dataresourceRange == 'ALL') {
              this.ruleFormData.dataresourceRangeValue = '所有资源';
              this.ruleFormData.dataresourceRange = "ALL";
            } else {
              this.ruleFormData.dataresourceRangeValue = '特定资源';
            }
          }
        }
      })
    }
    if (modalCategory == 'view') {
      this.viewModal.show();
    } else {
      // 获取资源树的数据
      this.resourceTreeData(modalCategory, data);
      // 判断不同的弹窗页面
      if (modalCategory == 'add') {
        this.ruleFormData = {};
        this.modalName = '新建';
        //  添加
        this.ruleFormData.dataresourceRangeName = '';
        this.ruleFormData.dataresourceRange = 'ALL';
        this.ruleFormData.dataresourceRangeValue = '所有资源';
      } else {
        this.modalName = '编辑';
        this.selectIdObj = {};
        // console.log(this.ruleFormData);
      }
      // 弹窗 弹出
      this.modal.show();
    }


  }

  /**
   * 弹窗 消失
   *
   * @memberof ResourceAdminComponent
   */
  modalHide() {
    this.modal.hide();
    // 重置表单信息
    this.modalForm.reset();
  }


  /**
   * 父级下拉框  点击事件
   * 控制下拉框显隐
   * @param {*} ele
   * @memberof DataResourceComponent
   */
  drop(ele: any) {
    if (ele.style.display == 'inline-block') {
      ele.style.display = 'none';
    } else {
      // 下拉框显示
      ele.style.display = 'inline-block';
      this.addModalEnterEvent();
      // 初始化样式
      $(".dropdown-tree-children").parent().parent().removeClass('ui-state-highlight');
      $('.' + this.ruleFormData.dataresourceId).parent().parent().addClass('ui-state-highlight');
      // 移除不可被点击的节点的样式
      $(".tree-input-diabled").parent().parent().removeClass();

      $(".tree-input-diabled").parent().parent().click((event) => {
        event.stopPropagation();
        return;
      })
    }
  }
  /**
   * 选中下拉框的资源节点
   *
   * @param {any} e
   * @memberof DataRuleComponent
   */
  public selectIdObj = {};
  nodeSelect(e, node) {
    if (node.checked) {
      this.dataReourceConfirm = false;
      // 如果是选中
      this.selectIdObj[node.id] = 1;
      this.ruleFormData.dataresourceRangeName = this.ruleFormData.dataresourceRangeName + "," + node.label;
      this.ruleFormData.dataresourceRange = this.ruleFormData.dataresourceRange + "," + node.id;
      if (this.ruleFormData.dataresourceRangeName.indexOf(',') === 0) {
        this.ruleFormData.dataresourceRangeName = this.ruleFormData.dataresourceRangeName.slice(1);
        this.ruleFormData.dataresourceRange = this.ruleFormData.dataresourceRange.slice(1);
      }
    } else {
      if (this.selectIdObj[node.id]) {
        delete this.selectIdObj[node.id]
      }
      if (this.ruleFormData.dataresourceRangeName.indexOf(node.label) === 0) {
        // 当前所选元素位置在最开始
        if (this.ruleFormData.dataresourceRangeName.length == node.label.length) {
          // 只有一个资源名称
          this.ruleFormData.dataresourceRangeName = this.ruleFormData.dataresourceRangeName.replace(node.label, '');
          this.ruleFormData.dataresourceRange = this.ruleFormData.dataresourceRange.replace(node.id, '');
        } else {
          // 不只一个资源名称
          this.ruleFormData.dataresourceRangeName = this.ruleFormData.dataresourceRangeName.replace(node.label + ",", '');
          this.ruleFormData.dataresourceRange = this.ruleFormData.dataresourceRange.replace(node.id + ",", '');
        }
      } else {
        this.ruleFormData.dataresourceRangeName = this.ruleFormData.dataresourceRangeName.replace("," + node.label, '');
        this.ruleFormData.dataresourceRange = this.ruleFormData.dataresourceRange.replace("," + node.id, '');
      }

    }
  }
  /**
   * 获取资源范围中选中的节点id
   *
   * @param {any} arr 处理的资源树的数据
   * @param {any} returnValue 返回值，空数组
   * @returns 返回选中的节点id
   * @memberof DataRuleComponent
   */
  getCheckedDropdownValue(arr, returnValue) {
    for (let item of arr) {
      if (item.checked) {
        returnValue.push(item.id);
      }
      if (item.children && item.children.length > 0) {
        this.getCheckedDropdownValue(item.children, returnValue)
      }
    }
    return returnValue
  }

  // /**
  //  * 所属资源 下拉框  选中节点 事件
  //  * 获取当前选中节点的数据，
  //  * @param {any} dropdowntree
  //  * @memberof DataResourceComponent
  //  */
  // dropDownSelect(e, dropdowntree) {
  //   if (this.selectedDropDownFile && this.selectedDropDownFile.children && this.selectedDropDownFile.children.length > 0) return;
  //   let srcEle = e.originalEvent.srcElement ? e.originalEvent.srcElement : e.originalEvent.target;
  //   this.ruleFormData.resourceName = this.selectedDropDownFile.label;
  //   this.ruleFormData.dataresourceId = this.selectedDropDownFile.id;
  //   dropdowntree.style.display = "none";
  // }

  /**
   * 判断表单中的名称是否重复
   *
   * @param {any} validEle
   * @memberof ResourceAdminComponent
   */
  public nameExistMes: any; // 资源名称是否存在的信息
  public codeExistMes: any = false; // 资源code是否存在的信息
  nameIsExist(validEle) {
    // 如果输入的内容不符合规则，返回，不继续进行验证
    this.codeExistMes = false;
    if (validEle.errors) return;
    let body = {
      appId: this.appInfo.appId
    };
    body[validEle.name] = validEle.value;
    let __this = this;
    this.dataStrategyService.verifyTextInput(body, __this, (res) => {
      if (res && res.success == 1) {
        if (res.rows[0].booleanResult) {
          this.codeExistMes = true;
        } else {
          this.codeExistMes = false;
        }
      }
    })
  }


  /**
   * 搜索
   *
   * @memberof ResourceAdminComponent
   */
  search() {
    this.getDataRuleListData();
  }

  /**
   * 删除 数据规则
   *
   * @param {any} row 当前删除项的数据信息
   * @memberof DataRuleComponent
   */
  public overConnect: boolean = false;  // 删除弹窗中 强制解除关联关系复选框是否显示
  delete(row) {
    this.overConnect = false;
    this.selectedDataRule = row;
    this.dialogDisplay = true;
    this.ruleName = row.ruleName;
    $('#delrulename').text(this.ruleName);
    let body = {
      ruleId: this.selectedDataRule.ruleId,
      isCalled: true,
      appId: this.appInfo.appId
    };
    let _that = this;
    this.dataStrategyService.delRuleReq(body, _that, (res) => {
      if (res && res.success == 1) {
        if (res.rows && res.rows[0] && res.rows[0].booleanResult) {
          // 有关联关系
          this.overConnect = true;
        } else {
          this.overConnect = false;
        }
      }
    })
  }

  /**
   * 删除  确认
   * 点击确认删除按钮
   * @memberof DataRuleComponent
   */
  delAccept() {
    let _that = this;
    this.successMsg = []; // 清空之前的提示信息
    let body = { ruleId: this.selectedDataRule.ruleId, isCalled: false, appId: this.appInfo.appId, };
    if (this.overConnect) {
      body['isRelieve'] = this.isRelieve;
    }
    this.dataStrategyService.delRuleReq(body, _that, (res) => {
      this.dialogDisplay = false;
      if (res && res.success && res.success == 1) {
        if (res.rows && res.rows[0].booleanResult) {
          // 删除成功
          _that.successMsg.push({ severity: 'success', summary: '', detail: '删除规则 成功' });
          _that.getDataRuleListData();
        } else {
          // 删除成功
          _that.successMsg.push({ severity: 'error', summary: '', detail: '删除规则 失败' });
        }
        _that.commonService.growl(_that, '', '你个', _that.successMsg);
      }
    })
  }

  /**
   * 翻页
   * @param event 存放当前页码和页容量
   */
  public paginate(event) {
    this.pageNum = event.currentPage;
    this.pageSize = event.itemsPerPage;
    this.getDataRuleListData();
  }

  /**
   * 页容量改变
   * @param event 存放页容量
   */
  public sizeChanged(event) {
    this.pageSize = event;
    this.pageNum = 1; //页容量改变时，页码值为1
    this.getDataRuleListData();
  }


}
