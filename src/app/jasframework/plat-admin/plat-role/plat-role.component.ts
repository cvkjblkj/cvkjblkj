import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { CommonRequestService } from './../../../core/common-service/common-request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { CommonService } from './../../../core/common-service/common.service';
import { PlatAdmin } from './../shared/plat-admin.model';
import { PlatAdminService } from './../shared/plat-admin.service';
import { ConfirmationService } from 'primeng/primeng';
@Component({
  selector: 'app-plat-role',
  templateUrl: './plat-role.component.html',
  styleUrls: ['./plat-role.component.css'],
  providers: [ConfirmationService, PlatAdminService, CommonService, CommonRequestService, CommonRequestMethodService]
})
export class PlatRoleComponent implements OnInit {
  public model = new PlatAdmin();
  public rows: any; //当前列表数据
  public roleMsg: any; //当前用户信息
  public appId = '871e16bc-6e21-47fc-b358-47b9494179ff';
  public appCode = 'PaasCloud';
  public name: any; //当前选中节点信息
  public selectedPlatformRole: any = {}; //被选中的treeTable节点
  //侧边栏是否显示
  public isleft: any = false;
  // 按钮显示的数据
  public button: any = {};
  public treeData: any; //下拉树的数据
  // 添加 父节点id值
  public parentId: any;
  public selectedFile: any;
  public dropdownIsShow: boolean = false; //定义下拉  是否显示
  public roleTree: any;//角色功能树
  public appList: any;//应用列表
  public dataId: any = [];//角色功能树 选中节点的id
  public roleId: any; // 角色id值
  public rootId: any;//根节点id

  public menuId: any;
  @ViewChild('checkList') checkList; //角色数据权限的父级元素
  public appSelectList: any; //拼接选中的应用id值
  @ViewChild('addForm') addForm;
  @ViewChild('editForm') editForm;
  // 成功提示信息 growl插件
  public msgs: any;


  constructor(
    public confirmationService: ConfirmationService,
    public platAdminService: PlatAdminService,
    public commonService: CommonService,
    public commonRequestService: CommonRequestService,
    public route: Router,
    private router: ActivatedRoute
  ) { }


  ngOnInit() {
    this.menuId = this.router.snapshot.queryParams['id'];
    if (!this.menuId) {
      this.menuId = this.router.snapshot.params['id'];
    }
    // this.getBtn();
    this.InitData();


  }
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
   * 初始化数据
   */
  public InitData() {
    let id = this.appId;
    let _that = this;
    this.platAdminService.getRoleList(id, this.appCode, _that, (res) => {
      if (res.success == 1) {
        _that.rows = res.rows;
        if (_that.rows == []) {
          return;
        } else if (_that.rows.length != 0) {
          _that.rootId = _that.rows[0].id;
          _that.changeData(_that.rows);
          _that.commonService.growl(_that, 'success', '角色刷新成功');
        }
      }
    })

    this.getBtn();

  };
  /**
   * 表单重置及弹窗隐藏
   * @param modal 弹窗
   * @param form 表单
   */

  public addFormReset(form?: any, modal?: any) {
    this.addForm.reset();
    modal.hide();

  };
  public editFormReset(form?: any, modal?: any) {
    this.editForm.reset();
    modal.hide();

  };
  /**
   * 获取节点的组织机构
   * @param event 事件对象
   */
  public dropDownSelect(event) {
    // console.log(event);
    this.parentId = event.node.id;
    this.roleMsg.fatherRole = event.node.label;
    this.dropdownIsShow = false;
  };
  /**
   * 获取下拉树的数据
   *
   */
  public getTreeNode(id?: any) {
    let _that = this;
    this.platAdminService.getRoleAddList(_that, this.appId, this.appCode, (res) => {
      if (res.success == 1) {
        _that.treeData = res.rows;
        if (id) {
          _that.commonService.removeChidNode(_that.treeData, id);
        }
      } else if (res.success == -1) { }
    })
  }


