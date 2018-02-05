
import { CommonRequestMethodService } from './../../../../core/common-service/request-method.service';
import { objectify } from 'tslint/lib/utils';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAdmin } from '../shared/app.model';
import { NgForm } from '@angular/forms';
import { AppService } from '../shared/app.service';
import { Message } from 'primeng/primeng'
import { ConfirmationService } from 'primeng/primeng';
@Component({
  selector: 'AppInfoComponent',
  templateUrl: './app-info.component.html',
  styleUrls: ['./app-info.component.css'],
  providers: [AppService, ConfirmationService, CommonRequestMethodService]
})
export class AppInfoComponent implements OnInit {
  public model = new AppAdmin();
  public id: any;//接收页面传的id值;
  public appCode: any; //应用标识
  public appName: any;//应用名称
  public url: any;//应用url
  public description: any;//应用描述
  public objectId: any;
  public msgs: any;//提示消息
  public appId: any;
  public menuId: any;
  public button: any = {};
  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  };
  @ViewChild('addModal') private addModal;
  ngOnInit() {

    if (!localStorage.getItem('appObj')) {
      return;
    } else if (localStorage.getItem('appObj')) {
      let appObj = localStorage.getItem('appObj');
      this.appCode = JSON.parse(appObj).appCode;
      this.appName = JSON.parse(appObj).appName;
      this.appId = JSON.parse(appObj).appId;
    };
    this.getDate(this.appId);
    if (!localStorage.getItem('appListBtn')) {
      return;
    } else if (localStorage.getItem('appListBtn')) {
      let menu = localStorage.getItem('appListBtn');
      this.button = JSON.parse(menu);
    };
  };
  /*页面初始化数据
   *@param  appId
  */
  getDate(objectId: any) {
    let _that = this;
    let url = '/app/getById';
    let params = objectId;
    _that.appService.getInfo(url, params, _that, function (res) {
      _that.Message = res['rows'][0];
      _that.growl('success', '页面刷新成功');
      if (_that.Message.appType == '1') {
        _that.Message.appType = '平台';
      } else {
        _that.Message.appType = '应用';
      }
    })
  }
  addForm: NgForm;
  @ViewChild('addForm') AddForm: NgForm;
  /**
   * 修改弹出框
   * @param addModal
   */
  edit(addModal: any) {
    addModal.show();
    let code = this.appCode;
    this.getCode(code);
  };
  public getCode(code: any) {
    let _that = this;
    let url = '/app/getByCode';
    let params = code;
    _that.appService.getCode(url, params, _that, function (res) {
      _that.message = res['rows'][0];
    })
  };
  /**
   * 关闭弹出框
   * @param addModal
   * @param addForm
   */
  hide(addModal: any, addForm: any) {
    addModal.hide();
    this.isExistRel = true;
  };
  public Message: any;

  /*@param  addModal
   * @param addForm
   * 编辑保存
   */
  public message: any;
  editSave(addModal: any, addForm: any) {
    let _that = this;
    let url = '/app/update';
    let params = {
      appName: this.message.appName,
      url: this.message.url,
      objectId: this.appId,
      description: this.message.description,
      remark: this.message.remark
    };
    _that.disabled = true;
    _that.appService.update(_that, url, params, (res) => {
      _that.message = res;
      if (_that.message['success'] && _that.message['success'] == 1) {
        _that.growl('success', '修改成功');
        _that.addModal.hide();
        _that.AddForm.reset();
        _that.disabled = false;
        _that.getDate(_that.appId); /**从新加载数据 */
      } else if (_that.message['success'] == -1) {

        _that.disabled = true;
        _that.addModal.hide();
      };
    });
  };
  public isExistRel: boolean = true;/**应用名称校验 */
  public isExistMes: string;
  public disabled: boolean = true;
  public isEixtShow: boolean = false; //保存按钮是否可用
  /*@param  appName
  * @param appId
  * 应用名称校验
  */
  nameIsExist(appName: any, appId: any) {
    if (!appName) {
      return;
    };
    let _that = this;
    let url = '/app/checkName';
    let params = {
      appName: appName,
      appId: appId
    };
    _that.disabled = true;
    _that.appService.checkName(url, params, _that, function (res) {
      _that.isExistRel = true;
      if (res['success'] == 1 && res['rows']) {
        let rel = res['rows'][0];
        if (rel['isExist']) {
          _that.isEixtShow = true;
          _that.isExistRel = false;
          _that.isExistMes = "应用名称已经存在";
          return;
        }
        else if (!rel['isExist']) {
          _that.isEixtShow = false;
        }
      }
    })

  };

  public urlMismatch: boolean = false;//正则判断提示
  /**url正则判断
   * @param url
   */
  telephoneCheck(url: any) {
    if (url == '' || url == undefined) {
      this.urlMismatch = false;
      return;
    };
    let reg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
    if (reg.test(url.toString())) {
      this.urlMismatch = false;

    } else {
      this.urlMismatch = true;
    };
  };
  public growl(rel: string, res: string) {
    this.msgs = [];
    this.msgs.push({ severity: rel, summary: '', detail: res });
  };
}
