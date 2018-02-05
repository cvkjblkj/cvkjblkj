import { CommonRequestMethodService } from './../../../../core/common-service/request-method.service';
import 'rxjs/add/operator/toPromise';

import { Headers, Http, Jsonp, RequestOptions, Response } from "@angular/http";

import { Injectable } from '@angular/core';
import { UserAdmin } from './user-admin.model';

@Injectable()
export class UserAdminService {

  private token: string = window.localStorage['jasToken'];
  private JsonHeader = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.JsonHeader });
  public fileServerSrc = '/cloudlink/v1/cloudlink-core-file';
  public dataServerSrc = '/cloudlink/v1/cloudlink-core-framework';

  constructor(
    private http: Http,
    private commonRequestMethodService: CommonRequestMethodService
  ) { }

  private extractData(res: Response) {
    let body = res.json();
    // console.log(body['rows'])
    return body || {};
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Promise.reject(errMsg);

  }


  /**
   * 获取企业列表
   */
  getEnterpriseList(): Promise<any> {
    let url = this.dataServerSrc + '/enterprise/queryList' + '?token=' + this.token;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData['body'])
      .catch(this.handleError)
  }


  /**
   * 组织机构树获取
   * @param enterpriseId 企业id
   * @param parentId 父组织机构id
   */
  getTree(params: any, __this: any, successHandler: any): Promise<any> {

    let url = this.dataServerSrc + '/organization/getTree';
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }

  /**
   * 获取指定组织机构树
   * @param parentId 父组织机构id
   */
  getTreeByOrgId(parentId: string): Promise<any> {
    let url = this.dataServerSrc + '/organization/getTreeByOrgId' + '?token=' + this.token + '&parentId=' + parentId;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }



  //第一次渲染组织机构树
  getFirstTree(FirstId: any): Promise<any> {
    let url = this.dataServerSrc + '/organization/getTree?enterpriseId=' + FirstId;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }



  /**
   * 获取用户列表 初始化数据
   * @param params 请求参数
   *       enterpriseId 企业id
          'appId': 应用id
          'appCode': 应用code
          'orgId': 组织机构id
          'pageNum': 页码
          'pageSize': 页容量
   * @param __this 调用组件的this指向
   * @param successHandler 成功的处理函数
  */
  getUserList(params: any, __this: any, successHandler: any): Promise<any> {

    let url = this.dataServerSrc + '/user/getListByEnterpriseApp';
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }
  // getListByEnterpriseApp
  /**
   * 获取用户详细信息
   * @param objectId 查看的用户ID
   * @param enterpriseId 企业Id
   * @param appCode 企业appCode
   */
  getUserMes(objectId: any, enterpriseId?: string): Promise<any> {
    if (enterpriseId) {
      var enterpriseid = enterpriseId;
    } else if (!enterpriseId) {
      var enterpriseid = '';
    }
    let url = this.dataServerSrc + '/user/getById?objectId=' + objectId + '&enterpriseId=' + enterpriseid
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }
  /** 获取用户个人头像  返回文件id*/
  getUserPic(objectId: any): Promise<any> {
    let url = this.fileServerSrc + "/attachment/getFileIdListByBizIdAndBizAttr?businessId=" + objectId + "&bizType=pic"
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  /**
   * 对用户进行编辑修改 保存
   * @param obj
   * @param appCode
   * @param ___this
   * @param successHandler
   */
  userEdit(obj: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/user/update';
    let body = JSON.stringify(obj);
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler);
  }
  /**
   * 添加保存
   * @param obj  请求参数
   * @param appCode 应用code
   */
  saveUserAdd(obj: any, appCode: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/user/add';
    obj.appCode = appCode
    let body = JSON.stringify(obj);
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler);
  }
  /**
   * 移除用户
   */
  delete(body: any, appCode: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/user/removeFromEnterpriseApp';
    body.appCode = appCode;
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }
  /**
   * 获取应用下的角色
   * @param appCode 应用code
   * @param appId 应用id
   */
  public getAppRole(appCode: any, appId: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + "/role/getTreeByApp";
    let params = {
      'appCode': appCode,
      'appId': appId
    }
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }


  /**
   *  pickList
   *  获取所有的角色列表
   */
  queryList(token: any, systemId?: any, enterpriseId?: any): Promise<any> {
    let url = this.dataServerSrc + "/role/queryList?" + "token=" + token + "&systemId=" + systemId;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  /**
   * picklist
   * 获取当前用户的角色列表
   */
  queryUserList(userId: any, systemId?: any, enterpriseId?: any): Promise<any> {
    let url = this.dataServerSrc + "/role/getByUserId?" + "userId=" + userId + "&systemId=" + systemId + "&enterpriseId=" + enterpriseId;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)

  }

  /**
   * 点击保存时
   * 分配角色
   * @param roleObj
   * @param appCode
   * @param ___this
   * @param successHandler
   */
  assignRoles(roleObj: any, appCode: any, __this: any, successHandler: any): Promise<any> {
    roleObj.deassign = true; //重新分配角色
    let url = this.dataServerSrc + "/user/assignRoles";
    roleObj.appCode = appCode;
    let body = JSON.stringify(roleObj);
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }


  /**
   * 点击保存时
   * 移除角色
   */
  removeRoles(body: any): Promise<any> {
    let url = this.dataServerSrc + '/user/removeRoles';
    let options = new RequestOptions({ headers: this.JsonHeader });
    return this.http.post(url, body, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }


  /**
  * 系统下拉菜单数据  ---roleListComponent
  */
  getSystemName(): Promise<any> {
    let url = this.dataServerSrc + '/system/queryList?token=' + this.token;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  /**
   * 邀请用户
   */

  inviteUser(body: any): Promise<any> {
    let url = this.dataServerSrc + '/invite/invite';
    let options = new RequestOptions({ headers: this.JsonHeader });
    return this.http.post(url, body, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }


}
