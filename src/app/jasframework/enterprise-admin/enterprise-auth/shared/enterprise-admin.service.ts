import 'rxjs/add/operator/toPromise';
//http返回结果中一些错误处理,比如404,500,等错误
import {CommonRequestMethodService} from './../../../../core/common-service/request-method.service';

import {Headers, Http, Jsonp, RequestOptions, Response} from "@angular/http";

// import {EnterpriseAdminModel} from "./enterprise-admin.model";
import {Injectable} from '@angular/core';

@Injectable()
export class EnterpriseAdminService {
  private JsonHeader = new Headers({'Content-Type': 'application/json'});

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Promise.reject(errMsg);

  }

  private token: string = window.localStorage['jasToken'];

  // 定义两个微服务名字
  public fileServerSrc = '/cloudlink/v1/cloudlink-core-file';
  public dataServerSrc = '/cloudlink/v1/cloudlink-core-framework';

  constructor(private http: Http, private commonRequestMethodService: CommonRequestMethodService) {
  }

  // 企业认证审核
  // 分页请求
  // authMes(pageNum?: string | number, pageSize?: number | string, enterpriseScale?: string,
  //         enterpriseName?: string, objectId?: string, authenticateStatus?: string): Promise<any> {
  //
  //   let url = this.dataServerSrc + "/enterprise/queryAuthList?" + "pageNum=" + pageNum + "&pageSize=" + pageSize + "&authenticateStatus=2" + '&token=' + this.token;
  //   return this.http.get(url)
  //     .toPromise()
  //     .then(this.extractData)
  //     .catch(this.handleError)
  // }

  /**
   * 获取初始化应用企业审核列表
   * @param appCode 企业code
   * @param appId 企业id值
   * @param pageNum 页码
   * @param pageSize 页容量
   * @param approveStatus 审核状态：0待审核 1已审核（包括通过、驳回）
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  getEnpAuthList(appCode: any, appId: any, pageNum: any, pageSize: any, approveStatus: any,
                 __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + "/enterprise/queryAuthList";
    let params = {
      'appCode': appCode,
      'appId': appId,
      'pageNum': pageNum,
      'pageSize': pageSize,
      'approveStatus': approveStatus,
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }

  /*获取一条已审核企业信息
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   * */
  getAuthEnterpriseInfo(enterpriseId: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + "/enterprise/getAuthHistoryById";
    let params = {
      'taskId': enterpriseId,
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }

  /*
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
   * @param params 需要的参数
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public getAppNameList(params: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + "/user/getManagedAppList";

    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }

  //搜索
  searchAuthMes(pageNum?: string | number, pageSize?: number | string,
                enterpriseName?: string): Promise<any> {

    let url = this.dataServerSrc + "/enterprise/queryPageAuth?authenticateStatus=2" +
      "&pageNum=" + pageNum + "&pageSize=" + pageSize + "&enterpriseName=" +
      enterpriseName
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  /**
   * 获取当前列表项基本信息
   *@param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  getEnterprise(objectId: string, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + "/enterprise/getById";
    let params = {
      'objectId': objectId,
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }

  /**
   * 获取企业的认证审核信息
   * @param objectId 企业id值
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  getEnpAuth(objectId: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + "/enterprise/getAuthHistoryById";
    let params = {
      'taskId': objectId,
    }
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }

  /*企业认证审核
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   * */
  passUpdate(body: any, __this: any, successHandler: any) {
    let requestUrl = this.dataServerSrc + "/enterprise/authApprove";
    this.commonRequestMethodService.doPost(__this, requestUrl, body, successHandler);
  }

  /*获取图片 1、获取图片文件的id
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   * */
  getfileId(objectId: string, __this: any, successHandler: any) {
    let url = this.fileServerSrc + '/attachment/getFileIdListByBizIdsAndBizAttrs';
    let argId = [objectId]
    // console.log(argId);
    let body = JSON.stringify({
      bizIds: argId
    });
    this.commonRequestMethodService.doPost(__this, url, body, successHandler);
  }

  //2、获取图片
  // getPic(fileId: string): Promise<any> {
  //   let url = this.fileServerSrc + '/file/downLoad?fileId=' + fileId;
  //   return this.http.get(url)
  //     .toPromise()
  //     .then(this.extractData)
  //     .catch(this.handleError)
  // }

  /* 获取历史审核记录
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   * */
  getHistory(enterpriseId: string, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + "/enterprise/getAuthHistory";
    let params = {
      'enterpriseId': enterpriseId,
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }

  //企业信息管理
  // 分页请求
  // listMes(pageNum?: string | number, pageSize?: number | string, status?: any, name?: any): Promise<any> {
  //   if (!name) {
  //     name = '';
  //   }
  //
  //   let url = this.dataServerSrc + "/enterprise/queryPage?" + "pageNum=" + pageNum + "&pageSize=" + pageSize + "&authenticateStatus=" + status + "&enterpriseName=" + name + "&token=" + this.token;
  //   return this.http.get(url)
  //     .toPromise()
  //     .then(this.extractData)
  //     .catch(this.handleError)
  // }

  //获取基本信息详情编辑
  // getMessageDetail(objectId: string): Promise<any> {
  //   let url = this.dataServerSrc + "/enterprise/getById?objectId=" + objectId + "&token=" + this.token;
  //   ;
  //   return this.http.get(url)
  //     .toPromise()
  //     .then(this.extractData)
  //     .catch(this.handleError)
  // }

  //详情页面功能
  //编辑保存
  // update(obj: any): Promise<any> {
  //   let url = this.dataServerSrc + '/enterprise/update?token=' + this.token;
  //
  //   let options = new RequestOptions({headers: this.JsonHeader});
  //   return this.http.post(url, obj, options)
  //     .toPromise()
  //     .then(this.extractData)
  //     .catch(this.handleError)
  // }

  //添加 保存
  // addSave(obj: any): Promise<any> {
  //   let url = this.dataServerSrc + '/enterprise/add?token=' + this.token;
  //
  //   let options = new RequestOptions({headers: this.JsonHeader});
  //   return this.http.post(url, obj, options)
  //     .toPromise()
  //     .then(this.extractData)
  //     .catch(this.handleError)
  // }

  /**
   * 判断企业是否存在
   * parameter 企业名称
   */
  // isExist(enterpriseName: any): Promise<any> {
  //   let url = this.dataServerSrc + '/enterprise/isExist' + "&token=" + this.token;
  //   let body = JSON.stringify({
  //     enterpriseName: enterpriseName
  //   });
  //   let options = new RequestOptions({headers: this.JsonHeader});
  //   return this.http.post(url, body, options)
  //     .toPromise()
  //     .then(this.extractData)
  //     .catch(this.handleError)
  // }


  //删除
  delete(objectId: string): Promise<any> {
    let url = this.dataServerSrc + '/enterprise/delete?objectId=' + objectId + "&token=" + this.token;
    let options = new RequestOptions({headers: this.JsonHeader});
    let body = JSON.stringify({
      objectId: objectId
    });
    return this.http.post(url, body, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  /**
   * 查询企业的管理员账号
   * param 企业id  查询管理员
   */

  getSysAdmin(enterpriseId: string): Promise<any> {
    let url = this.dataServerSrc + '/user/queryList?' + 'enterpriseId=' + enterpriseId + '&isSysadmin=1' + "&token=" + this.token;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)

  }

  /**
   * 查询企业的创建人账号
   * param 企业id  用户id
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  getCreatUser(enterpriseId: string, objectId: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/user/getById';
    let params = {
      'enterpriseId': enterpriseId,
      'objectId': objectId,
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }

  /**
   * 判断是否存在同名企业
   * @param enterpriseName 企业名称
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public isSameName(enterpriseName: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/enterprise/getByName';
    let params = {
      'enterpriseName': enterpriseName,
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }

  /**
   * 获取同名企业基本信息
   * @param objectId 企业id
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public getSameEnpInfo(objectId: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/enterprise/getById';
    let params = {
      'objectId': objectId,
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }


}
