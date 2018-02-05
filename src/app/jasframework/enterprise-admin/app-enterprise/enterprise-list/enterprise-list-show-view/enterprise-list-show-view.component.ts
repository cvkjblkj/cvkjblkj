import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';

import { AppEnterpriseService } from './../../shared/app-enterprise.service';
import { AppEnterprise } from './../../shared/app-enterprise.model';
import { EnterpriseAppInfo } from './../../shared/app-enterprise.model';

@Component({
  selector: 'enterprise-list-show',
  templateUrl: './enterprise-list-show-view.component.html',
  styleUrls: ['./enterprise-list-show-view.component.css'],

})

export class EnterpriseListShowViewComponent implements OnInit {
  model = new AppEnterprise();
  private detail: AppEnterprise;
  private editInfo: AppEnterprise;
  rows: AppEnterprise;
  public enterpriseAppInfos: EnterpriseAppInfo[];     //企业下应用信息列表

  public enpObjectId: any;  //当前企业的id值
  private fileId: string;  //图片的ID
  private imgUrl: string;
  private arg: string;
  private bussinessUrl: Array<Object>;
  private cardUrl: Array<Object>;

  public userName: any; // 管理员的姓名
  public mobileNum: any; // 管理员账号

  public msgs: any; // 成功之后的提示信息

  public objId: any; //企业ID, 应用ID
  public button: any = {}; //按钮权限数据
  public enpNameIsExist: boolean = false; //企业名字是否已经存在
  public telephoneMismatch: boolean = false; //电话号码不匹配 false:匹配
  public emptyMessage: string = '未查到相关数据'; //primeng dataTable没有数据时，显示的内容

  constructor(private enterpriseAdminService: AppEnterpriseService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.objId = JSON.parse(window.localStorage.getItem('enpObj'));
    this.button = JSON.parse(window.localStorage.getItem('enpBtn'));
    this.enpObjectId = this.objId.enterpriseId;
    this.getEnterpriseAppInfo();
    let that = this;
    this.enterpriseAdminService.getMessageDetail(this.enpObjectId, that, detail => {
      that.detail = detail["rows"][0];
      if (that.detail['enterpriseType'] == 1) {
        that.detail['enterpriseType'] = '正式';
      } else if (that.detail['enterpriseType'] == 0) {
        that.detail['enterpriseType'] = '测试';
      }
      //创建人的id值
      let enpAdmin = that.detail['enpAdmin'];
      if (enpAdmin == null) {
        return;
      }
      //获取创建人的账号
      that.enterpriseAdminService.getCreatUser('', enpAdmin).then(
        (res) => {
          if (res.success == 1) {
            that.userName = res['rows'][0]['userName'];
            that.mobileNum = res['rows'][0]['mobileNum'];
          }
        }
      )
    });
  }

  //得到企业下应用信息
  getEnterpriseAppInfo(): void {
    let that = this;
    this.enterpriseAdminService.getEnterpriseAppList(this.objId.enterpriseId, this.objId.enterpriseAppId,
      that, result => {
        if (result['success'] && result['success'] == 1) {
          that.enterpriseAppInfos = result['rows'];
          that.switchAppStatus(that.enterpriseAppInfos)
        }
      })
  }

  /*应用状态从数字转到到字符串汉字
   * 1 : '已激活'
   * -1 : '已冻结'
   * 其他 : '未知状态'
   * */
  switchAppStatus(data: any) {
    for (let i = 0; i < data.length; i++) {
      var item = data[i];
      if (item.useType == 1) {
        item.useType = '协议';
      } else if (item.useType == 0) {
        item.useType = '试用';
      }
      switch (item['enpAppStatus']) {
        case 1:
          item['enpAppStatus'] = '已激活';
          break;
        case '1':
          item['enpAppStatus'] = '已激活';
          break;
        case -1:
          item['enpAppStatus'] = '已冻结';
          break;
        case '-1':
          item['enpAppStatus'] = '已冻结';
          break;
        default:
          item['enpAppStatus'] = '未知状态';
          break;

      }
    }
  }


