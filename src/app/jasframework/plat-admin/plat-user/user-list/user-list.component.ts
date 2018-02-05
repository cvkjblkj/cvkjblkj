import { INCONFIG } from './../../../../core/global';
import { CommonRequestMethodService } from './../../../../core/common-service/request-method.service';
import { FooterColumnGroup } from 'primeng';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { CommonRequestService } from './../../../../core/common-service/common-request.service';
import { CommonService } from './../../../../core/common-service/common.service';
import { ConfirmationService } from 'primeng/primeng';
import { PlatAdminService } from './../../shared/plat-admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { EmailValidator, EqualPasswordsValidator } from './../../../../theme/validators';
import { MobileValidator, QQ_Validator, WechatValidator, PasswordValidator, UserNameValidator } from './../../../../theme/validators/mobile.validator';

import { IActionMapping, KEYS, TREE_ACTIONS, TreeNode } from 'angular2-tree-component';
import { MD5 } from './../../../../core/login/shared/md5.js';
@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [PlatAdminService, ConfirmationService, CommonService, CommonRequestService, CommonRequestMethodService]
})

export class UserListComponent implements OnInit {
  public userList: any;//用户列表数据
  public nodeTree: any; // tree数据
  public rows: any;// 列表数据
  public selectedPlatUser: any; //当前选中的记录
  public orgId: any;//组织机构id值
  public orgName: any;//组织机构名字
  public msgs: any; //成功提示信息
  public appCode = 'PaasCloud';//paas平台的应用标识
  public enterpriseId: any = window.localStorage['enterpriseId'];//企业id值
  public appId = '871e16bc-6e21-47fc-b358-47b9494179ff'; //应用id值
  public dataId: any = []; //选中的权限id值;
  public isLeft: boolean = false; //授权侧边栏是否显示
  public userId: any;//用户id值
  public menuId: any; // 菜单id值
  public button: any = {}; // btn的对象集合
  public roleTree: any; //功能树的数据
  public InitFuncId: any = []; //初始化的权限id值
  public funcIds: any = ''; //权限id值
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
  public sortF = "createTime";
  public sortO = -1;
  public orderName: any = "create_time desc"; // 列表中排序名称


  public submitted: boolean = false;
  constructor(
    private platAdminService: PlatAdminService,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private commonRequestService: CommonRequestService,
    private route: Router,
    private router: ActivatedRoute,
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

    this.menuId = this.router.snapshot.queryParams['id'] ? this.router.snapshot.queryParams['id'] : this.router.snapshot.params['id'];


    this.orgTree();
  }
	/**
	 * 获取用户列表数据
	 * 参数 页码 页容量 当前组织机构id
	 */
  public getUserList() {
    let _that = this;
    let params = {
      'enterpriseId': INCONFIG.enterpriseId,
      'orgId': this.orgId,
      'pageNum': this.pageNum,
      'pageSize': this.pageSize,
      'orderBy': this.orderName
    };
    this.platAdminService.getUserList(params, _that, (res) => {
      if (res.success == 1) {
        _that.userList = res['rows'];
        _that.statusPipe(_that.userList)
        _that.totalItems = res["totalElements"];
        _that.size = res['size'];
        _that.totalPages = res['totalPages'];
        _that.getBtn();
        // 显示刷新成功
        _that.commonService.growl(_that, 'success', '用户刷新成功');
      }
    })
  }

	/**
	 * 获取组织机构树
	 */
  public orgTree() {
    let _that = this;
    this.platAdminService.orgTree(_that, (res) => {
      if (res.success == 1) {
        _that.nodeTree = res.rows;
        _that.defaultCheckedTree(_that.nodeTree);
        _that.orgId = _that.nodeTree[0].id;
        _that.getUserList()
      } else if (res.success == -1) {
      }
    })
  }


