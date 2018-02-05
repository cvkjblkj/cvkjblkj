import { AppAdminService } from './../shared/app-admin.service';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { CommonService } from './../../../core/common-service/common.service';
import { ComponentSelectorNameRule } from 'codelyzer';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, Message } from 'primeng/primeng';
import { AppService } from './../app/shared/app.service';
import { AppAdmin } from './../app/shared/app.model';
import { CommonRequestService } from './../../../core/common-service/common-request.service'

@Component({
  selector: 'app-func',
  templateUrl: './app-func.component.html',
  styleUrls: ['./app-func.component.scss'],
  providers: [
    AppService, ConfirmationService,
    CommonService, CommonRequestService, CommonRequestMethodService

  ]

})
export class AppFuncComponent implements OnInit {

  public listRows: any;
  public model: any = new AppAdmin();
  public msgs: any; // 操作提示
  public message: any; // 操作提示框 内的提示信息

  public dropDownTree: any; // 下拉树 数据
  public parentId: any; // 父节点内容
  public parent: any; // 父节点Id
  public text: any; // 功能名称
  public appId: any; // 应用Id
  public appCode: any; // 接收传的值
  public funcCode: any;//功能Code
  public button: any = {};
  public disabled: boolean = true;//按钮的状态

  // 关联数据中所需变量 
  public selectFuncRowData: any; // treeTable中 选中列的数据 
  public resourceTreeData: any;  // 资源树数据
  public selectedConnectedData: any = {}; // 选中的关联数据 节点数据
  public selectRowData: any; // 关联数据按钮 所在的节点数据

  // 搜索需要的变量
  public selectName: any = 'funcName';  // 下拉选选中的搜索名称
  public searchValue: any; // 搜索框的内容
  public searchNodeValue: any; // 弹窗中搜索节点的数据
  // 弹窗
  public modalFuncList: any; // 弹窗中父级的功能树数据
  public isOpened = true;  // 是否受控 出现的条件 默认出现是两个条件

  @Output() configBtn = new EventEmitter();
  constructor(
    private confirmationService: ConfirmationService,
    private appService: AppService,
    private appAdminService: AppAdminService,
    private commonService: CommonService,
    private commonRequestService: CommonRequestService,
    private router: Router,
    private route: ActivatedRoute
  ) { };
  public objectId: any;


  public selectedNode: any = {};//列表选中
  public appName: any; // 标识名
  public id: any; // 选中节点的id
  public isExistRel: boolean = true;//code验证
  public isExistRell: boolean = true//名称校验
  public isExistMes: string;//表示验证
  public menuId: any;//菜单id
  public ungovernables: any = false; // 提示用户 子节点不受控
  public isClick: any = false; // 是否被点击
  addForm: NgForm;
  orgForm: NgForm;

  @ViewChild('addForm') AddForm: NgForm;
  @ViewChild('orgForm') OrgForm: NgForm;

