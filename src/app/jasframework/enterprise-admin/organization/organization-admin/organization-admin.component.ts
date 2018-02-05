import { CommonRequestMethodService } from './../../../../core/common-service/request-method.service';
import { CHECKBOX_CONTROL_VALUE_ACCESSOR } from 'ng2-bootstrap/buttons/button-checkboxirective';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { EditorModule } from 'primeng';
import { Message } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { OrganizationAdmin } from './shared/organization-admin.model';
import { OrganizationAdminService } from './shared/organization-admin.service';
import { CommonRequestService } from './../../../../core/common-service/common-request.service'
import { CommonService } from './../../../../core/common-service/common.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
@Component({
  selector: 'organization-admin',
  templateUrl: 'organization-admin.component.html',
  styleUrls: ['./organization-admin.component.css'],
  providers: [
    OrganizationAdminService,
    ConfirmationService,
    CommonService,
    CommonRequestService,
    CommonRequestMethodService
  ]
})

export class OrganizationAdminComponent implements OnInit {
  public model = new OrganizationAdmin();
  public organizationTree: any; //接收组织机构树的数据
  public enterpriseList: any; // 接收公司列表的数据
  public objectId: any; // 选中的组织机构的id值
  public selectedNode: any = {}; // 选中的节点
  public enterpriseId: any; // 企业id值
  public orgMessage: any; // 组织机构的详细信息
  public manager: any;  // 部门负责人id
  public dropDownTree: any; //下拉树 数据
  public isSelectNode: boolean; //是否选中节点
  public parentName: any; // 选中父部门的名字
  public mesDisplay: boolean = false; //操作提示框  是否显示
  public message: string;  // 操作提示框 内的提示信息
  public orgName: any;  //组织机构名字
  public parentId: any;  //组织机构父部门id
  public telephoneNum: any; //部门电话
  public description: any; //部门描述
  public remark: any; //备注
  public disabled: boolean = true;
  public Modal: any; //获取点击时的数据
  public msgs: any;//操作提示
  public orgId: any;//id值
  public isExistRel: boolean = true;//提示框状态
  public isExistMes: string;//提示框状态
  public button: any = {};//button
  public menuId: any //菜单id
  public telephoneMismatch: boolean = false; //电话号码不匹配 false:匹配
  constructor(private organizationAdminService: OrganizationAdminService,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private commonRequestService: CommonRequestService,
    private router: Router,
    public route: ActivatedRoute) {
  };
  ngOnInit() {
    if (!localStorage.getItem('enpObj')) {
      return;
    } else if (localStorage.getItem('enpObj')) {
      let enpObj = localStorage.getItem('enpObj');
      this.enterpriseId = JSON.parse(enpObj).enterpriseId;
    }
    /*拿到按钮值*/
    if (!localStorage.getItem('enpBtn')) {
      return;
    } else if (localStorage.getItem('enpBtn')) {
      let menu = localStorage.getItem('enpBtn');
      this.button = JSON.parse(menu);
    }
    this.getTreeTable(this.enterpriseId);

  };

  /**
  * @param enterpriseId
* 获取treeTable的数据
*/
  getTreeTable(enterpriseId: any) {
    let _that = this;
    let url = '/organization/getTree';
    let params = {
      enterpriseId: enterpriseId
    };
    _that.organizationAdminService.getTree(url, params, _that, function (trees) {
      _that.organizationTree = trees['rows'];
      _that.changeData(_that.organizationTree);
      _that.message = _that.organizationTree[0].data.name;
      _that.growl('success', '页面刷新成功');
    })
    _that.getBtn();
  };

  /*页面初始化按钮数据*/
  public getBtn() {
    let _that = this ;
    this.commonRequestService.getMenuBtn(this.menuId, _that, (res) => {
      if(res.success == 1) {
        _that.button = _that.commonService.viewBtn(res.rows);
        window.localStorage.setItem('appBtn', JSON.stringify(_that.button));
      }
    });
  };