	/**
	  * 获取初始化按钮数据
	  */
  public getBtn() {
    let _that = this;
    this.commonRequestService.getMenuBtn(this.menuId, _that, (res) => {
      if (res.success == 1) {
        _that.button = _that.commonService.viewBtn(res.rows);

        // _that.btnList = res.rows;
        // this.getBtnList(this.btnList);
        // //console.log(this.btnObj);
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
          item['status'] = '已退出';
          break;
        case -2:
          item['status'] = '移除';
          break;
        case -1:
          item['status'] = "冻结";
          break;
        case 0:
          item['status'] = "未激活";
          break;
        case 1:
          item['status'] = "已激活";
      }
    }
  }


	/**
	 * 配置组织机构树的参数
	 */
  treeOptions = {
    displayField: 'text',
  }

	/**
	 * tree 选中节点 组织机构
	 * @param event 选中节点信息
	 */
  public selectNode(event: any) {
    this.orgId = event.node.data.id;
    this.userOrgName = event.node.data.text;
    //节点不同时，得到的用户列表不一样
    this.getUserList();

  };
	/**
	 * 添加用户
	 * @param modal 弹出框
	 */
  public addUser(modal: any) {

    modal.show();
    this.IsSame = {};
  };

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
	 * 验证用户添加时的值
	 * @param type 验证类型
	 * @param value 验证值
	 */
  public IsSame: any = {};
  public checkIsExit(type: any, value: any, isRight?: any) {
    let name = type;
    let _that = this;
    if (!isRight && value != '') {
      this.platAdminService.isExitSame(_that, type, value, '', (res) => {
        if (res.success == 1) {
          if (res.rows[0].isExist) {
            _that.IsSame[name] = true;
          } else if (!res.rows[0].isExist) {
            _that.IsSame[name] = false;
          }
        }

      })
    }
  }


	/**
	 * 添加 提交
	 */
  public onSubmit(values: any, modal: any) {
    let _that = this;
    this.submitted = true;
    delete values.repeatPassword;
    if (this.form.valid) {
      values.password = values.passwords.password;
      delete values.passwords;
      delete values.orgName;
      values.orgId = this.orgId;
      values.enterpriseId = this.enterpriseId;
      values.appCode = this.appCode;
    }
    // 向后台传送数据
    this.platAdminService.saveUserAdd(values, _that, (res) => {
      if (res['success'] == 1) {
        _that.commonService.growl(_that, 'success', '用户添加成功');
        modal.hide();
        _that.formReset(modal);
        _that.getUserList();
      } else if (res['success'] == -1) {
        // 提示信息

      }
    })
  }
  /**
   * 添加表单重置，弹窗消失
   * @param modal 弹窗
   * @returns viod
   */
  public formReset(modal: any) {
    this.form.reset();
    modal.hide();
  }



	/**
	 * 授权
	 * 跳转页面
	 */

  public name: any; //用户名字
  public authority(car) {
    // //console.log(car)
    this.isLeft = true;
    this.name = car.userName;
    this.userId = car.objectId;
    this.enterpriseId = car.enterpriseId;
    //默认选中的角色id
    this.funcIds = car.roleIds;
    this.dataId = [];
    //获取角色树
    this.getPriTree();
    // this.translate();
    // this.route.navigate([`/cloudlink/jas/plat-admin/plat-user/detail/roleAssign`, { id: car.objectId, name: car.userName }])
  }




	/**
	 * 获取角色树
	 * 给用户分配权限
	 *
	 */


  public getPriTree() {
    let _that = this;
    this.platAdminService.getRoleList(this.appId, this.appCode, _that, (res) => {
      if (res.success == 1) {
        _that.roleTree = res.rows;
        _that.defaultCheckedTree(this.roleTree)
        // let newRoleTree = this.commonService.parentCheckNode(this.roleTree);
        // //console.log(newRoleTree)
        // let checkedList = this.commonService.checkedNode(newRoleTree, []);
        // //console.log(checkedList)
      } else if (res.success == -1) {
      };
    })


  }
  /**
   * 使节点可以默认选中
   * @param treeArr 数组
   */
  public checkDefaultId: any; //默认选中的节点id
  public defaultCheckedTree(treeArr: any) {
    this.checkDefaultId = '';
    for (let item of treeArr) {
      let roleId = item.id;
      item.isExpanded = true;
      if (this.funcIds && this.funcIds.indexOf(roleId) != -1) {
        item.checked = true;
        this.checkDefaultId = roleId + ',' + this.checkDefaultId;
      }
      if (item.children.length > 0) {
        this.defaultCheckedTree(item.children)
      }
    }
  }


	/**
	 * 授权侧边栏隐藏
	 */
  public empowerCancle() {
    this.isLeft = false;
  }

	/**
 * 选中节点后
 * @param node 被选中的节点数据
 * @param event  被选中的节点事件
 */
  public treeRootId: any;//功能树的根节点id
  public checkedNodeData: any; //被选中的节点数据
  public checkedNode(node, $event) {
    this.checkedNodeData = node;
    //console.log(node);
    //console.log($event);
    if ($event.target.checked) {
      this.checkedNodeData.data.checked = true;
      // this.funcIds = node.data.id + ',' + this.funcIds;

    } else if (!$event.target.checked) {
      this.checkedNodeData.data.checked = false;
    }
    //console.log(this.checkedNodeData.treeModel.roots);
  }
  /**
   * 获取被选中的节点id值
   * @param arr 功能tree数据
   * @param activedList 返回值：
   */
  public getCheckedNodeId(arr: Array<any>, activedList: Array<any>) {

    for (let item of arr) { //遍历children
      //console.log('item');
      //console.log(item);
      if (item.data.checked) {
        activedList.push(item.data.id);
      }
      if (item.data.children.length > 0) {
        this.getCheckedNodeId(item.children, activedList);
      }
    }
    return activedList;
  }



	/**
	 * 保存分配的角色
	 */
  public saveAssign() {
    let _that = this;
    if (!this.checkedNodeData) {
      this.funcIds = this.checkDefaultId.replace('/^,|,$/', '');
    } else {
      var node = this.checkedNodeData.treeModel.roots;
      var checkedIdArr = this.getCheckedNodeId(node, []);
      this.funcIds = checkedIdArr.join(',');
    }

    // console.log(this.funcIds);
    let body = {
      roleIds: this.funcIds,
      userId: this.userId,
      enterpriseId: this.enterpriseId,
    };

    if (this.funcIds.replace(/(^s*)|(s*$)/g, "").length == 0) {
      //角色id为空时，移除用户在企业中拥有的角色
      this.platAdminService.removeRole(body, _that, (res) => {
        if (res.success == 1) {
          _that.commonService.growl(_that, 'success', '移除成功');
          _that.empowerCancle();
          _that.getUserList();
        } else if (res.success == -1) {
          _that.commonService.growl(_that, 'error', '移除失败');
          _that.getPriTree();
        }
      })
      return;
    }

    this.platAdminService.userAssign(body, _that, (res) => {
      if (res.success == 1) {
        _that.commonService.growl(_that, 'success', '保存成功');
        _that.empowerCancle();
        _that.getUserList();
      } else if (res.success == -1) {
        _that.commonService.growl(_that, 'error', '保存失败');
        _that.getPriTree();
      }
    })
  }

	/**
	 * 移除
	 */
  public delete(row) {
    let _that = this;
    if (row.isSysadmin == 1) {
      this.commonService.growl(_that, 'warn', '该用户为企业管理员，不能删除');
      return;
    }
    let userId = row.objectId;
    this.confirmationService.confirm({
      message: '确认要移除 ' + row.userName + ' 吗？',
      accept: () => {
        this.platAdminService.delUser(userId, _that, (res) => {
          if (res.success == 1) {
            _that.commonService.growl(_that, 'success', '用户移除成功');
            _that.getUserList();
          } else if (res.success == -1) {
            _that.commonService.growl(_that, 'error', '用户移除失败');

          }
        })
      }
    })
  }

	/**
	 * 管理
	 * 跳转页面
	 */
  public manage(car) {
    // //console.log('管理');
    this.translate();
    this.route.navigate([`/jas/plat-admin/plat-user/detail/info`, { id: car.objectId, name: car.userName, btn: JSON.stringify(this.button) }])
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
    // //console.log($event);
    this.pageSize = event;
    this.pageNum = 1; //页容量改变时，页码值为1
    this.getUserList();
  }

  /**
     * 将列表排序
     * 
     * @param {any} e 
     * @memberof LoginJournalComponent
     */
  changeSort(e) {
    let order;
    let orderField
    if (e.order == 1) {
      order = 'asc';
      // 正序
    } else if (e.order == -1) {
      // 倒序
      order = 'desc';
    }
    if (e.field.match(/[A-Z]/g)) {
      // 有大写
      let upperString = e.field.match(/[A-Z]/g).join(",");
      orderField = e.field.replace(/[A-Z]/g, "_" + upperString.toLowerCase());
    } else {
      // 全部小写
      orderField = e.field;
    }

    this.orderName = orderField + " " + order;
    this.getUserList();
  }




	/**
	 *   右边菜单显示
	*/
  //当前组件
  @ViewChild('platformUserComponent') platformUserComponent;
  public translate() {
    //使右边菜单显示;
    let targetElement = this.platformUserComponent.nativeElement.offsetParent.offsetParent.children[0].children[0].children[0];
    if (targetElement.className == 'modelRight') {
      // 右边菜单 显示时
      targetElement.className = '';
    };
  };
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
        // //console.log('control');
        // //console.log(control);

        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          // //console.log('control.errors');
          // //console.log(control.errors);
          // //console.log('messages');
          // //console.log(messages);
          this.formErrors[field] += messages[key] + ' ';
          // //console.log('errors');
          // //console.log(this.formErrors);
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






}
