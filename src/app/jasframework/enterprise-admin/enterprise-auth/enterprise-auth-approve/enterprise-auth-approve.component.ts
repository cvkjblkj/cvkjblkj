import { concatStatic } from 'rxjs/operator/concat';
import { CommonService } from './../../../../core/common-service/common.service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ConfirmationService } from 'primeng/primeng'
import { EnterpriseAdminModel } from "../shared/enterprise-admin.model";
import { EnterpriseAdminService } from "../shared/enterprise-admin.service";

@Component({
  selector: "jas-enterprise-auth-approve",
  templateUrl: "./enterprise-auth-approve.component.html",
  styleUrls: ["./enterprise-auth-approve.component.css"],
  providers: [CommonService]
})
export class EnterpriseAuthApproveComponent implements OnInit {
  private enpAuthInfo: any;//企业认证信息
  private Info: any;//企业认证信息
  private objectId: any;
  public enterpriseId: any;//企业id值
  public authEnterpriseName: any; //认证的企业名称
  public adminId: any; //企业管理员id值
  public adminInfo: any;  // 企业管理员信息
  private rel: any;
  private historise: any;
  private disabled: boolean;//按钮点击之后被禁用
  public approveResult: any; //审核结果  { 1通过 ； -1驳回}
  public fromAppName: string; //应用名称
  public adminMobileNum: string; //应用电话
  public isSameName: boolean = false; //是否存在同名企业
  // public sameNameEnp: any; //同名企业
  public sameEnp: any;//同名企业对象
  public startUserName: any; // 申请人名字
  public startTime: any; // 申请时间
  public startUserId: any; // 申请人Id

  public sameEnpName: any; // 同名企业名称

  private authIdCardPhoto: any[];     //法人身份证照片文件ID
  private authLicensePhoto: any[];     //企业营业执照照片文件ID
  private pictureFileId: any;   //图片文件ID

  private isRequest: boolean;
  public advise: string;
  private approveStatus: string;
  // 默认被选中
  private isclicked: boolean = true;

  constructor(private enterpriseAdminService: EnterpriseAdminService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private commonService: CommonService) {
  }

  ngOnInit(): void {
    let obj = this.route.snapshot.params;
    let _that = this;
    this.objectId = obj['objectId'];
    this.enterpriseId = obj['enterpriseId'];
    this.startTime = obj['startTime'];
    this.startUserName = obj['startUserName'];
    this.startUserId = obj['startUserId'];

    this.enterpriseAdminService.getEnpAuth(this.objectId, _that, (detail) => {
      if (detail && detail.success == 1) {
        _that.enpAuthInfo = detail['rows'][0] ? detail['rows'][0] : {};
        _that.authEnterpriseName = _that.enpAuthInfo.authEnterpriseName;
        _that.adminId = _that.enpAuthInfo.startUserId;
        _that.fromAppName = _that.enpAuthInfo.fromAppName;
        _that.authIdCardPhoto = [];
        _that.authLicensePhoto = [];
        if (_that.enpAuthInfo.authIdCardPhoto) {
          let str = _that.enpAuthInfo.authIdCardPhoto;
          _that.authIdCardPhoto = str.split(',');
        }
        if (_that.enpAuthInfo.authLicensePhoto) {
          let str = _that.enpAuthInfo.authLicensePhoto;
          _that.authLicensePhoto = str.split(',');
        }
        _that.isSameEnp(_that.authEnterpriseName, _that.enpAuthInfo.businessId);
        _that.getAdminMobile();
        _that.historyShow();     //查询历史记录
      }
    });
    this.enterpriseAdminService.getEnterprise(this.enterpriseId, _that, (res) => {
      if (res && res.success == 1 && res['rows'] && res['rows'].length > 0) {
        _that.Info = res['rows'][0];
      }
    })

    // 按钮初始状态 可使用
    this.disabled = false;

  }

  /* 弹窗显示图片
   * @param  fileId   图片文件ID
   * */
  showPictureBtn(fileId) {
    this.pictureFileId = fileId;
  }

  /**
   * 获取企业管理员账号
   */
  public getAdminMobile() {
    let _that = this;
    this.enterpriseAdminService.getCreatUser(this.enterpriseId, this.adminId, _that, (res) => {
      if (res && res.success == 1) {
        _that.adminInfo = res.rows[0] ? res.rows[0] : {};
        if (_that.adminInfo) {
          _that.adminMobileNum = _that.adminInfo.mobileNum;
        }
      } else if (res.success == -1) {
        _that.adminInfo = {};
      }
    })
  }

  /**
   * 判断是否存在同名企业
   */
  public isSameEnp(authEnterpriseName, businessId) {
    let _that = this;
    this.enterpriseAdminService.isSameName(authEnterpriseName, _that, (res) => {
      if (res && res.success == 1) {
        if (res.rows.length == 0) {
          _that.isSameName = false;

        } else if (res.rows.length != 0) {
          if (res.rows[0].objectId == businessId) {
            _that.isSameName = false;

          } else {
            _that.isSameName = true;
            _that.getEnpBasicInfo(res.rows[0].objectId)
          }
        }
      }
    })
  }