  /**
  * @param array
   * 改变数据结构 treeTable,
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
            description: attr.description,
            createUserName: attr.createUserName,
            createTime: attr.createTime,
            remark: attr.remark
          },
          'attributes': attr,
          'children': children,
          'expanded': true,
        };
        array[i] = datas;
        if (children.length >= 1) {
          this.changeData(children);
        };
      }
    }
  };

  /**
   * 改变dropdowntree 数据结构 tree
   */
  changeDropDownData(arr: any) {
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
        };
        arr[i] = datas;
        if (children.length >= 1) {
          this.changeDropDownData(children);
        };
      };
    }
  };

  /**
   * 确认提示框
   * 当用户选中一条记录
   * @param Modal
   * @param modal
   */
  public Id: any; //
  confirmFun(Modal: any, modal: any) {
    this.objectId = Modal.data.id;
    modal.show();
    // 获取当前组织机构的信息
    let _that = this;
    let url = '/organization/getById';
    let params = {
      objectId: _that.objectId
    };
    _that.organizationAdminService.getOrganizationMes(url, params, _that, function (res) {
      _that.orgMessage = res['rows'][0];
      if (!Modal.parent) {
        _that.parentId = '';
      } else {
        _that.parentName = Modal.parent.data.name;
        _that.parentId = Modal.parent.data.id;
      }
    });
  };
  /**@param enterpriseId
 * 获取dropdownTree的数据
   */
  getDropDownTree(enterpriseId: any) {
    let _that = this;
    let url = '/organization/getTree';
    let params = {
      enterpriseId: enterpriseId
    };
    _that.organizationAdminService.getTree(url, params, _that, function (trees) {
      _that.dropDownTree = trees['rows'];
      _that.changeDropDownData(_that.dropDownTree);
    })
  };
  /**
   * @param Id
   */
  getDropTree(Id: any) {
    let _that = this;
    let url = '/organization/getTree';
    let params = {
      enterpriseId: _that.enterpriseId
    };
    _that.organizationAdminService.getTree(url, params, _that, function (trees) {
      if (trees.success == 1) {
        _that.dropDownTree = trees['rows'];

        _that.changeDropDownData(_that.dropDownTree);
        if (Id) {
          _that.commonService.removeChidNode(_that.dropDownTree, Id);
        }
      };
    })
  };

  /**
  * @param modal
  @param viewmodal
   * 点击查看
   */
  look(modal: any, viewmodal: any) {
    this.confirmFun(modal, viewmodal);
  };

  /**
  * @param Modal
   * 删除按钮
   */
  delete(Modal) {
    let _that = this;
    let url = '/organization/delete';
    let params = {
      objectId: Modal.data.id
    };
    _that.selectedNode = {};
    _that.objectId = Modal.data.id;
    if (Modal.children.length > 0) {
      this.growl('error', '该节点存在子节点，请先删除子节点');
    } else if (Modal.children.length == 0) {
      this.confirmationService.confirm({
        message: '您确定要删除吗？',
        accept: () => {
          _that.organizationAdminService.delete(_that, url, params, (res) => {
            _that.selectedNode = {};
            if (res['success'] == 1 && res['rows'][0]['booleanResult']) {
              //操作提示框显示
              _that.growl('success', '删除成功');
              _that.getTreeTable(_that.enterpriseId)
            } else if (res['success'] == -1) {
              _that.mesDisplay = true;
              switch (res['code']) {
                case 'PU02020':
                  _that.growl('error', res.msg);
                  break;
                case 'PU02021':
                  _that.growl('error', res.msg);
                  break;
              }
            };
          })
        }
      })
    }


  };

  /**
   * @param ele
   * 父部门的下拉树 是否显示
   */
  isShow(ele: any) {
    if (ele.style.display == 'inline-block') {
      ele.style.display = 'none';
    } else {
      ele.style.display = 'inline-block';
    }
  };

  /**
   * @param addModal
    *@param  orgform
   表单数据重置 */
  hiden(addModal: any, orgform: any) {
    orgform.reset();
    addModal.hide();
    this.isExistRel = true;
    this.telephoneMismatch = false;
    this.model.parentId = ''
  };
  /**
   * @param editModal
   */
  hide(editModal: any, ) {
    editModal.hide();
    this.isExistRel = true;

  };
  /**添加弹出框下拉选中数据
   * @param event
   * @param dropdowntree
   */
  addDropDownSelect(event, dropdowntree) {
    this.model.parentId = event.node.id;
    this.parentName = event.node.label;
    dropdowntree.style.display = "none";
    this.isExist(this.model.orgName, this.enterpriseId, this.model.parentId, this.orgId)
  };
  /**
   *添加弹出框
    @param addModal
   */
  add(addModal: any) {
    addModal.show();
    /*组织机构下拉树 获取dropdownTree的数据*/
    this.getDropDownTree(this.enterpriseId);
    if (this.selectedNode.data) {
      this.parentName = this.selectedNode.data.name
      this.model.parentId = this.selectedNode.data.id;
    };
  };
  /**
   *保存
    @param addModal
    @param form
   */
  addSave(addModal: any, form: any) {
    let _that = this;
    let url = '/organization/add';
    let params = {
      parentId: _that.model.parentId,
      enterpriseId: _that.enterpriseId,
      orgName: _that.model.orgName,
      manager: _that.manager,
      telephoneNum: _that.model.telephoneNum,
      description: _that.model.description,
      remark: _that.remark
    }
    this.disabled = true;
    _that.organizationAdminService.addSave(_that, url, params, (res) => {
      if (res['success'] && res['success'] == 1) {

        _that.growl('success', '添加成功');
        form.reset();
        addModal.hide();
        _that.parentId = '';
        _that.disabled = false;
        // 重新刷新treetable数据
        _that.isExistRel;
        _that.getTreeTable(_that.enterpriseId);
      } else if (res['success'] && res['success'] == -1) {
        _that.mesDisplay = true;
        _that.disabled = true;
        switch (res['code']) {
          case 'PU02010':
            _that.growl('error', res.msg);
            break;
        }
      };
    })
  };


  public parentIdIsExit: boolean = true; //判断编辑父级角色是否显示;
  /**
   * 修改按钮
 *@param Modal
 *@param editModal
   */

  edit(Modal: any, editModal: any) {
    this.Id = Modal.data.id
    if (Modal.parent == null) {
      this.parentIdIsExit = false;
    } else {
      this.parentIdIsExit = true;
      this.getDropTree(this.Id);
    };
    this.Modal = Modal;
    this.confirmFun(Modal, editModal);
  };
  /**
   * 修改保存
   * @param editModal
   */
  editSave(editModal: any) {
    let _that = this;
    let url = '/organization/update';
    let params = {
      objectId: _that.objectId,
      orgName: _that.orgMessage.orgName,
      parentId: _that.orgMessage.parentId,
      manager: _that.orgMessage.manager,
      remark: _that.orgMessage.remark,
      description: _that.orgMessage.description,
      telephoneNum: _that.orgMessage.telephoneNum,
      opened: _that.orgMessage.opened
    };
    _that.disabled = true;
    if (!_that.orgMessage.parentId) {
      _that.orgMessage.parentId = '';
    };
    _that.organizationAdminService.updateSave(_that, url, params, (res) => {
      if (res['success'] == 1) {
        _that.growl('success', '修改成功');
        editModal.hide();
        _that.getTreeTable(_that.enterpriseId);
        _that.disabled = true;
      } else if (res['success'] == -1) {
        switch (res['code']) {
          case 'PU02030':
            _that.growl('error', res.msg);
            break;
          case 'PU02010':
            _that.growl('error', res.msg);
            break;
        }
      };
    });
  };
  /**下拉树 选中的数据
   * @param event
   * @param dropDownSelect
   */
  dropDownSelect(event, dropDownSelect) {
    this.orgMessage.parentId = event.node.id;
    this.parentName = event.node.label;
    this.objectId = this.Modal.data.id;
    this.disabled = false;
    dropDownSelect.style.display = "none";
  };
  /**
   *
   * @param event
   */
  TreeTableSelect(event) {
    this.orgId = event.node.data.id;
  };
  /*部门名称校验*/
  /**
   * @param orgName
   * @param enterpriseId
   * @param parentId
   * @param orgId
   */
  public isEixtShow: boolean = false; //保存按钮是否可用
  isExist(orgName: any, enterpriseId: any, parentId: any, orgId: any) {
    if (!orgName) {
      return;
    };
    if (!this.parentId) {
      this.parentId = '';
    };
    let _that = this;
    let url = '/organization/checkOrgName';
    let params = {
      orgName: orgName,
      enterpriseId: enterpriseId,
      parentId: parentId
    };
    _that.organizationAdminService.isExist(url, params, _that, function (res) {
      _that.isExistRel = true;
      if (res['success'] == 1 && res['rows']) {
        let rel = res['rows'][0];
        if (rel['isExist']) {
          _that.isEixtShow = true;
          _that.isExistRel = false;
          _that.isExistMes = "部门名称已经存在";
        } else if (!rel['isExist']) {
          _that.isEixtShow = false;
        }
      }
    });
  };

  public loginTimeOut() {
    this.confirmationService.confirm({
      message: '登录超时，请重新登录',
      accept: () => {
        this.router.navigate(['./login']);
        window.localStorage.clear();
      },
      reject: () => {
        this.router.navigate(['./login']);
        window.localStorage.clear();
      }

    })
  };

  /*电话号码验证
   * 参数:
   *      telephone:电话号码   类型字符串
   *
   * */
  telephoneVerification(telephone: string) {
    if (telephone == '' || telephone == undefined) {
      this.telephoneMismatch = false;
      return;
    };
    let reg = /^((\d{3,4}-)?\d{7,8})$|^1\d{10}$/;
    if (reg.test(telephone.toString())) {
      this.telephoneMismatch = false;

    } else {
      this.telephoneMismatch = true;

    };
  };
  public growl(rel: string, res: string) {
    this.msgs = [];
    this.msgs.push({ severity: rel, summary: '', detail: res });
  };
}