  //编辑企业信息
  edit(editModal: any, record: any): void {
    this.enpNameIsExist = false;      //打开编辑信息弹窗时,关闭"企业名称已存在"信息提示
    this.telephoneMismatch = false;   //打开编辑信息弹窗时,关闭"电话号码格式错误信息"
    let that = this;
    this.enterpriseAdminService.getMessageDetail(this.enpObjectId, that, detail => {
      that.editInfo = detail["rows"][0];
    });
    this.confirmFun(editModal);
  }

  /**
   * 确认提示框
   */
  confirmFun(modal: any) {
    //弹出框显示
    modal.show();
  }

  /**
   * 修改
   * 点击保存
   */
  editSaveEnterPriseInfo(modal: any) {
    let data = {
      "enterpriseName": this.editInfo.enterpriseName,
      "objectId": this.editInfo.objectId,
      "enterpriseScale": this.editInfo.enterpriseScale,
      "registerNum": this.editInfo.registerNum,
      "address": this.editInfo.address,
      "telephoneNum": this.editInfo.telephoneNum,
      "remark": this.editInfo.remark,
    };
    let that = this;
    this.enterpriseAdminService.update(data, that, res => {
      if (res['success'] && res['success'] == 1) {
        // 操作成功之后，提示出现
        modal.hide();
        that.growl('success', '企业信息修改成功');
        that.ngOnInit();
      } else if (res['success'] && res['success'] == -1) {
        this.growl('error', '保存失败')
      }
    });
  }

  /*检查企业名称是否重复
   *参数:
   * name: 企业名称
   * enterpriseId: 企业ID
   * */
  checkEnterpriseName(name: string, enterpriseId: string) {
    let that = this;
    this.enterpriseAdminService.checkEnpName(name, enterpriseId, that, result => {
      if (result['success'] && result['success'] == 1) {
        that.enpNameIsExist = result.rows[0].isExist;
      }
    });
  }

  /*
   * 冻结企业应用
   * AppInfo :一条应用信息
   *
   */
  freezeEnterpriseApp(AppInfo: AppEnterprise): void {
    this.confirmationService.confirm({
      message: '确定冻结吗？',
      //确认删除
      accept: () => {
        let that = this;
        this.enterpriseAdminService.freezeEnterpriseApp(this.enpObjectId, AppInfo.objectId, that,
          rel => {
            let result = rel['rows'][0]['booleanResult'];
            if (result) {
              // 操作完成之后，提示出现
              this.getEnterpriseAppInfo();
              this.growl('success', '冻结成功!');
            } else {
              // 操作完成之后，提示出现
              this.growl('error', '冻结失败')
            }
          });
      },
    });
  }

  /*
   * 解冻企业应用
   * AppInfo :一条应用信息
   *
   */
  unfreezeEnterpriseApp(AppInfo: AppEnterprise): void {
    this.confirmationService.confirm({
      message: '确定解冻吗？',
      //确认删除
      accept: () => {
        let that = this;
        this.enterpriseAdminService.unfreezeEnterpriseApp(this.enpObjectId, AppInfo.objectId, that,
          rel => {
            let result = rel['rows'][0]['booleanResult'];
            if (result) {
              // 操作完成之后，提示出现
              this.getEnterpriseAppInfo();
              this.growl('success', '解冻成功!');
            } else {
              // 操作完成之后，提示出现
              this.growl('error', '解冻失败')
            }
          });
      },
    });
  }

  /*电话号码验证
   * 参数:
   *      telephone:电话号码   类型字符串
   *
   * */
  telephoneVerification(telephone: string) {
    if (telephone == '') {
      this.telephoneMismatch = false;
      return;
    }
    let reg = /^((\d{3,4}-)?\d{7,8})$|^1\d{10}$/;
    if (reg.test(telephone.toString())) {
      this.telephoneMismatch = false;
    } else {
      this.telephoneMismatch = true;
    }
  }

  /**
   * 成功提示
   * @param rel:是否成功  msg:提示信息
   */
  public growl(rel: string, msg: string) {
    this.msgs = [];
    this.msgs.push({ severity: rel, summary: '', detail: msg })
  }

}
