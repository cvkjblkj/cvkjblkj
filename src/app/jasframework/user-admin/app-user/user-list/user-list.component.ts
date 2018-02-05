import { CommonRequestService } from './../../../../core/common-service/common-request.service';
import { CommonService } from './../../../../core/common-service/common.service';
import { UserAdminService } from './../shared/user-admin.service';
import { ConfirmationService } from 'primeng/primeng';
import { PlatAdminService } from './../../../plat-admin/shared/plat-admin.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormsModule } from '@angular/forms';

import { EmailValidator, EqualPasswordsValidator } from './../../../../theme/validators';
import { MobileValidator, QQ_Validator, WechatValidator, PasswordValidator, UserNameValidator } from './../../../../theme/validators/mobile.validator';
import { MD5 } from './../../../../core/login/shared/md5.js';
@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],

})

export class UserListComponent implements OnInit {
  public enterpriseName: any = '';
  public userList: any;//用户列表数据
  public nodeTree: any; // tree数据
  public rows: any;// 列表数据
  public selectedPlatUser: any; //当前选中的记录
  public orgId: any;//组织机构id值
  public orgName: any;//组织机构名字
  public msgs: any; //成功提示信息
  public userMessage: any = {};
  public enterpriseId: any; // 企业id值
  public appId: any;// 应用id
  public appCode: any;//应用code
  public userId: any; // 用户id
  public roleTree: any; //角色授权树
  public userInfo: any; // 当前点击的用户信息
  //侧边栏是否显示
  public isleft: any = false;
  public dataId: any = []; //分配角色的id值
  // 当列表没有数据时显示
  public emptyMessage = "未查到相关数据";
  // 表单验证
  public form: FormGroup;
  public userName: AbstractControl;
  public mobileNum: AbstractControl;
  public password: AbstractControl;
  public repeatPassword: AbstractControl;
  public passwords: FormGroup;
  public position: AbstractControl
  public account: AbstractControl
  public age: AbstractControl
  public sex: AbstractControl
  public email: AbstractControl
  public weChat: AbstractControl
  public QQ: AbstractControl


  // 页容量
  public rowsPerPageOptions = ['10', '20', '30'];
  public pageSize: string = '10'; //页容量
  public pageNum: any = 1; //页码
  public maxSize: number = 5;
  public totalPages: any;  //总页数
  public size: any; // 当前页容量
  private totalItems: any; //总数据条数