  @ViewChild('dataModal') dataModal: any; // 关联数据 弹窗
  @ViewChild('editModal') editModal: any;  // 编辑弹窗
  ngOnInit() {
    if (!localStorage.getItem('appObj')) {
      return;
    } else if (localStorage.getItem('appObj')) {
      let appObj = localStorage.getItem('appObj')
      this.appCode = JSON.parse(appObj).appCode;
      this.appId = JSON.parse(appObj).appId;
      this.appName = JSON.parse(appObj).appName;
    }
    /*拿到按钮值*/

    if (this.route.snapshot.queryParams) {
      this.menuId = this.route.snapshot.queryParams['id'];
      if (!this.menuId) {
        this.menuId = this.route.snapshot.params['id'];
      }
    }
    let listParams = {
      appCode: this.appCode
    };
    this.getlist(listParams);


    this.addEnterEvent()

  };
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    $('.search-input').unbind("keypress");
    $('.searchText').unbind("keypress");
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
        _that.search(_that.searchValue);
      }
    })
  }


  /**
   * 弹窗中的搜索按钮
   * 
   * @memberof AppFuncComponent
   */
  nodeModalSearch() {
    this.searchModalTreeNode();
  }

  /**
   * 弹窗中的 搜索框加enter事件
   * 
   * @memberof AppFuncComponent
   */
  addModalEnterEvent() {
    let _that = this;
    $('.searchText').bind('keypress', function (event) {
      if (event.keyCode == 13 && this == document.activeElement) {
        _that.searchModalTreeNode();
      }
    })
  }

  /**
   * 搜索树的数据 请求
   * 
   * @memberof AppFuncComponent
   */

  searchModalTreeNode() {
    let _that = this;
    let url = '/app/func/getTree';
    let params = {
      appCode: _that.appCode,
      funcName: this.searchNodeValue
    };
    _that.appService.getTree(url, params, _that, (res) => {
      _that.modalFuncList = res.rows;
      _that.dropDownTree = _that.changeDropDownData(res['rows'], [], "search");
      if (_that.dropDownTree && _that.dropDownTree[0] && _that.dropDownTree[0].children && _that.dropDownTree[0].children.length > 0) {
        // 有子节点
        _that.dropDownTree.unshift({
          label: '无',
          parent: undefined,
          children: [],
          id: 'nothing'
        })
      }
      // 移除自己和孩子节点
      if (this.editModal.isShown) {
        _that.commonService.removeChidNode(_that.dropDownTree, _that.id);
      }

    })
  }


  /**
   * 获取功能树的数据
   * 
   * @param {*} param 请求参数
   * @memberof AppFuncComponent
  * */
  getlist(param: any, type?: any) {
    let _that = this;
    let url = '/app/func/getTree';
    let params = param;
    _that.appService.getTree(url, params, _that, function (res) {
      _that.listRows = res.rows;
      _that.listRows = _that.changeData(_that.listRows, []);
      if (!type || (type == 'search' && ((_that.searchValue && _that.searchValue.length == 0) || !_that.searchValue)) || !_that.searchValue) {
        // 不是搜索情况
        _that.listRows = _that.listRows ? _that.listRows[0] ? _that.listRows[0] ? _that.listRows[0].children : [] : [] : [];;
      } else
        _that.growl('success', '功能资源刷新成功');
      _that.selectedNodeTreeTable = {};
    })
    _that.getBtn();
  };

  /*
 * 页面初始化获取数据
 */
  public getBtn() {
    let _that = this;
    this.commonRequestService.getMenuBtn(_that.menuId, _that, (res) => {
      if (res.success == 1) {
        _that.button = _that.commonService.viewBtn(res.rows);
        window.localStorage.setItem('appBtn', JSON.stringify(_that.button));
      }
    });
  };


  /**
   *  搜索 
   * 根据输入内容进行搜索
   * @param {any} selectName 选择搜索项
   * @param {any} searchValue 输入的搜索内容
   * @memberof AppFuncComponent
  * */
  search(searchValue) {
    let __this = this;
    let params = {
      appCode: this.appCode
    }
    params[this.selectName] = searchValue ? searchValue : '';
    this.getlist(params, 'search');
  }


  /**
   *
   * *@param  array
  * 改变列表数据结构
  */
  changeData(array: any, returnValue) {
    for (var i = 0; i < array.length; i++) {
      var item = array[i];
      var funcName = item['text'];
      var children = item['children'];
      var attr = item['attributes'];
      var id = item['id'];
      if (children) {
        var data = {
          'data': {
            hierarchy: attr.hierarchy,
            funcCode: attr.funcCode,
            funcName: funcName,
            action: attr.action,
            opened: attr.opened,
            description: attr.description,
            resourceName: attr.resourceName,
            remark: attr.remark,
            createTime: attr.createTime,
            id: id
          },
          'attributes': attr,
          'children': children,
          'expanded': true,
        }
        // array[i] = data;
        returnValue[i] = data;
        if (children.length >= 1) {
          this.changeData(children, returnValue[i].children);
        }
        if (data.data.opened == 1) {
          data.data.opened = '否';
        } else if (data.data.opened == 0) {
          data.data.opened = '是';
        }
      }

    }
    return returnValue
  };
  // 阻止冒泡
  stopBubble(e) {
    this.commonService.stopBubble(e);
  }
  /*下拉框显示*/
  drop(ele: any) {
    if (ele.style.display == 'inline-block') {
      ele.style.display = 'none';
    } else {
      ele.style.display = 'inline-block';
      this.addModalEnterEvent();
    }
  };
  /*编辑框下拉*/
  isShow(ele: any) {
    if (ele.style.display == 'inline-block') {
      ele.style.display = 'none';
    } else {
      ele.style.display = 'inline-block';
      this.addModalEnterEvent();
    }

  };

  /**
   * 弹窗中 父级下拉框的数据
   * 
   * @memberof AppFuncComponent
   */
  getDropDownTree(id?: any) {
    let _that = this;
    let url = '/app/func/getTree';
    let params = {
      appCode: _that.appCode
    };

    _that.appService.getTree(url, params, _that, function (res) {
      _that.modalFuncList = res.rows;
      _that.dropDownTree = _that.changeDropDownData(res['rows'], []);
      _that.dropDownTree.unshift({
        label: '无',
        parent: undefined,
        children: [],
        id: 'nothing'
      })
      if (id) {
        _that.commonService.removeChidNode(_that.dropDownTree, id);
      }
    })
  };

  /**
   * 改变弹窗 中父级下拉框的数据格式
   * 将后台返回的功能树数据修改为 primeng中tree的数据格式
   * @param {*} arr 处理的数据
   * @returns 已经处理好的数据
   * @memberof AppFuncComponent
   */
  changeDropDownData(arr: any, returnValue: any, type?: any) {
    let rel;
    for (var i = 0; i < arr.length; i++) {
      let item = arr[i];
      let label = item['text'];
      let id = item['id'];
      let children = item['children'];
      let attr = item['attributes'];
      let data = {
        'label': label,
        'id': id,
        'children': children,
        'attributes': attr,
        'action': attr.action,
        'funcCode': attr.funcCode,
        'expanded': true,
        'opened': attr.opened,
      };
      returnValue[i] = data;
      // 如果是搜索的出来的结果是没有层级结构的，是列表的数据结构
      if (type && type == "search") {
        if (this.searchNodeValue && this.searchNodeValue.length > 0) {
        } else {
          if (children && children.length >= 1) {
            this.changeDropDownData(children, returnValue[i].children, "search");
          }
        }
      } else if (children && !type) {
        if (children.length >= 1) {
          this.changeDropDownData(children, returnValue[i].children);
        }
      }
    }

    if (type && type == "search" && this.searchNodeValue && this.searchNodeValue.length > 0) {
      rel = returnValue;
    } else {
      rel = returnValue[0].children;
    }
    return rel
  };
  /*
   *编辑框消失
   * @param addModal
   * @param orgForm
   */
  hide(addModal: any, orgForm: any) {
    addModal.hide();
    orgForm.reset();
    this.isExistRel = true;
    this.isExistRell = true;
  };

  /*
   *添加弹出框消失
   * @param addModal
   * @param addForm
   */
  hiden(addModal: any, addForm: any) {
    addModal.hide();
    addForm.reset();
    this.isExistRel = true;
    this.isExistRell = true;
  };

  /*添加下拉框*/
  addDropDownSelect(event, dropdowntree) {
    this.model.parentName = event.node.label;
    this.model.parentId = event.node.id;
    if (event.node.opened == 1) {
      // 选中的节点是 不受控
      this.isOpened = false;
      this.model.opened = '1';
    } else {
      this.isOpened = true;
      this.model.opened = '0';
    }
    dropdowntree.style.display = "none";
  };
  /**
   * 获取弹窗中  功能数据的数据
   */
  getModalFuncList() {
    let _that = this;
    let url = '/app/func/getTree';
    let params = {
      appCode: this.appCode
    };
    _that.appService.getTree(url, params, _that, function (res) {
      _that.modalFuncList = res.rows;
      // if (modalCategory == 'add') {
      //   this.dropDownTree = this.appAdminService.changeDropDownData(this.modalResourceListData, [])[0].children;
      // } else {
      //   this.dropDownTree = this.appAdminService.changeDropDownData(this.modalResourceListData, [], row.data.id)[0].children;
      //   // 在搜索时候，编辑弹窗的父级名字和id
      //   if (this.resourceReturndData[0].attributes.parentId == this.modalResourceListData[0].id) {
      //     // 根节点是父级
      //     this.resourceFormData.parentName = '无';
      //     this.resourceFormData.parentId = 'nothing';
      //   } else {
      //     this.getParentName(this.modalResourceListData, this.resourceReturndData[0].attributes.parentId);
      //   }
      // }
      // this.dropDownTree.unshift({
      //   label: '无',
      //   parent: undefined,
      //   children: [],
      //   id: 'nothing'
      // })
    })
  }


  /**
   * 添加 功能资源 弹窗显示
   * 
   * @param {*} addModal 
   * @memberof AppFuncComponent
   */
  public selectedNodeTreeTable: any = {};
  add(addModal: any) {
    $('.modal-content').click((event) => {
      let targetDom = event.target;
      if (targetDom.id != 'dropdownTree' && targetDom.parentElement.id != 'dropdownTree') {
        if ($('.dropdowntree').css('display') != 'none') {
          $('.dropdowntree').css('display', 'none')
        }
      }
    });
    // 判断是否受控的  按钮出现的条件
    if (this.selectedNodeTreeTable && !$.isEmptyObject(this.selectedNodeTreeTable)) {
      // 有选中节点
      if (this.selectedNodeTreeTable.attributes.opened == 1) {
        // 父节点是不受控，按钮只出现否
        this.isOpened = false;
        this.model.opened = '1';
      } else {
        this.isOpened = true;
        this.model.opened = '0';
      }
    } else {
      this.isOpened = true;
      this.model.opened = '0';
    }

    if (this.selectedNodeTreeTable && this.selectedNodeTreeTable.data) {
      this.model.parentName = this.selectedNodeTreeTable.data.funcName;
      this.model.parentId = this.selectedNodeTreeTable.data.id;
    } else {
      this.model.parentName = "无";
      this.model.parentId = 'nothing';
    }
    addModal.show();
    this.getDropDownTree();
  };




  /**
   * 添加的 弹窗 保存
   * 
   * @param {*} addModal 弹窗 添加
   * @param {*} addForm 添加的form表单
   * @memberof AppFuncComponent
   */
  funcSave(addModal: any, addForm: any) {
    let _that = this;
    let url = '/app/func/add';
    let params = {
      parentId: _that.model.parentId == 'nothing' ? this.modalFuncList[0].id : _that.model.parentId,
      funcName: _that.model.funcName,
      funcCode: _that.model.funcCode,
      description: _that.model.description,
      remark: _that.model.remark,
      opened: _that.model.opened,
      appId: _that.appId,
      action: _that.model.action
    }
    _that.disabled = true;
    _that.appService.funcSave(_that, url, params, (res) => {
      _that.message = res['rows'][0];
      if (res['success'] == 1) {
        _that.growl('success', '功能资源添加成功');
        _that.isExistRel = true;
        _that.disabled = true;
        addForm.reset();
        addModal.hide();
        this.selectedNodeTreeTable = {};
        /* 重新刷新treetable数据*/
        let listParams = {
          appCode: _that.appCode
        };
        this.searchValue = '';
        _that.getlist(listParams);
      } else if (res['success'] && res['success'] == -1) {
        switch (res['code']) {
          case 'PU00110':
            _that.growl('error', res.msg);
            break;
        }
        addModal.hide();
      }
    })
  };
  public orgId: any;//
  public parentIdIsExit: boolean = true; // 判断编辑父级角色是否显示

  /**
   * 编辑下拉框  选中的节点
   * 获取 编辑中父级的下拉选， 选中的节点数据
   * @param {any} event 
   * @param {any} dropdowntree 
   * @memberof AppFuncComponent
   */
  dropDownSelect(event, dropdowntree) {
    this.message.parentId = event.node.id;
    this.message.parentName = event.node.label;
    if (event.node.opened == 1) {
      // 选中的节点是 不受控
      this.isOpened = false;
      this.message.opened = '1';
    } else {
      this.isOpened = true;
      // this.model.opened = '0';
    }

    dropdowntree.style.display = "none";
  };

  /**
   * 用户点击 是  按钮
   */
  controll() {
    this.isClick = false;
  }
  /**
   * 用户点击 否  按钮
   */
  unControll() {
    this.isClick = true;
  }

  /**
   * 编辑 功能资源  弹窗显示 
   * 
   * @param {*} car 
   * @param {*} editModal 
   * @memberof AppFuncComponent
   */
  edit(car: any, editModal: any) {
    this.isClick = false;
    $('.modal-content').click((event) => {
      let targetDom = event.target;
      if (targetDom.id != 'dropdownTree' && targetDom.parentElement.id != 'dropdownTree') {
        if ($('.dropdowntree').css('display') != 'none') {
          $('.dropdowntree').css('display', 'none')
        }
      }
    })
    this.id = car.data.id;
    // this.selectedNode = {
    //   opened: car.parent ? car.parent.attributes ? car.parent.attributes.opened + '' : undefined : undefined,
    // }
    this.selectFuncRowData = car;

    let _that = this;
    let url = '/app/func/getById';
    let params = {
      objectId: this.selectFuncRowData.data.id
    }
    _that.appService.getList(url, params, _that, (res) => {
      _that.message = res['rows'][0];
      _that.message.opened = _that.message.opened + '';
      _that.message.parentId = _that.message.parentId;
      let url = '/app/func/getTree';
      _that.appService.getTree(url, { appCode: _that.appCode }, _that, function (res) {
        _that.modalFuncList = res.rows;
        _that.dropDownTree = _that.changeDropDownData(res['rows'], []);
        _that.dropDownTree.unshift({
          label: '无',
          parent: undefined,
          children: [],
          id: 'nothing'
        });

        // 设置父节点的名称和id
        if (_that.message.parentId == _that.modalFuncList[0].id) {
          // _that.message.opened = '0';
          _that.getParentName(_that.modalFuncList, _that.modalFuncList[0].id, _that.message.objectId);
          if (_that.message.children && _that.message.children.length > 0) {
            // 当前节点有子节点
            _that.ungovernables = true;
          } else {
            _that.ungovernables = false;
          }
          // 父节点是根节点
          _that.message.parentName = '无';
          _that.message.parentId = 'nothing';
          _that.isOpened = true;
        } else {
          _that.getParentName(_that.modalFuncList, _that.message.parentId, _that.message.objectId);
          if (_that.message.children && _that.message.children.length > 0) {
            // 当前节点有子节点
            _that.ungovernables = true;
          } else {
            _that.ungovernables = false;
          }
          if (_that.message.parent && _that.message.parent.opened == 1) {
            // 父节点的 是不受控
            _that.isOpened = false;
            _that.message.opened = '1';
          } else {
            // 受控
            _that.isOpened = true;
            // _that.message.opened = '0';
          }
        }
        // 移除自己和孩子节点
        _that.commonService.removeChidNode(_that.dropDownTree, _that.id);
      })
      editModal.show();
    })
  };
  /**
   * 获取当前所选节点的父节点名称
   * @param arr 
   * @param parentId 
   */
  getParentName(arr, parentId, objectId) {
    for (let item of arr) {
      if (item.id == parentId) {
        this.message.parentName = item.label;
        this.message.parent = {
          opened: item.attributes.opened,
        }
        for (let child of item.children) {
          // 当前元素本身
          if (child.id == objectId) {
            this.message.children = child.children;
            return;
          }
        }
      }
      if (item.children && item.children.length > 0) {
        this.getParentName(item.children, parentId, objectId)
      }
    }

  }

  /**
   * 编辑  弹出 保存
   * 
   * @param {*} editModal 弹出 弹窗
   * @param {*} orgForm 弹出的 form表单
   * @memberof AppFuncComponent
   */
  editSave(editModal: any, orgForm: any) {

    let _that = this;
    _that.disabled = true;
    let editUrl = '/app/func/update';
    let params = {
      objectId: _that.message.objectId,
      funcName: _that.message.funcName,
      description: _that.message.description,
      remark: _that.message.remark,
      opened: _that.message.opened,
      // action: _that.message.action
    };
    if (!this.message.parentId || this.message.parentId == 'nothing') {
      this.message.parentId = '';
      params['parentId'] = _that.modalFuncList[0].id;
    } else {
      params['parentId'] = _that.message.parentId;
    };

    _that.appService.updateSave(_that, editUrl, params, (res) => {

      _that.growl('success', '功能资源修改成功');
      orgForm.reset();
      editModal.hide();
      _that.disabled = true;
      let listParams = {
        appCode: _that.appCode
      };
      this.searchValue = '';
      _that.getlist(listParams);
    })

  };




  /**
   * 关联数据的    弹窗出现
   * 关联数据的弹窗出现并将选中的数据赋给
   * @param {any} selectedRow 选中列的数据
   * @param {any} dataModal 弹窗
   * @memberof AppFuncComponent
  * */
  associateModal(selectedRow, dataModal) {
    this.selectRowData = selectedRow;
    let body = {
      appId: this.appId,
    };
    let __this = this;
    let successMsg;
    // 获取资源的列表数据
    this.appAdminService.getResList(body, __this, (res) => {
      if (res && res.success == 1) {
        if (res.rows && res.rows[0] && res.rows[0].children.length == 0) {
          // 资源数据没有时,提示用户
          this.confirmationService.confirm({
            message: '还未创建数据资源，是否现在创建？',
            accept: () => {
              __this.configBtn.emit(false);
            }
          })
        } else {
          this.resourceTreeData = this.appAdminService.changeDropDownData(res.rows, [], this.selectRowData.attributes.dataresourceId, 'tree');
          dataModal.show();
        }
      }
    })
    // 选中列数据
    this.selectFuncRowData = selectedRow.data;
  }

  /**
   * 选中节点  关联数据
   * 选中复选框，获取选中的节点数据
   * @param {any} event 事件对象
   * @memberof AppFuncComponent
  * */
  nodeSelect(event) {
    let ele = event.target ? event.target : event.srcElement;
    let checkedId;
    // 实现单选的效果 
    if (!ele.checked) {
      // 将选中状态取消 
      ele.dataCode = '';
      checkedId = '';
    } else {
      // 选中
      // 清空选中状态 
      this.checkboxshowRadio(this.resourceTreeData, ele.id);
      checkedId = ele.id;
    }
    this.selectedConnectedData = {
      'funcIdList': [this.selectFuncRowData.id],
      'dataresourceId': checkedId
    }
  }

  /**
   * 先清空所有的选中的状态
   * 设置单选的状态
   * @param {any} arr 数据 
   * @memberof AppFuncComponent
  * */
  public checkboxshowRadio(arr, selectedNode?: any) {
    for (let item of arr) {
      if (!item.children || (item.children && item.children.length == 0)) {
        item.checked = false;
        if (item.id == selectedNode) item.checked = true;
        continue;
      } else {
        this.checkboxshowRadio(item.children, selectedNode);
      }
    }
  }

  /**
   * 数据资源列表数据
   * 
   * @memberof AppFuncComponent
   */
  public requestDataResouce() {
    let data = {};
    let __this = this;
    this.appAdminService.getResList(data, __this, (res) => {
      if (res.success && res.success == 1) {
        __this.resourceTreeData = res.rows;
        if (res.rows.length == 0) {
          __this.confirmationService.confirm({
            message: '还未创建数据资源，是否现在创建?',
            accept: () => {
              let url = this.router.url.slice(0, this.router.url.indexOf('func')) + 'data';
              this.router.navigate([url], { preserveQueryParams: true });
            }
          })
        }
      } else {

      }
    })
  }


  /**
   * 保存关联数据
   * 将用户选择的关联数据 进行保存
   * @memberof AppFuncComponent
  * */
  public connectionData() {
    let __this = this;
    let listParams = {
      appCode: __this.appCode
    };
    let params = this.selectedConnectedData;
    if ($.isEmptyObject(params)) {
      // 如果是空对象，用户没有进行任何操作，没有选中任何节点
      __this.dataModal.hide();
      __this.growl('success', '功能绑定资源成功');
      __this.getlist(listParams);
      return;
    }
    if (params['dataresourceId'] == '') {
      delete params.dataresourceId;
      // 移除功能关联的数据资源
      this.appAdminService.delConnectedData(params, __this, (res) => {
        if (res.success && res.success == 1) {
          __this.getlist(listParams);
          __this.dataModal.hide();
          __this.growl('success', '功能绑定资源成功');
        }
      })
      return;
    } else {
      this.appAdminService.saveConnectedData(params, __this, (res) => {
        if (res.success && res.success == 1) {
          __this.getlist(listParams);
          __this.dataModal.hide();
          __this.growl('success', '功能绑定资源成功');
        }
      })
    }


  }

  /*
   *删除模块
   * @param Modal 
   */
  delete(Modal: any, addForm: any) {

    let _that = this;
    let url = '/app/func/delete';
    let params = {
      objectId: Modal.data.id
    }
    _that.selectedNode = {};
    _that.objectId = Modal.data.id;
    if (Modal.children.length > 0) {
      _that.growl('error', '该节点存在子节点，请先删除子节点');
    } else if (Modal.children.length == 0) {
      this.confirmationService.confirm({
        message: '您确定要删除吗？',
        accept: () => {
          _that.appService.delete(_that, url, params, (res) => {
            _that.selectedNode = {};
            if (res['success'] == 1 && res['rows']) {
              //操作提示框显示
              _that.growl('success', '功能资源删除成功');
              _that.model = {};
              let listParams = {
                appCode: _that.appCode
              };
              this.selectedNodeTreeTable = {};
              this.searchValue = '';
              _that.getlist(listParams);
            } else if (res['success'] == -1) {
              if (res['code'] == 'PU00123') {
                _that.growl('error', res.msg);
              } else if (res['code'] == 'PU00122') {
                _that.growl('error', res.msg);
              }
            };
          })
        }
      })
    }


  };
  /*
   * @param funcCode
   * @param appId
   * 添加code校验
   * */
  public isEixtShow: boolean = false; //保存按钮是否可用
  isExist(funcCode: any, appId: any) {
    if (!funcCode) {
      return;
    };
    let _that = this;
    let url = '/app/func/checkCode';
    let params = {
      funcCode: funcCode,
      appId: appId
    };
    _that.appService.checkoutCode(url, params, _that, function (res) {
      _that.isExistRel = true;
      if (res['success'] == 1 && res['rows']) {
        let rel = res['rows'][0];
        if (rel['isExist']) {
          _that.isEixtShow = true;
          _that.isExistRel = false;
          _that.isExistMes = '功能编码已经存在';
          return
        } else if (!rel['isExist']) {
          _that.isEixtShow = false;
        }
      }
    });
  };
  /**
   * 提示消息
   * @param rel
   * @param res
   */
  public growl(rel: string, res: string) {
    this.msgs = [];
    this.msgs.push({ severity: rel, summary: '', detail: res })
  }
}
