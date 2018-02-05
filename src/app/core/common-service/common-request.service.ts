import { INCONFIG } from './../global';
import { CommonRequestMethodService } from './request-method.service';
/**
 * 公共请求方法
 * 功能有：
 * 1、获取按钮控制权限
 * 2、获取应用列表
 * 3、
 */



import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
@Injectable()
export class CommonRequestService {
  private appCode: string = window.localStorage['appCode'];
  private viewTypeCode: string = INCONFIG.viewTypeCode;
  public viewTypeId: string = INCONFIG.viewTypeId;
  // 微服务名字
  public fileServerSrc = INCONFIG.fileServerSrc;
  public dataServerSrc = INCONFIG.dataServerSrc;

  constructor(private http: Http, public commonRequestMethodService: CommonRequestMethodService) { }

  /**
   * 获取页面的按钮
   * @param parentId 父节点id
   * @param viewTypeCode 类型code
   * @param appCode 应用code
   */
  public getMenuBtn(parentId: any, __this: any, successHandler: any): Promise<any> {
    let params = {
      'parentId': parentId,
      'viewTypeCode': this.viewTypeCode,
      'appCode': this.appCode,
      'viewFuncType': 2
    }
    let url = this.dataServerSrc + '/app/view/getTreeByLoginUser';
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler)
    // return this.http.get(url)
    //   .toPromise()
    //   .then(this.extractData)
    //   .catch(this.handleError)
  }

  /*
   * 获取应用列表
   * 获取当前登录用户管理的的应用列表（支持分页）
   * 请求方式:GET
   * url: http://<cloudlink-core-framework-url>/user/getManagedAppList
   * 入参: {   "appCode":"",   //应用英文标识，可选，字符串类型，最大长度50
   *          "appName":"",   //应用中文名称，可选，字符串类型，最大长度200
   *          "status":"",    //应用状态，可选，数字类型，支持多组合
   *      }
   *返回结果: {
   * 成功：{token: ””，success:1,rows:[ 应用对象列表 ]}
   * 失败：{success:-1，msg："对应错误信息",code:"对应错误编码"}
   * }
   */
  /**
   * 请求获取应用列表
   * @param params 请求列表需要的参数
   * @param ___this 调用组件的this指向
   * @param successHandler 请求成功的处理函数
   * @return 没有返回值
   */
  public getAppNameList(params: any, __this?: any, successHandler?: any) {
    let url = this.dataServerSrc + "/user/getManagedAppList";
    this.commonRequestMethodService.doGet(url, params, __this, successHandler)
  }








}