	/**
	 * 添加用户信息
	 * @param addModal
	 */
  public addRole(addModal: any) {
    if (this.selectedPlatformRole.data) {
      this.model.fatherRole = this.selectedPlatformRole.data.roleName;
      this.parentId = this.selectedPlatformRole.data.id;
      this.appId = this.selectedPlatformRole.attributes.appId;
    }
    addModal.show();
    this.getTreeNode();
  };


  /**
   * 检验角色Code是否存在
   * @param isRight 是否正确
   * @param value roleCode
   */
  public IsSame: boolean = false;
  checkExit(isRight: any, value: any) {
    let _that = this;
    if (value == 'superadmin') {
      this.IsSame = true;
      return;
    }
    if (!isRight) {
      this.platAdminService.checkRoleCode(value, this.appCode, _that, (res) => {
        if (res.success == 1) {
          if (res.rows[0].isExist) {
            _that.IsSame = true;
          } else if (!res.rows[0].isExist) {
            _that.IsSame = false;
          }
        } else if (res.success == -1) { }
      })
    }
  }
  /**
   * 添加  保存
   * @param value 提交的添加信息
   * @param modal 添加弹窗
   */
  public onAddSubmit(value, modal) {
    let _that = this;
    value.appId = this.appId;
    value.parentId = this.parentId;
    delete value.fatherRole;

    this.platAdminService.addSave(value, _that, (res) => {
      _that.selectedFile = {};
      if (res.success == 1) {
        modal.hide();
        let msg = '添加用户成功';
        _that.commonService.growl(_that, 'success', msg);
        _that.InitData();
        _that.addFormReset(_that.addForm, modal);
      }
    })
  }

  /**
   * 定义下拉列表是否显示
   */
  public fatherRole: any; //父级角色;
  public dropdown(dropdown: any) {
    this.dropdownIsShow = !this.dropdownIsShow;
  };


  /**
   * 选中tree的节点 添加
   * @param event 节点数据
   */
  public selectNodeTree(event: any) {
    this.dropdownIsShow = false;
    // console.log(event);
    this.model.fatherRole = event.node.data.text;
    this.appId = event.node.data.attributes.appId;
    if (this.roleMsg) {
      this.roleMsg.fatherRole = event.node.data.text;
    }

    this.parentId = event.node.data.id;

  }


	/**
	 * 编辑 角色信息
	 * @param editModal
	 */
  public parentRoleIsExist: boolean = true;
  public editRole(editModal, row) {
    // console.log('editModal');
    // console.log(car);
    editModal.show();
    this.getUserInfo(row.data.id, row)
    // this.roleMsg = car.data;
    this.getTreeNode(row.data.id);
    if (!row.parent) {
      this.parentRoleIsExist = false;
    } else {
      this.parentRoleIsExist = true;
    }
  }

  // 获取角色的基本信息
  public getUserInfo(obejctId, row) {
    let _that = this;
    this.platAdminService.getRoleMsg(obejctId, _that, (res) => {
      if (res.success == 1) {
        _that.roleMsg = res.rows[0];
        if (!row.parent) {
          _that.parentId = '';
        } else {
          _that.roleMsg.fatherRole = row.parent.data.roleName;
          _that.parentId = row.parent.data.id;
        }

      } else if (res.success == -1) {
        _that.roleMsg = row.data;
      }
    })
  }

  /**
   * 编辑  保存
   * @param value 表单对象
   * @param modal 编辑弹窗
   */
  public onEditSubmit(value: any, modal: any) {
    let _that = this;
    // console.log(value);
    value.objectId = this.roleMsg.objectId;
    value.parentId = this.parentId;
    if (value.parentId == '') {
      delete value.parentId;
    }
    delete value.fatherRole;
    this.platAdminService.editSave(value, _that, (res) => {
      if (res.success == 1) {
        modal.hide();
        _that.commonService.growl(_that, 'success', '保存成功');
        _that.InitData();
        _that.editFormReset(_that.editForm, modal);
      } else if (res.success == -1) {
        if (res.code == 'PU04032') {
          _that.commonService.growl(_that, 'error', res.msg);
        }
      }
    })
  }

