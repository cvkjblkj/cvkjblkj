import { objectify } from 'tslint/lib/utils';
import { ANY_STATE } from '@angular/compiler/src/private_import_core';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TreeNode } from 'primeng/primeng';
import 'rxjs/add/operator/toPromise';
import { AppAdmin } from './app.model';
import { INCONFIG } from './../../../../core/global';
import { CommonRequestMethodService } from './../../../../core/common-service/request-method.service'
@Injectable()
export class AppService {
  constructor(
    private http: Http,
    private commonRequestMethodService: CommonRequestMethodService
  ) { }
  public dataServerSrc = INCONFIG.dataServerSrc;


  /*增加功能*/
  /**
   * 功能定义添加
   * @param ___this
   * @param url
   * @param value
   * @param successhandler
   */
  public addSave(__this: any, url: any, value: any, successhandler?: any) {

    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doPost(__this, requestUrl, value, successhandler);
  };

  /*删除功能*/
  /**
   *
   * @param ___this
   * @param url
   * @param value
   * @param successhandler
   */
  public delete(__this: any, url: any, value: any, successhandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doPost(__this, requestUrl, value, successhandler);
  };

  /**
* 功能定义编辑
* @param ___this
* @param url
* @param value
* @param successhandler
*/
  public updateSave(__this: any, url: any, value: any, successhandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doPost(__this, requestUrl, value, successhandler);
  };

  /**
   * 编辑框获取数据
   * @param url
   * @param params
   * @param _this
   * @param successhandler
   * @param errorhandler
   */
  public getList(url: any, params?: any, _this?: any, successhandler?: any, errorhandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doGet(requestUrl, params, _this, successhandler, errorhandler);
  };
  /**
   * 基本信息弹出框接口
   * @param url
   * @param params
   * @param _this
   * @param successhandler
   * @param errorhandler
   */
  public getCode(url: any, params?: any, _this?: any, successhandler?: any, errorhandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    params = {
      appCode: params
    }
    this.commonRequestMethodService.doGet(requestUrl, params, _this, successhandler, errorhandler);
  };
  /*编辑功能*/
  /**
   *
   * @param ___this
   * @param url
   * @param value
   * @param successhandler
   */
  public update(__this: any, url: any, value: any, successhandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doPost(__this, requestUrl, value, successhandler);
  };
  /**
   * 基本信息获取数据
   * @param url
   * @param params
   * @param _this
   * @param successhandler  成功调用方法
   * @param errorhandler
   */
  public getInfo(url: any, params?: any, _this?: any, successhandler?: any, errorhandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    params = {
      objectId: params
    }
    this.commonRequestMethodService.doGet(requestUrl, params, _this, successhandler, errorhandler);
  };

  /**
   * 停用服务
   * objectId
   * @param ___this
   * @param url
   * @param value
   * @param successhandler
   */
  public stop(__this: any, url: any, value: any, successhandler?: any) {

    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doPost(__this, requestUrl, value, successhandler);
  };
  /*启用服务*/
  /**
   * 启用服务
   * objectId
   * @param ___this
   * @param url
   * @param value
   * @param successhandler
   */
  public start(__this: any, url: any, value: any, successhandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doPost(__this, requestUrl, value, successhandler);
  };

  /**
   * 基本信息列表
   * @param url
   * @param params
   * @param _this
   * @param successhandler
   * @param errorhandler
   */
  public getUser(url: any, params?: any, _this?: any, successhandler?: any, errorhandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doGet(requestUrl, params, _this, successhandler, errorhandler);
  };
  /**
   * 功能定义初始化数据
   * @param url
   * @param params
   * @param _this
   * @param successhandler
   * @param errorhandler
   */
  getTree(url: any, params?: any, _this?: any, successhandler?: any, errorhandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doGet(requestUrl, params, _this, successhandler, errorhandler);
  };
  /**
   * 功能定义添加
   * @param ___this
   * @param url
   * @param value
   * @param successhandler
   */
  funcSave(__this: any, url: any, value: any, successhandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doPost(__this, requestUrl, value, successhandler);
  };
  /**
   * 应用编码校验
   * @param url
   * @param params
   * @param _this
   * @param successhandler
   * @param errorhandler
   */
  checkCode(url: any, params?: any, _this?: any, successhandler?: any, errorhandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doGet(requestUrl, params, _this, successhandler, errorhandler);
  };
  /**
   * 应用名称校验
   * @param url
   * @param params
   * @param _this
   * @param successhandler
   * @param errorhandler
   */
  checkName(url: any, params?: any, _this?: any, successhandler?: any, errorhandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doGet(requestUrl, params, _this, successhandler, errorhandler);
  };
  /**
   * 功能定义
   * @param url
   * @param params
   * @param _this
   * @param successhandler
   * @param errorhandler
   */
  checkoutCode(url: any, params?: any, _this?: any, successhandler?: any, errorhandler?: any) {

    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doGet(requestUrl, params, _this, successhandler, errorhandler);
  };
}