  public submitted: boolean = false;
  public menuId: any; // 菜单id
  public button: any = {}; //按钮集合
  constructor(
    private platAdminService: PlatAdminService,
    private confirmationService: ConfirmationService,
    private userAdminService: UserAdminService,
    private commonService: CommonService,
    private route: Router,
    private router: ActivatedRoute,
    private commonRequestService: CommonRequestService,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      'userName': ['', Validators.compose([Validators.required, UserNameValidator.validate])],
      'mobileNum': ['', Validators.compose([Validators.required, MobileValidator.validate])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(6), PasswordValidator.validate])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(6), PasswordValidator.validate])]
      }, { validator: EqualPasswordsValidator.validate('password', 'repeatPassword') }),
      'orgName': ['', Validators.compose([Validators.required])],
      'position': ['', Validators.compose([])],
      'account': ['', Validators.compose([])],
      'age': ['', Validators.compose([])],
      'sex': ['', Validators.compose([])],
      'email': ['', Validators.compose([EmailValidator.validate])],
      'weChat': ['', Validators.compose([WechatValidator.validate])],
      'QQ': ['', Validators.compose([QQ_Validator.validate])],
    });

    this.userName = this.form.controls['userName'];
    this.email = this.form.controls['email'];
    this.mobileNum = this.form.controls['mobileNum'],
      this.passwords = <FormGroup>this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.orgName = this.form.controls['orgName'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
    this.position = this.form.controls['position'];
    this.account = this.form.controls['account'];
    this.age = this.form.controls['age'];
    this.sex = this.form.controls['sex'];
    this.weChat = this.form.controls['weChat'];
    this.QQ = this.form.controls['QQ'];

    this.form.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }

  ngOnInit() {
    //获取当前企业的信息
    let enpInfo = JSON.parse(window.localStorage.getItem('enpObj'));
    this.menuId = this.router.snapshot.queryParams['id'] ? this.router.snapshot.queryParams['id'] : this.router.snapshot.params['id'];
    this.button = window.localStorage['enpBtn'] ? JSON.parse(window.localStorage['enpBtn']) : this.getBtn();
    this.enterpriseId = enpInfo['enterpriseId'];
    this.appId = enpInfo['enterpriseAppId'];
    this.appCode = enpInfo['enterpriseAppCode'];
    this.orgTree();
  }
  /**
   * 获取用户列表数据 初始化数据
   * @Params 页码 页容量 当前组织机构id
   */
  public getUserList() {
    let _that = this;
    let params = {
      'enterpriseId': this.enterpriseId,
      'appId': this.appId,
      'appCode': this.appCode,
      'orgId': this.orgId,
      'pageNum': this.pageNum,
      'pageSize': this.pageSize
    };
    this.userAdminService.getUserList(params, _that, (res) => {
      if (res.success == 1) {
        _that.userList = res['rows'];
        _that.statusPipe(_that.userList)
        _that.totalItems = res["totalElements"];
        _that.size = res['size'];
        _that.totalPages = res['totalPages'];
        // 显示刷新成功
        _that.commonService.growl(_that, 'success', '用户刷新成功');
      } else if (res.success == -1) {
        _that.commonService.growl(_that, 'error', res.msg)
      }
    })
  }
	/**
	  * 获取初始化按钮数据
	  */
  public getBtn() {
    let _that = this;
    this.commonRequestService.getMenuBtn(this.menuId, _that, (res) => {
      if (res && res.success == 1) {
        _that.button = _that.commonService.viewBtn(res.rows);
        // return this.button;
      } else if (res.success == -1) { }
    }
    )
  }
	/**
	 * 获取组织机构树
	 */
  public orgTree(isModal?: boolean) {
    let params = {
      'enterpriseId': this.enterpriseId,
      'parentId': '',
    };
    let _that = this;
    this.userAdminService.getTree(params, _that, (res) => {
      if (res.success == 1) {
        _that.nodeTree = res.rows;
        _that.orgId = _that.nodeTree[0].id;
        _that.enterpriseName = _that.nodeTree[0].text;
        if (!isModal) { //如果是弹窗，那么不获取用户列表
          _that.getUserList();
        }
      } else if (res.success == -1) { }
    })
  }

	/**
    * 用户状态输出值改变
    */
  public statusPipe(data: any) {
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      switch (item['status']) {
        case -3:
        case '-3':
          item['status'] = '已退出';
          break;
        case '-2':
        case -2:
          item['status'] = '移除';
          break;
        case '-1':
        case -1:
          item['status'] = "冻结";
          break;
        case '0':
        case 0:
          item['status'] = "未激活";
          break;
        case '1':
        case 1:
          item['status'] = "已激活";
          break;
        default:
          item['status'] = "未知";
          break;
      }
    }
  }


	/**
	 * 配置组织机构树的参数
	 */
  treeOptions = {
    displayField: 'text',
    isExpandedField: 'expanded',
  }

	/**
	 * tree 选中节点 组织机构树
	 * @param event 选中节点信息
	 */
  public selectNode(event: any) {
    console.log(event);
    // 当选中组织机构节点时，添加弹窗中的值默认为此时选中的节点
    this.orgId = event.node.data.id;
    this.userOrgName = event.node.data.text;
    //节点不同时，得到的用户列表不一样
    this.getUserList();

  }

	/**
	 * 验证用户添加时的值
	 * @param type 验证类型
	 * @param value 验证值
	 */
  public IsSame: any = {};
  public checkIsExit(type: any, value: any, isRight?: any, IsEdit?: boolean) {
    let name = type;
    let _that = this;
    if (!isRight && value != '') {
      if (IsEdit) {
        this.platAdminService.isExitSame(_that, type, value, this.userId, (res) => {
          if (res.success == 1) {
            if (res.rows[0].isExist) {
              _that.IsSame[name] = true;

            } else if (!res.rows[0].isExist) {
              _that.IsSame[name] = false;
            }
          } else if (res.success == -1) { }
        })
      } else {
        this.platAdminService.isExitSame(_that, type, value, '', (res) => {
          if (res.success == 1) {
            if (res.rows[0].isExist) {
              _that.IsSame[name] = true;

            } else if (!res.rows[0].isExist) {
              _that.IsSame[name] = false;

            }
          } else if (res.success == -1) {

          }
        })
      }

    }
  }



	/**
	 * 添加用户
	 * @param modal 弹出框
	 */
  public addUser(modal: any) {
    this.orgTree(true);
    modal.show();
    this.IsSame = {};
  }
	/**
	 * 下拉树  是否显示
	 */
  public dropdownIsShow: boolean = false;
  public dropdown() {
    this.dropdownIsShow = !this.dropdownIsShow;

  }

	/**
	 * 选中 添加弹窗中的  tree 节点
	 * @param event节点信息
	 */
  public userOrgName: any; //用户的组织机构名字；
  public orgSelectNode($event) {
    this.dropdownIsShow = false;;
    this.userOrgName = $event.node.data.text;
    this.orgId = $event.node.data.id;
  }

	/**
	 * 添加 提交
     *
	 */
  public onUserAddSubmit(values: any, modal: any) {
    let _that = this;
    this.submitted = true;
    values.orgId = this.orgId;
    values.enterpriseId = this.enterpriseId;
    values.password = values.passwords.password;
    delete values.orgName;
    delete values.passwords;
    // 向后台传送数据
    this.userAdminService.saveUserAdd(values, this.appCode, _that, (res) => {
      if (res['success'] == 1) {
        modal.hide();
        _that.growl('success', '用户添加成功');
        _that.getUserList();
        _that.form.reset();
      } else if (res['success'] == -1) {
        _that.commonService.growl(_that, 'error', res.msg)
      }
    })
  }

  /**
   * 编辑
   * @param modal 编辑弹出框
   * @param row 当前编辑的信息
   */
  public edit(modal, row) {
    modal.show();
    console.log(row);
    this.IsSame = {};
    this.userMessage = row;
    this.userMessage.orgId = row.orgId;
    this.userId = row.objectId;
  }
  /**
   * 修改组织机构
   * @param event 选中的节点
   */
  public selected(event) {
    this.dropdownIsShow = false;
    this.userMessage.orgName = event.node.data.text;
    this.userMessage.orgId = event.node.data.id;
  }
  /**
   * 保存  编辑用户信息
   * @param modal 编辑弹窗
   */
  public saveEdit(modal, editform) {
    let _that = this;
    let value = editform.value;
    value.orgId = this.userMessage.orgId;
    value.objectId = this.userId;
    value.enterpriseId = this.enterpriseId;
    delete value.orgName;
    this.userAdminService.userEdit(value, _that, (res) => {
      if (res.success == 1) {
        _that.growl('success', '用户编辑成功');
        _that.getUserList();
        modal.hide();
      } else if (res.success == -1) {
        _that.growl('error', res.msg);
      }
      _that.formReset(modal);
    })
  }

	/**
	 * 授权
	 */
  public name: any //侧边栏授权 弹窗中显示的name
  public authority(row) {
    this.isleft = true;
    this.userId = row.objectId;
    this.name = row.userName;
    this.userInfo = row;
    this.getRoleTree();
  }
  /**
   * 获取应用角色
   */
  public getRoleTree() {
    let _that = this;
    this.userAdminService.getAppRole(this.appCode, this.appId, _that, (res) => {
      if (res.success == 1) {
        _that.roleTree = res.rows;
        // 当前用户拥有的角色
        let selectedRoleIdArr = this.userInfo.roleIds.split(',');
        for (let item of selectedRoleIdArr) {
          selectedRoleIdArr[item] = item;
        }
        this.setDefaultChecked(_that.roleTree, selectedRoleIdArr);
      } else if (res.success == -1) {
        _that.commonService.growl(_that, 'error', res.msg);
      }
    })
  }
  /**
   * 设置角色树的默认选中
   * 
   * @param {any} roleTreeData 
   * @param {any} selectedRoleId 
   * @returns 
   * @memberof UserListComponent
   */
  setDefaultChecked(roleTreeData, selectedRoleId) {
    for (let item of roleTreeData) {
      // 是当前用户已拥有的角色
      if (JSON.stringify(selectedRoleId) == '{}') return;
      if (item.id == selectedRoleId[item.id]) {
        item.checked = true;
        delete selectedRoleId[item.id]
      }
      if (item.children && item.children.length > 0) {
        this.setDefaultChecked(item.children, selectedRoleId)
      }

    }
  }
  /**
   * 获取角色树被选中的节点
   * 
   * @param {any} roleTreeData 角色树的数据
   * @param {any} rel  选中的节点数组
   * @returns 返回选中的节点数组
   * @memberof UserListComponent
   */
  getCheckedRole(roleTreeData, rel) {
    for (let item of roleTreeData) {
      if (item.checked) {
        rel.push(item.id);
      }
      if (item.children && item.children.length > 0) {
        console.log('children---');
        this.getCheckedRole(item.children, rel);
      }
    }
    return rel
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
    // this.commonService.check(node, $event);
  }

  /**
  * 分配角色 保存
  */
  public funcIds: any; //选中的节点id值
  public saveRoleAssign() {
    let _that = this;
    this.funcIds = this.getCheckedRole(this.roleTree, []).join(',');
    // if (this.checkedNodeData) {
    //   // this.funcIds = this.commonService.getCheckedNodeIds().join(',');
    //   // console.log('check=================');
    //   // console.log(this.funcIds);
    // } else {
    //   this.funcIds = this.userInfo;
    //   // this.funcIds = this.commonService.getDefultCheckId(this.nodeTree);
    //   // console.log('no check===============');
    //   // console.log(this.funcIds);
    // }



    let values = {
      userId: this.userId,
      // roleIds: this.funcIds.replace(/(^,+)|(,+$)/g, ''),
      roleIds: this.funcIds,
      enterpriseId: this.enterpriseId
    }
    this.userAdminService.assignRoles(values, this.appCode, _that, (res) => {
      if (res.success == 1) {
        _that.empowerCancle();
        _that.commonService.growl(_that, 'success', '角色保存成功');
        _that.getUserList();
      } else if (res.success == -1) { }
    })
  }

  /**
   * 隐藏侧边栏
   */
  public empowerCancle() {
    this.isleft = false;
  }

	/**
	 * 移除
	 */
  public delete(row) {
    let _that = this;
    this.userId = row.objectId;
    if (row.isSysadmin == 1) {
      this.growl('error', '该用户是企业管理员，不可移除！')
      // this.confirmationService.confirm({
      //   message: '该用户是企业管理员，不可移除！'
      // })
      return;
    }
    let body = {
      userIds: this.userId,
      enterpriseId: this.enterpriseId,
    }
    this.confirmationService.confirm({
      message: '确认要移除 ' + row.userName + ' 吗？',
      accept: () => {
        this.userAdminService.delete(body, this.appCode, _that, (res) => {
          if (res.success == 1) {
            _that.commonService.growl(_that, 'success', '用户移除成功');
            _that.getUserList();
          } else if (res.success == -1) {
            _that.commonService.growl(_that, 'error', res.msg);
          }
        })
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
    this.getUserList();
  }
	/**
	 * 页容量改变
	 * @param event 存放页容量
	 */
  public sizeChanged(event) {
    // console.log($event);
    this.pageSize = event;
    this.pageNum = 1; //页容量改变时，页码值为1
    this.getUserList();
  }

	/**
	 *   右边菜单显示
	*/

  @ViewChild('platformUserComponent') platformUserComponent; //当前组件
  translate() {
    //使右边菜单显示
    // let targetElement = this.platformUserComponent.nativeElement.offsetParent.children[0].children[0].children[0];
    let targetElement = this.platformUserComponent.nativeElement.offsetParent.offsetParent.children[0].children[0].children[0];
    console.log(targetElement);
    if (targetElement.className == 'modelRight') {  // 右边菜单 显示时
      targetElement.className = '';
    }
  }


  /**
   * 添加表单重置，隐藏
   * @param modal 弹出框 form 表单
   */
  public formReset(modal: any) {
    this.form.reset();
    modal.hide();
  }

	/**
	 * 验证信息
	 * @param data
	 */
  onValueChanged(data?: any) {
    if (!this.form) { return; }
    const form = this.form;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
  formErrors = {
    'userName': '',
    'mobileNum': '',
    'password': '',
    'orgName': '',
    'email': '',
    'QQ': '',
    'weChat': '',
  };
  validationMessages = {
    'userName': {
      'required': '用户姓名不能为空',
      'validateUserName': '请填写正确的姓名',
    },
    'mobileNum': {
      'required': '手机号不能为空',
      'validateMobile': '请填写正确的手机号',
    },
    'password': {
      'required': '密码不能为空',
      'minLength': '长度不低于6位',
      'validatepassword': '请填写正确的密码格式',
    },
    'orgName': {
      'required': '组织机构名称不能为空',
    },
    'email': {
      'validateEmail': '请填写正确的邮箱地址',
    },
    'QQ': {
      'validateQQ': '请填写正确的QQ号'
    },
    'weChat': {
      'validateWechat': '请填写正确的微信号'
    }
  };

	/**
	 * 提示信息
	 * @param rel 结果
	 * @param msg 显示信息
	 */
  public growl(rel: any, msg: any) {
    this.msgs = [];
    this.msgs.push({ severity: rel, summary: '', detail: msg })
  }


}