	/**
	 * 删除角色
	 */
  public delRole(row) {
    let _that = this;

    // 根节点
    if (row.children.length > 0) {
      //有子节点

      this.commonService.growl(_that, 'error', '该角色存在子节点，请先删除子节点！');
    } else if (row.children.length == 0) {
      //没有子节点
      this.confirmationService.confirm({
        message: '确定要删除该角色？',
        accept: () => {
          this.selectedPlatformRole = {};
          let body = {
            'objectId': row.data.id,
          }

          this.platAdminService.deleteRole(body, _that, (res) => {
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
          this.selectedPlatformRole = {};
        }
      })
    }

  }

	/**
	 * 授权
	 */
  public roleParentId: any;//父角色id值
  public empower(car: any) {
    this.isleft = true;
    // console.log(car);
    this.parentId = car.attributes.parentId;

    this.roleId = car.data.id;
    this.roleParentId = car.attributes.parentId;
    this.name = car.data.roleName;
    // 应用角色功能树
    this.getTreeRole(this.parentId, this.roleId);
    //子角色拥有的数据权限
    // this.getAppListByChildRole(car.data.id);
    //父角色拥有的数据权限
    // this.getAppListByParentRole(this.roleParentId);
  }

  /**
   * 获取角色 功能树
   */
  public funcIds: any;
  public treeDataIsTrue: boolean = false; //判断当功能树没有数据的时候，提示信息
  public getTreeRole(parentId, roleId) {
    this.treeDataIsTrue = false;
    let _that = this;
    this.platAdminService.getRoleTree(parentId, roleId, _that, (res) => {
      if (res.success == 1) {
        _that.roleTree = res.rows;
        if (_that.roleTree.length == 0) {
          _that.treeDataIsTrue = true;
        } else {
          _that.getAppListByParentRole(_that.roleParentId);
        }
        let newRoleTree = _that.commonService.parentCheckNode(_that.roleTree);
        // console.log(newRoleTree)
        let checkedList = _that.commonService.checkedNode(newRoleTree, []);
        // console.log(checkedList)
      } else if (res.success == -1) {

      }
    })

  }
  /**
   * 选中节点后
   * @param node 被选中的节点数据
   * @param event  被选中的节点事件
   */
  // public treeRootId: any;//功能树的根节点id
  public checkedNodeData: any; //被选中的节点数据
  public checkedNode(node, $event) {
    this.checkedNodeData = node;
    // let rootNode = node.treeModel.roots[0]; //根节点
    // this.treeRootId = rootNode.data.id; //根节点id
    this.commonService.check(node, $event);
  }

  /**
   * 获取角色数据 应用列表 子角色
   *  @param roleId 角色id
   */
  public getAppListByChildRole(roleId: any) {
    let _that = this;
    this.platAdminService.AppListByRole(roleId, _that, (res) => {
      if (res.success == 1) {
        this.appList = res.rows;
      }
    })
  }
  /**
 * 获取角色数据 应用列表  父角色
 *  @param roleId 角色id
 */
  public parentAppList: any; //父角色
  public parentAppCheckedList: any; //选中的父角色
  public getAppListByParentRole(roleId: any) {
    let _that = this;
    this.platAdminService.AppListByRole(roleId, _that, (res) => {
      if (res.success == 1) {
        _that.parentAppList = res.rows;
        _that.platAdminService.AppListByRole(_that.roleId, _that, (res) => {
          if (res.success == 1) {
            _that.appList = res.rows;
            _that.parentAppCheckedList = _that.getCheckedDataList(_that.parentAppList, _that.appList);
          }
        })
      }
    })
  }

  /**
   * 将子角色拥有的数据权限设置为默认选中状态
   *
   * @param parentList 父角色数据权限列表
   * @param childList 子角色数据权限列表
   * @returns parentList 被更改过的父角色数据列表
   */
  public getCheckedDataList(parentList, childList) {
    for (let item of parentList) {
      var parentItem = item;
      for (let childItem of childList) {
        if (childItem.objectId == item.objectId) {
          item['checked'] = true;

        }
      }
    }
    return parentList;
  }



  /**
   * 获取角色的数据权限id值
   */

  public getDataPrivilege() {
    this.appSelectList = '';
    let liList = this.checkList.nativeElement.children;
    for (let item of liList) {
      if (item.children[0].checked) {
        this.appSelectList = this.appSelectList + item.children[0].id + ',';
      }
    }
    return this.appSelectList.slice(0, -1);
  }
  /**
   * 保存角色 数据权限
   */
  public saveDataPrivi() {

  }

  /**
   * 授权 保存 角色
   * 功能和数据权限
   */
  public saveAssign() {
    let _that = this;
    // 功能权限
    // 获取功能权限id值
    if (this.checkedNodeData) {
      this.funcIds = this.commonService.getCheckedNodeIds().join(',');
      // console.log(this.funcIds);
      // this.funcIds = this.funcIds+',' + this.treeRootId;
      // console.log('check=================');
      // console.log(this.funcIds);
    } else {
      this.funcIds = this.commonService.getDefultCheckId(this.roleTree).join(',');
      // console.log('no check===============');
      // console.log(this.funcIds);
    }
    // 数据权限
    //数据权限id值
    let selectAppId = this.getDataPrivilege();
    let selectFuncsId = [];
    for (let item of this.funcIds.replace(/(^,+)|(,+$)/g, '').split(',')) {
      selectFuncsId.push({
        'funcId': item,
        'ruleId': '',
      })
    }
    let body = {
      privilege: selectFuncsId,
      roleId: this.roleId,
      parentId: this.parentId,
    }
    if (true) {  //数据权限id值不为空，有被选中的数据权限
      this.platAdminService.saveRoleDataPrivilege(_that, this.roleId, selectAppId, (res) => {
        if (res.success == 1) {
          _that.commonService.growl(_that, 'success', '保存成功');
          _that.InitData();
          _that.empowerCancle();
        } else if (res.success == -1) {
          _that.commonService.growl(_that, 'error', '可访问的数据保存失败');


        }
      })
    }


    //保存功能权限
    if (this.funcIds.replace(/(^,+)|(,+$)/g, '').length == 0) { //当将功能权限的值清空时
      let body = {
        roleId: this.roleId,
      }
      this.platAdminService.removeAssign(_that, body, (res) => {
        if (res.success == 1) {
          _that.commonService.growl(_that, 'success', '保存成功');
          _that.InitData();
          _that.empowerCancle();
        } else {
          _that.commonService.growl(_that, 'error', '功能权限保存失败');
        }

      })
      return;
    }
    if (this.roleTree.length != 0) {
      // 给角色分配功能权限
      this.platAdminService.roleAssign(_that, body, (res) => {
        if (res.success == 1) {
          _that.commonService.growl(_that, 'success', '保存成功');
          _that.InitData();
          _that.empowerCancle();
        } else if (res.success == -1) {
          _that.commonService.growl(_that, 'error', '功能权限保存失败');
        }
      })
    }
    this.empowerCancle();
  };

  /**
   * 授权侧边栏隐藏
   */
  public empowerCancle() {
    this.isleft = false;

  };

  /**
  * 成功的提示信息
  * @param rel 是否成功
  * @param msg 显示的信息
  */
  // public growl(rel: string, msg: string) {
  //   this.msgs = [];
  //   this.msgs.push({ severity: rel, summary: '', detail: msg })
  // }





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
            roleName: name,
            id: id,
            roleCode: attr.roleCode,
            description: attr.description,
            remark: attr.remark,
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

  // 配置组织机构树的参数
  treeOptions = {

    displayField: 'text',
    isExpandedField: 'expanded'
    // actionMapping: this.actionMapping,
  }



  /**
   * 登录超时
   */

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
