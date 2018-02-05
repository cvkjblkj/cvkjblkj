import { CommonService } from './../../../../../core/common-service/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { PlatAdminService } from './../../../shared/plat-admin.service';
import { UserDetailService } from './../shared/user-detail.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';


@Component({
  selector: 'detail-info',
  templateUrl: 'detail-info.component.html',
  styleUrls: ['./detail-info.component.css'],
})

export class DetailInfoComponent implements OnInit {
  public info: any = {}; //用户在企业中的信息
  public basicInfo: any = {}; //用户的基本信息
  public name: any; // 用户名字
  public userId: any; //用户的id值
  public orgId: any; //用户的id值
  public msgs: any;//成功提示
  public nodeTree: any; //组织机构树
  public button: any;//按钮权限的集合
  public isSysadmin: any;//是否是企业管理员
  constructor(
    private platAdminService: PlatAdminService,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    let body = this.route.snapshot.params;
    this.userId = body['id'];
    this.name = body['name'];
    this.button = JSON.parse(body['btn']);
    this.InitData();
  }

	/**
	 * 页面初始化时调用的数据
	 */
  public enterpriseId: any; //企业id
  public InitData() {
    let _that = this;
    // 在企业中的用户基本信息
    this.platAdminService.getUserDetail(this.userId, _that, (res) => {
      if (res.success == 1) {
        _that.info = res.rows[0];
        _that.enterpriseId = _that.info.enterpriseId;
        if (_that.info.isSysadmin == 0) {
          _that.isSysadmin = '否'
        }
        if (_that.info.isSysadmin == 1) {
          _that.isSysadmin = '是'
        }
        _that.statusPipe(_that.info);
        _that.commonService.growl(_that, 'success', '页面刷新成功');

      } else if (res.success == -1) { }
    })
    // 用户的基本信息
    this.platAdminService.getUserBasicInfo(this.userId, _that, (res) => {
      if (res.success == 1) {
        _that.basicInfo = res.rows[0];
        _that.statusPipe(_that.basicInfo);
        _that.commonService.growl(_that, 'success', '页面刷新成功');

      } else if (res.success == -1) { }
    });
  }

	/**
   * 用户状态输出值改变
   */
  public statusPipe(data: any) {
    switch (data['status']) {
      case -3:
        data['status'] = '已退出';
        break;
      case -2:
        data['status'] = '移除';
        break;
      case -1:
        data['status'] = "冻结";
        break;
      case 0:
        data['status'] = "未激活";
        break;
      case 1:
        data['status'] = "已激活";
    }
  }

	/**
	 * 获取组织机构树
	 */
  public orgTree() {
    let _that = this;
    this.platAdminService.orgTree(_that, (res) => {
      if (res.success == 1) {
        _that.nodeTree = res.rows;
      }
    })
  }


	/**
	 * 编辑信息弹窗
	 * @param modal 弹出框
	 */
  public basicInfoEdit: any;
  public editUser(modal: any) {
    modal.show();
    this.orgTree();
    let _that = this;
    this.platAdminService.getUserBasicInfo(this.userId, _that, (res) => {
      if (res.success == 1) {
        _that.basicInfoEdit = res.rows[0];
        _that.statusPipe(_that.basicInfo);
      } else if (res.success == -1) {
      }
    })
    _that.IsSame = {};
  }
	/**
 	* 下拉树  是否显示
 	*/
  public dropdownIsShow: boolean = false;
  public dropdown() {
    this.dropdownIsShow = !this.dropdownIsShow;

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
      this.platAdminService.isExitSame(_that, type, value, this.userId, (res) => {
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

	/**
	 * 选中 添加弹窗中的  tree 节点
	 * @param event 节点信息
	 */
  public userOrgName: any; //用户的组织机构名字；
  public orgSelectNode($event) {
    this.dropdownIsShow = false;;
    this.info.orgName = $event.node.data.text;
    this.orgId = $event.node.data.id;
  }

	/**
	 * 保存编辑信息
	 * @param modal 编辑弹窗
	 * @param form 编辑表单
	 */
  public saveEdit(modal: any, form: any) {
    let _that = this;
    form.value.objectId = this.userId;
    form.value.orgId = this.orgId ? this.orgId : this.info.orgId;
    form.value.enterpriseId = this.info.enterpriseId;
    delete form.value.orgName;

    this.platAdminService.saveUserEdit(form.value, _that, (res) => {
      if (res.success == 1) {
        _that.commonService.growl(_that, 'success', '更新用户信息成功');
        _that.InitData();
        modal.hide();
      } else if (res.success == -1) {
        _that.commonService.growl(_that, 'error', '更新用户信息失败');
      }
    })
  }

	/**
	 * 冻结用户
	 */
  public frozenUser() {
    let _that = this;
    this.confirmationService.confirm({
      message: '确认要冻结' + name + '吗？',
      accept: () => {
        let userId = this.userId;
        this.platAdminService.freezeUserFromEnterprise(userId, this.enterpriseId, _that, (res) => {
          if (res.success == 1) {
            _that.info.status == -1;
            _that.commonService.growl(_that, 'success', '用户已被冻结');
            _that.InitData();
          } else if (res.success == -1) {
            _that.commonService.growl(_that, 'error', '冻结失败');
          }
        })
      }
    })
  }


	/**
	 * 解冻用户
	 */
  public thaw() {
    let id = this.userId;
    let _that = this;
    this.platAdminService.unfreezeUserFromEnterprise(id, this.enterpriseId, _that, (res) => {
      if (res.success == 1) {
        _that.commonService.growl(_that, 'success', '用户已被解冻');
        _that.InitData();
      } else if (res.success == 1) { }
    })
  };
	/**
	 * 配置组织机构树的参数
	 */
  treeOptions = {

    displayField: 'text',
  };

}