  /**
   * 获取同名企业信息
   */
  public getEnpBasicInfo(enterpriseId) {
    let _that = this;
    this.enterpriseAdminService.getSameEnpInfo(enterpriseId, _that, (res) => {
      if (res && res.success == 1) {
        _that.sameEnp = res.rows[0];
        _that.sameEnpName = res.rows[0].enterpriseName;
        _that.adminId = _that.sameEnp.startUserId;
        _that.enterpriseId = _that.sameEnp.objectId;
        this.getAdminMobile();
      } else if (res.success == -1) {
        if (res.code == 402) {

        }
      }
    });
  }

  /**
   *  同名企业弹窗信息
   *
   */
  public view(modal: any) {
    modal.show();
  }


  // private booleanResult: string;
  // private fileId: string;
  // private arg: string;
  // private bussinessUrl: Array<Object>;
  // private cardUrl: Array<Object>;
  // private url: string;
  // private imgUrl: string;
  // 获取图片
  // 先获取文件的id,通过id获取图片路径
  // getPicSrc(objectId: string): void {
  //   this.enterpriseAdminService.getfileId(objectId)
  //       .then(res => {
  //         this.fileId = res;
  //         if (res.success == 1) {
  //           if (!this.fileId['rows'][0][objectId]) {
  //             this.imgUrl = '没有图片'
  //             return;
  //           }
  //           ;
  //           this.arg = this.fileId['rows'][0][objectId];
  //           //营业执照图片地址
  //           this.bussinessUrl = this.arg['pic_business'];
  //           // 身份证图片地址
  //           this.cardUrl = this.arg['pic_identity']
  //
  //         } else if (res.success == -1) {
  //           // alert(res.msg)
  //         }
  //       });
  // }

  confirm(mes: any, approveStatus?: string, advise?: string) {
    let _that = this;
    this.confirmationService.confirm({
      message: mes,
      accept: () => {
        this.disabled = true;
        let body = {
          'signName': this.fromAppName,
          'approveResult': this.approveResult,
          'approveContent': advise,
          'taskId': this.objectId

        }
        this.enterpriseAdminService.passUpdate(body, _that, (res) => {
          _that.disabled = false;
          if (res['success'] == 1) {
            _that.rel = res['rows'][0];
            _that.lazyMes();
          } else if (res['success'] == -1) { }
        })
      }
    });
  }

  //审核通过、取消、驳回

  // 通过
  pass(): void {
    this.warn = false
    this.approveResult = '1';
    let confirmMes = '确认通过？';

    this.approveStatus = "pass";
    this.advise = "通过";
    // this.updata(this.approveStatus, this.advise);
    if (confirmMes || this.approveStatus || this.advise) {
      console.log(1)
      this.confirm(confirmMes, this.approveStatus, this.advise);
    } else {
      console.log(2)
      this.disabled = false
    }


  }

  // 提示审核是否完成
  lazyMes(): void {
    this.disabled = false;
    this.isRequest = this.rel["booleanResult"];
    console.log(this.isRequest)
    if (!this.isRequest) {
      this.confirmationService.confirm({
        message: '请重新审核',
        accept: () => {

        }
      })
    } else {
      this.confirmationService.confirm({
        message: '审核完成',
        accept: () => {
          this.cancle();
        }
      })
    }

  }

  // 驳回
  private warn: boolean = false;

  turn(): void {
    if (!this.advise) {
      this.warn = true;
      return;
    } else {
      this.warn = false;
    }
    this.approveResult = '-1';
    this.approveStatus = "reject";
    let confirmMes = '确认驳回？'

    this.confirm(confirmMes, this.approveStatus, this.advise);
  }

  // 取消 返回
  cancle(): void {
    history.back();
  }


  // tab
  authApprove(): void {
    this.isclicked = true;
  }

  // 历史记录
  public isHistoryList: boolean = false;

  historyShow(): void {
    let _that = this;
    this.enterpriseAdminService.getHistory(this.enpAuthInfo.businessId, _that, (res) => {
      if (res.success == 1) {
        _that.historise = res['rows'];
        _that.changeApproveResult(_that.historise);
        if (_that.historise.length == 0) {
          _that.isHistoryList = true;
        } else {
          _that.isHistoryList = false;
        }
      } else if (res.success == -1) { }
    })

  }

  changeApproveResult(data: any) {
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      switch (item['approveResult']) {
        case -1:
        case '-1':
          item['approveResult'] = '驳回';
          break;
        case 1:
        case '1':
          item['approveResult'] = '通过';
          break;
        case 0:
        case '0':
          item['approveResult'] = "待审核";
          break;
        default:
          item.approveResult = '未知';
          break;
      }

    }
  }
}
