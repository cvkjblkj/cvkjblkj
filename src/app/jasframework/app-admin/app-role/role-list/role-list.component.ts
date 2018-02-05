
import { DataStrategyService } from './../../data-strategy/shared/data-strategy.service';
import { AppService } from './../../app/shared/app.service';
import { CommonRequestMethodService } from './../../../../core/common-service/request-method.service';
import { CommonService } from './../../../../core/common-service/common.service';
import { CommonRequestService } from './../../../../core/common-service/common-request.service';
import { ConfirmationService, ButtonModule } from 'primeng/primeng';
import { PlatAdminService } from './../../../plat-admin/shared/plat-admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, Attribute } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TabsetComponent } from 'ng2-bootstrap';

import { AppAdminService } from './../../shared/app-admin.service';
import { AppAdmin } from './../../shared/app-admin.model';

declare var $: any;
@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css', './../../../../theme/sass/vendor/table-view.scss'],
  providers: [AppAdminService, PlatAdminService, ConfirmationService, CommonRequestMethodService, CommonService, CommonRequestService, AppService, DataStrategyService]
})
export class RoleListComponent implements OnInit {
  //添加  表单
  @ViewChild('roleForm') roleForm;
  // tab 切换
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  //搜索条件：角色名称
  public roleName: any;
  // 提示信息
  public msgs: any;
  //记录信息
  public role: any = new AppAdmin();
  // 角色树
  public nodeTree: any;
  //侧边栏是否显示
  public isleft: any = false;
  // 角色授权  选中的节点id
  public dataId: any = [];
  public button: any = {};// 按钮对象
  public radioValue: any = {};  // 单选的规则值集合
  public searchValue: any; // 搜索框的搜索内容

  //角色信息
  public roleList: any;
  public parentId: any; //父节点id
  public roleId: any; //选中节点id值
  public selectedFile: any = {};//被选中的节点
  public rootId: any;//根节点id
  public appName: any;//应用名称

  public appId: any; // 应用的ID值
  public appCode: any; // 应用的ID值
  public roleTable: any;//treetable数据
  public menuId: any;//当前菜单的id
  public btnList: any; // 按钮列表

  @ViewChild('congfigModal') congfigModal: any; // 判断当功能树没有数据的时候，提示弹窗
  public assignErrorMsg: any; // 判断当功能树没有数据的时候，提示信息
  constructor(
    public appAdminService: AppAdminService,
    public platAdminService: PlatAdminService,
    public confirmationService: ConfirmationService,
    public commonRequestService: CommonRequestService,
    public commonService: CommonService,
    public dataStrategyService: DataStrategyService,
    public appService: AppService,
    private router: ActivatedRoute,
    private route: Router
  ) { }




  public data: any;

