import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

import {ActivatedRoute, Params, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';

import {EnterpriseAuditInfo} from "../shared/enterprise-admin.model"
import {EnterpriseAdminService} from "../shared/enterprise-admin.service";

@Component({
  selector: "jas-enterprise-authed-approve",
  templateUrl: "./enterprise-authed-approve.component.html",
  styleUrls: ["./enterprise-authed-approve.component.css"],
})
export class EnterpriseAuthedApproveComponent implements OnInit {
  private enpAuthInfo: EnterpriseAuditInfo;   //审核企业产生的信息
  private enpBasicInfo: any;                  //企业的基本信息
  private authIdCardPhoto: any[];     //法人身份证照片文件ID
  private authLicensePhoto: any[];     //企业营业执照照片文件ID
  private pictureFileId: any;   //图片文件ID

  constructor(private enterpriseAdminService: EnterpriseAdminService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    let arg = this.route.snapshot.params;
    let that = this;
    //获取企业审核的信息
    this.enterpriseAdminService.getAuthEnterpriseInfo(this.route.snapshot.params['id'], that, ret => {
      that.enpAuthInfo = ret['rows'][0];
      if (that.enpAuthInfo.approveResult == -1) {
        that.enpAuthInfo.approveResult = "驳回";
      } else if (that.enpAuthInfo.approveResult == 1) {
        that.enpAuthInfo.approveResult = "通过";
      } else {
        that.enpAuthInfo.approveResult = "保密";
      }
      that.authIdCardPhoto = [];
      that.authLicensePhoto = [];
      if (that.enpAuthInfo.authIdCardPhoto) {
        let str = that.enpAuthInfo.authIdCardPhoto;
        that.authIdCardPhoto = str.split(',');
      }
      if (this.enpAuthInfo.authLicensePhoto) {
        let str = that.enpAuthInfo.authLicensePhoto;
        that.authLicensePhoto = str.split(',');
      }

      //获取企业基本信息
      that.enterpriseAdminService.getEnterprise(that.enpAuthInfo.businessId, that, detail => {
        that.enpBasicInfo = detail['rows'][0];
      })
    })
  }

  /* 弹窗显示图片
   * @param  fileId   图片文件ID
   * */
  showPictureBtn(fileId) {
    this.pictureFileId = fileId;
  }

  private fileId: string;
  private arg: string;
  private bussinessUrl: Array<Object>;
  private cardUrl: Array<Object>;
  private imgUrl: string;
  // 获取图片
  // 先获取文件的id,通过id获取图片路径
  getPicSrc(objectId: string): void {

    let that = this;
    this.enterpriseAdminService.getfileId(objectId, that, filesId => {
      that.fileId = filesId;
      if (!that.fileId['rows'][0][objectId]) {
        that.imgUrl = '没有图片'
        return;
      }

      that.arg = that.fileId['rows'][0][objectId];
      //营业执照图片地址
      this.bussinessUrl = that.arg['pic_business'];
      // 身份证图片地址
      this.cardUrl = that.arg['pic_identity'];
    })
  }


  // 取消 返回上一个页面
  cancle(): void {
    history.back();
  }

}