  ngOnInit() {
    this.menuId = this.router.snapshot.queryParams['id'] ? this.router.snapshot.queryParams['id'] : this.router.snapshot.params['id'];
    // 获取存储的应用信息
    let appInfo = JSON.parse(window.localStorage['appObj']);
    this.appName = appInfo.appName;
    this.appId = appInfo.appId;
    this.appCode = appInfo.appCode;

    this.InitData();
    this.getBtn();
    this.addEnterEvent();
  }
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    $('.search').unbind("keypress");
  }

  /**
   * 给搜索框添加enter事件
   * 
   * @memberof AppFuncComponent
   */
  addEnterEvent() {
    let _that = this;
    $('.search').bind('keypress', function (event) {
      if (event.keyCode == 13 && this == document.activeElement) {
        _that.search();
      }
    })
  }
  /**
   * 初始化数据
   */
  public InitData() {
    let _that = this;
    let params = {
      'appCode': this.appCode,
      'appId': this.appId
    }
    this.appAdminService.getRoleList(_that, params, (res) => {
      if (res.success == 1) {
        _that.commonService.growl(_that, 'success', '角色刷新成功');
        _that.roleTable = res.rows;
        if (_that.roleTable.length == 0) {
          return;

        } else {
          _that.rootId = _that.roleTable[0].id;
        }

        _that.changeData(_that.roleTable);
      } else if (res.success == -1) { };
    })
  };

  /**
    * 获取初始化按钮数据
    */
  public getBtn() {
    let _that = this;
    this.commonRequestService.getMenuBtn(this.menuId, _that, (res) => {
      if (res && res.success == 1) {
        _that.button = _that.commonService.viewBtn(res.rows);
      } else if (res.success == -1) { }
    })
  }

  /**
   * 获取角色树
   */
  public getNodeTree(id?: any) {
    let _that = this;
    let params = {
      'appCode': this.appCode,
      'appId': this.appId
    }
    this.appAdminService.getRoleList(_that, params, (res) => {
      if (res.success == 1) {
        _that.nodeTree = res.rows;
        if (id) {
          _that.removeChidNode(_that.nodeTree, id);
        }

      } else if (res.success == -1) {
      }
    })
  };
  /**
   * 移除编辑节点的子节点
   * 编辑弹窗 tree
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
   * 搜索
   * 根据角色名称搜索
   */
  public search() {
    let _that = this;
    let params = {
      'appCode': this.appCode,
      'appId': this.appId,
      'roleName': this.searchValue
    }
    this.appAdminService.searchRole(_that, params, (res) => {
      if (res['success'] == 1) {
        // 提示搜索成功

        _that.commonService.growl(_that, 'success', '角色刷新成功');
        _that.roleTable = res.rows;
        _that.changeData(_that.roleTable);
      } else if (res.success == -1) {
      }
    })

  }



  /**
   * tree 的配置
   */
  public treeOptions = {
    displayField: 'text',
    isExpandedField: 'expanded'
  };

  /**
   * 查看弹窗 弹出
   * 
   * @param {any} viewModal  查看弹窗
   * @param {any} car  选中列的信息
   * @memberof RoleListComponent
  * */
  viewRole(viewModal, car) {
    viewModal.show();
    this.roleList = car.data;
  }



  /**
   * 编辑 弹出
   * @param modal 修改弹窗
   */
  public parentIdIsExit: boolean = true; //判断编辑父级角色是否显示；
  public allowAssignEdit: any;
  public editRole(modal: any, row: any) {

    // this.roleList = row.data;
    // if (this.roleList.allowAssign = '可分配') {
    //   this.allowAssignEdit = '1';
    // } else if (this.roleList.allowAssign = '不可分配') {
    //   this.allowAssignEdit = '0';
    // // }
    // if (row.parent) {
    //   this.role.parentId = row.parent.data.id;
    //   this.roleList.parentName = row.parent.data.roleName;
    // } else {
    //   this.role.parentId = '';
    // }

    modal.show();
    this.getUserInfo(row.data.id, row);
    if (row.parent == null) {
      this.parentIdIsExit = false;
    } else {
      this.parentIdIsExit = true;
      this.getNodeTree(row.data.id);
    }

  }

  /**
   * 获取角色的基本信息
   */
  public getUserInfo(objectId, row) {
    let _that = this;
    this.platAdminService.getRoleMsg(objectId, _that, (res) => {
      if (res.success == 1) {
        _that.roleList = res.rows[0];
        if (_that.roleList.allowAssign == 1) {
          _that.roleList.allowAssign = '1';
        } else if (_that.roleList.allowAssign == 0) {

          _that.roleList.allowAssign = '0';
        }
        if (!row.parent) {
          _that.parentId = '';
        } else {
          _that.roleList.parentName = row.parent.data.roleName;
          _that.parentId = row.parent.data.id;
        }
      } else if (res.success == -1) {
        _that.roleList = row.data;
      }
    })

  }

  /**
   * 编辑信息 保存
   * @param modal 编辑弹窗
   * @param value 编辑信息
   */
  public onEditSubmit(modal: any, value: any) {
    let _that = this;
    value.objectId = this.roleList.objectId;
    value.parentId = this.parentId;
    value.appId = this.appId;
    delete value.parentName;
    this.appAdminService.editSaveRole(_that, value, (res) => {
      if (res.success == 1) {
        _that.commonService.growl(_that, 'success', '角色编辑成功');
        modal.hide();
        _that.InitData();
      } else if (res.success == -1) {
        _that.commonService.growl(_that, 'error', res.msg);
      }
    })
  }


  /**
   * 添加  弹出
   * @param modal 添加弹出框
   */
  public addRole(modal: any) {
    let _that = this;
    this.AddDropdrowIsShow = false; //添加角色中 父级角色下拉框关闭
    if (this.roleTable.length == 0) {
      // this.confirmationService.confirm({
      //   message:'没有父级角色树，无法添加角色',

      // })
      this.commonService.growl(_that, 'error', '没有父级角色树，无法添加角色')
      return;
    }
    //设置默认值，是否可分配
    this.role.allowAssign = '0';
    // console.log(this.selectedFile);
    if (this.selectedFile.data) {
      this.role.parentName = this.selectedFile.data.roleName;
      this.role.parentId = this.selectedFile.data.id;
    }
    modal.show();
    this.getNodeTree();
  }

  /**
    * 检验角色Code是否存在
    * @param isRight 是否正确
    * @param value roleCode
    */
  public IsSame: boolean = false;
  checkExit(isRight: any, value: any) {
    let _that = this;
    if (value == '') {
      this.IsSame = false; //把提示编码已存在提示关闭
      return;
    }
    if (!isRight) {
      this.platAdminService.checkRoleCode(value, this.appCode, _that, (res) => {

        if (res.success == 1) {
          if (res.rows[0].isExist) {
            this.IsSame = true;

          } else if (!res.rows[0].isExist) {
            this.IsSame = false;
          }
        }
      })
    }
  }


  /**
   *   保存 添加的用户信息
   * @param value form表单的值
   * @param addModal 添加弹窗
   */
  public onSubmit(value: any, addModal: any) {
    value.parentId = this.role.parentId;
    value.appId = this.appId;
    delete value.parentName;
    let _that = this;
    this.appAdminService.saveRoleInfo(_that, value, (res) => {
      if (res.success == 1) {
        _that.commonService.growl(_that, 'success', '角色添加成功');

        _that.formReset(addModal);
        _that.InitData();
      } else if (res.success == -1) {
        if (res.code == 'PU04010') {
          _that.commonService.growl(_that, 'error', res.msg)
        } else if (res.code == 'P04021') {
          _that.commonService.growl(_that, 'error', res.msg)
        } else if (res.code == 'PU04000') {
          _that.commonService.growl(_that, 'error', res.msg)
        }
      }
    })

  }

  /**
   * 下拉列表是否显示
   */
  public AddDropdrowIsShow: boolean = false;
  public dropdown() {
    this.AddDropdrowIsShow = !this.AddDropdrowIsShow;
  }

  /**
   * 在添加弹窗中
   * tree  选中的节点数据
   */
  public AddSelectNode(event) {
    this.AddDropdrowIsShow = false;
    this.role.parentName = event.node.data.text;
    this.role.parentId = event.node.data.id;
    // this.roleList.parentName = event.node.data.text;

  }
  /**
   * 在编辑弹窗中
   * tree  选中的节点数据
   */
  public editSelectNode(event) {
    this.AddDropdrowIsShow = false;
    this.roleList.parentName = event.node.data.text;
    this.roleList.parentId = event.node.data.id;
    this.parentId = event.node.data.id;
  };


  public name: any;//授权的角色名称


  /**
   * 授权  弹窗
   * 点击授权按钮，弹窗弹出
   * 
   * @param {any} authorityModal 
   * @param {any} car 
   * @memberof RoleListComponent
  * */
  public checkboxListData: any;  // 授权数据
  authorityRole(authorityModal, row) {
    this.name = row.data.roleName;
    this.parentId = row.attributes.parentId;

    this.roleId = row.data.id;
    let params = {
      'roleId': this.roleId,
      'parentRoleId': this.parentId,
      'appId': this.appId,
      'opened': 0
    };
    let _that = this;
    this.appAdminService.getRoleTree(_that, params, (res) => {
      if (res.success == 1) {
        _that.nodeTree = res.rows;
        if (_that.nodeTree.length == 0) {
          _that.assignErrorMsg = '请先给该角色的父级角色 ' + '"' + row.parent.data.roleName + '"' + ' 授权';
          _that.congfigModal.show();
        } else {
          authorityModal.show();
        }
        // 处理授权树的选中状态
        _that.checkboxListData = _that.detailFuncTree(res.rows);

      }
    })
  }


  /**
   * 获取功能资源数据
   * 
   * @memberof RoleListComponent
   */
  getFuncTreeData() {
    let funcTree;
    let ruleList;
    let _that = this;
    let url = '/app/func/getTree';
    let params = this.appCode;
    _that.appService.getTree(url, params, _that, (res) => {
      if (res && res.success == 1) {
        funcTree = res.rows;

      }
    })
  }

  /**
   * 处理功能树的数据
   * 将 请求得到的功能树的数据  进行处理，
   * @param {any} array 处理的数据
   * @returns 返回treeTable 组件可以用的数据格式
   * @memberof RoleListComponent
   */
  detailFuncTree(array, parent?: any) {
    for (var i = 0; i < array.length; i++) {
      var item = array[i];
      var funcName = item['text'];
      var children = item['children'];
      var attr = item['attributes'];
      var funcId = item['id'];
      this.radioValue[funcId] = attr.selectedRuleId ? attr.selectedRuleId : 'nothing';
      if (children) {
        var data = {
          'data': {
            hierarchy: attr.hierarchy,
            funcCode: attr.funcCode,
            funcName: funcName,
            action: attr.action,
            opened: attr.opened,
            description: attr.description,
            remark: attr.remark,
            createTime: attr.createTime,
            funcId: funcId,
            checked: item.checked,
          },
          // ruleList: attr.ruleList,
          'attributes': attr,
          'children': children,
          'expanded': true,
          parent: parent,
        }
        array[i] = data;

        if (attr.ruleList && attr.ruleList.length > 0 && (!children || (children && children.length == 0))) {
          let ruleLast = {
            ruleName: "无", dataResorceId: attr.ruleList[0].dataresourceId, objectId: 'nothing'
          }
          array[i].ruleList = attr.ruleList;
          array[i].ruleList.push(ruleLast);
        } else {
          array[i].ruleList = [];
        }
        // 添加父节点选中状态
        if (parent && item.checked) {
          this.updateParentChecked(parent);
        }
        if (children.length >= 1) {
          this.detailFuncTree(children, array[i]);
        }
      }
    }
    return array;
  }

  /**
   * 功能权限的  复选框选中
   * 调用更新子节点和父节点的选中状态的函数
   * @param {any} node 选中的节点数据
   * @param {any} e 选中的节点 事件对象
   * @memberof RoleListComponent
  * */
  public selectCheckedFuncIds: any = [];    // 选中项  的数组
  checkedFuncNode(node, e) {
    let eleDom = e.srcElement ? e.srcElement : e.target;
    // 实现 父节点和子节点的选中效果
    this.updateChildChecked(eleDom.checked, node);
    this.updateParentChecked(node.parent);
  }

  /**
   * 更新 子节点的选中状态
   * 根据当前选中的状态，判断子节点的选中状态
   * @param {any} checked 选中状态
   * @param {any} node 选中的节点数据
   * @memberof RoleListComponent
   */
  updateChildChecked(checked, node) {
    node.data.checked = checked;
    node.data.indeterminate = false;
    $('.myCheck-' + node.data.funcId).prop('indeterminate', false);
    if (node.children && node.children.length > 0) {
      for (let item of node.children) {
        this.updateChildChecked(checked, item);
      }
    }
  }
  /**
   * 更新 父节点的 选中状态
   * 根据子节点的选中状态，判断父节点的选中 状态
   * @param {any} node 选中的节点数据
   * @memberof RoleListComponent
   */

  updateParentChecked(node) {
    if ((node && node.parent != undefined && node.children) || (node && node.parent == undefined)) {
      let allChildChecked = true;
      let noChildChecked = true;
      let indeterminateChecked = false;   // 半选状态
      for (let child of node.children) {
        if (child.data) {
          if (!child.data.indeterminate) {
            // 不是半选状态
            if (!child.data.checked) {
              allChildChecked = false;
            } else if (child.data.checked) {
              noChildChecked = false;
            }
          } else {
            // 半选
            indeterminateChecked = true;
          }
        } else {
          continue;
        }

      }
      if (indeterminateChecked) {
        node.data.checked = false;
        node.data.indeterminate = true;
        setTimeout(() => { $('.myCheck-' + node.data.funcId).prop('indeterminate', true); }, 50);
      } else {
        if (allChildChecked) {
          // 全选
          node.data.checked = true;
          node.data.indeterminate = false;
          setTimeout(() => { $('.myCheck-' + node.data.funcId).prop('indeterminate', false); }, 50);
        } else if (noChildChecked) {
          // 没有选中
          node.data.checked = false;
          node.data.indeterminate = false;
          setTimeout(() => { $('.myCheck-' + node.data.funcId).prop('indeterminate', false); }, 50);
        } else {
          // 半选
          setTimeout(() => { $('.myCheck-' + node.data.funcId).prop('indeterminate', true); }, 50);
          node.data.checked = false;
          node.data.indeterminate = true;
        }
      }
      if (node.parent != undefined) {
        this.updateParentChecked(node.parent);
      }

    }
  }

  /**
   * 获取 用户选中的 功能和规则id
   * 
   * @param {any} arr 处理的数组
   * @memberof RoleListComponent
   */
  getAssignData(arr) {
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      if (item.data.checked || item.data.indeterminate) {
        // 选中的功能id
        this.selectCheckedFuncIds.push(item.data.funcId);
      }
      if (item.children && item.children.length > 0) {
        this.getAssignData(item.children);

      }

    }
  }

  /**
   * 角色授权  保存
   */
  public saveAssign(modal) {

    // console.log(this.radioValue);
    // // return;
    this.selectCheckedFuncIds = [];
    this.getAssignData(this.checkboxListData);
    let _that = this;
    let privilege = [];
    for (let item of this.selectCheckedFuncIds) {
      privilege.push({
        funcId: item,
        ruleId: this.radioValue[item] ? this.radioValue[item] == 'nothing' ? '' : this.radioValue[item] : '',
      })
    }
    if (privilege.length == 0) {
      // 移除 功能权限和数据规则
      let params = {
        roleId: this.roleId,
        funcIds: '',
      }
      this.appAdminService.removeRoleAssign(params, _that, (res) => {
        if (res && res.success == 1) {
          // 成功
          modal.hide();
          this.InitData();
          this.commonService.growl(_that, 'success', '角色授权移除成功');
        } else {
          this.commonService.growl(_that, 'success', '角色授权移除失败');
        }
      })
    } else {
      let params = {
        roleId: this.roleId,
        privilege: privilege,
        deassign: true,
      }
      this.appAdminService.roleAssignPri(params, _that, (res) => {
        if (res && res.success == 1) {
          if (res.rows[0].booleanResult) {
            // 成功
            modal.hide();
            this.InitData();
            this.commonService.growl(_that, 'success', '角色授权成功');
          } else {
            this.commonService.growl(_that, 'error', '角色授权失败');
          }
        }
      })
    }
  }

  /**
   * 删除角色
   * @param data 删除的角色数据
   */
  public delete(row) {
    let _that = this;
    this.selectedFile = {};
    if (row.children.length > 0) {
      //有子节点
      // this.confirmationService.confirm({
      //   message: '该角色存在子节点，请先删除子节点！'
      // })
      this.commonService.growl(_that, 'error', '该角色存在子节点，请先删除子节点！');
    } else if (row.children.length == 0) {
      //没有子节点
      this.confirmationService.confirm({
        message: '确定要删除该角色？',
        accept: () => {
          let params = {
            'objectId': row.data.id,
          }
          this.appAdminService.deletRole(_that, params, (res) => {
            this.selectedFile = {};
            if (res.success == 1) {
              let msg = '删除成功';
              _that.commonService.growl(_that, 'success', msg);
              _that.InitData();
            } else if (res.success == -1) {
              if (res.code == 'PU04021') {
                _that.commonService.growl(_that, 'error', res.msg + "不能被删除！");
              }
            }
          })
        },
        reject: () => {
          this.selectedFile = {};
        }
      })

    }
  }





  /**
   * 侧边栏隐藏
   * 取消按钮
    */
  public empowerCancle() {
    this.isleft = false;
  }
  /**
   * 添加表单重置，隐藏
   * @param modal 弹出框 form 表单
   */
  public formReset(modal: any) {
    this.roleForm.reset();
    modal.hide();
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
      if (attr.allowAssign == 1) {
        var allowAssign = '是';
      } else if (attr.allowAssign == 0) {
        var allowAssign = '否';
      }

      if (children) {
        var datas = {
          'data': {
            roleName: name,
            id: id,
            roleCode: attr.roleCode,
            description: attr.description,
            remark: attr.description,
            allowAssign: allowAssign,
            parentId: attr.parentId,
            createTime: attr.createTime,
            createUser: attr.createUser,
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
   * 登录超时
 `*/

  // public loginTimeOut() {
  //   this.confirmationService.confirm({
  //     message: '登录超时，请重新登录',
  //     accept: () => {
  //       this.route.navigate(['./login']);
  //       window.localStorage.clear();
  //     },
  //     reject: () => {
  //       this.route.navigate(['./login']);
  //       window.localStorage.clear();
  //     }

  //   })
  // }
}

