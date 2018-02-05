import 'rxjs/add/operator/toPromise';
//http返回结果中一些错误处理,比如404,500,等错误
import { CommonRequestMethodService } from './../../../../core/common-service/request-method.service';
import { Headers, Http, Jsonp, RequestOptions, Response } from "@angular/http"

import { Injectable } from '@angular/core';

@Injectable()
export class AppEnterpriseService {

  private JsonHeader = new Headers({ 'Content-Type': 'application/json' });

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

  private token: string = window.localStorage['jasToken'];

  // 定义两个微服务名字
  public fileServerSrc = '/cloudlink/v1/cloudlink-core-file';
  public dataServerSrc = '/cloudlink/v1/cloudlink-core-framework';

  constructor(private http: Http, private commonRequestMethodService: CommonRequestMethodService) {
  }

  // 企业认证审核
  // 分页请求
  authMes(pageNum?: string | number, pageSize?: number | string, enterpriseScale?: string,
          enterpriseName?: string, objectId?: string, authenticateStatus?: string): Promise<any> {

    let url = this.dataServerSrc + "/enterprise/queryPageAuth?" + "pageNum=" + pageNum + "&pageSize=" + pageSize + "&authenticateStatus=2"
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
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

  //获取当前列表项信息
  getEnterprise(id: string): Promise<any> {
    let url = this.dataServerSrc + "/enterprise/getById?" + "objectId=" + id
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  //企业认证通过
  passUpdate(objectId: string, startUserId: any, approveStatus: string, advise?: string): Promise<any> {
    let url = this.dataServerSrc + "/enterprise/authApprove?token=" + this.token;
    let body = JSON.stringify({
      objectId: objectId,
      approveStatus: approveStatus,
      approveContent: advise,
      startUserId: startUserId,
    });
    let options = new RequestOptions({ headers: this.JsonHeader });
    return this.http.post(url, body, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  //获取图片
  //1、获取图片文件的id
  getfileId(objectId: string): Promise<any> {
    let url = this.fileServerSrc + '/attachment/getFileIdListByBizIdsAndBizAttrs';
    let options = new RequestOptions({ headers: this.JsonHeader });
    let argId = [objectId]
    // console.log(argId);
    let body = JSON.stringify({
      bizIds: argId
    });
    return this.http.post(url, body, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  //2、获取图片
  getPic(fileId: string): Promise<any> {
    let url = this.fileServerSrc + '/file/downLoad?fileId=' + fileId;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  //获取历史审核记录
  getHistory(objectId: string): Promise<any> {
    let url = this.dataServerSrc + "/enterprise/getAuthHistory?enterpriseId=" + objectId;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  //企业信息管理
  // 分页请求
  listMes(pageNum?: string | number, pageSize?: number | string, status?: any, name?: any): Promise<any> {
    if (!name) {
      name = '';
    }

    let url = this.dataServerSrc + "/enterprise/queryList?" + "pageNum=" + pageNum + "&pageSize=" + pageSize + "&authenticateStatus=" + status + "&enterpriseName=" + name + '&token=' + this.token;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  /*获取基本信息详情编辑
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   * */
  getMessageDetail(objectId: string, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + "/enterprise/getById";
    let params = {
      'objectId': objectId,
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }

  /*企业管理基本信息页面 编辑保存
   *@param __this 组件的this值
   * @param successHandler 成功处理函数
   * */
  update(obj: any, __this: any, successHandler: any) {
    let url = this.dataServerSrc + '/enterprise/update';

    this.commonRequestMethodService.doPost(__this, url, obj, successHandler);
  }

  //添加 保存
  addSave(obj: any): Promise<any> {
    let url = this.dataServerSrc + '/enterprise/add?token=' + this.token;

    let options = new RequestOptions({ headers: this.JsonHeader });
    return this.http.post(url, obj, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  /**
   * 判断企业是否存在
   * parameter 企业名称
   */
  isExist(enterpriseName: any): Promise<any> {
    let url = this.dataServerSrc + '/enterprise/isExist';
    let body = JSON.stringify({
      enterpriseName: enterpriseName
    });
    let options = new RequestOptions({ headers: this.JsonHeader });
    return this.http.post(url, body, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }


  /*删除企业信息
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   * */
  delete(objectId: string, __this: any, successHandler: any) {
    let url = this.dataServerSrc + '/enterprise/delete';
    let body = JSON.stringify({
      objectId: objectId
    });
    this.commonRequestMethodService.doPost(__this, url, body, successHandler);
  }

  /*
   * 冻结企业
   * 请求方式:post
   * url: enterprise/freeze
   * 入参: {"enterpriseIds":"", //企业ID，必填，多个用逗号隔开
   *      }
   *返回结果: {
   * 成功：{success:1,rows:[结果]}
   * 失败：{success:-1，msg："对应错误信息",code:"对应错误编码"}
   * }
   */
  freeze(enterpriseIds: any): Promise<any> {
    let url = this.dataServerSrc + '/enterprise/freeze' + '?token=' + this.token;
    let options = new RequestOptions({ headers: this.JsonHeader });
    let body = JSON.stringify({
      enterpriseIds: enterpriseIds.toString(),
    })
    return this.http.post(url, body, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  /*
   * 冻结企业应用
   * 请求方式:post
   * url: /enterprise/freezeFromApp
   * 入参: {"enterpriseIds":"", //企业ID，必填，多个用逗号隔开
   *         "appIds":"",        //应用ID，多个用逗号隔开
   *      }
   *返回结果: {
   * 成功：{success:1,rows:[结果]}
   * 失败：{success:-1，msg："对应错误信息",code:"对应错误编码"}
   * }
   *
   * 只能冻结企业正在启用的应用，即status=1，其他状态的不可冻结
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  freezeEnterpriseApp(enterpriseIds: any, appId: any, __this: any, successHandler: any) {
    let url = this.dataServerSrc + '/enterprise/freezeFromApp';
    //post方法参数要放在 body中, 拼接在url中后台API接收不到参数
    let body = JSON.stringify({
      enterpriseIds: enterpriseIds.toString(),
      appId: appId.toString()
    })
    this.commonRequestMethodService.doPost(__this, url, body, successHandler);
  }

  /*
   * 解冻企业应用
   * 请求方式:post
   * url: /enterprise/unfreezeFromApp
   * 入参: {"enterpriseIds":"", //企业ID，必填，多个用逗号隔开
   *      "appIds":"",        //应用ID，多个用逗号隔开
   *      }
   *返回结果: {
   * 成功：{success:1,rows:[结果]}
   * 失败：{success:-1，msg："对应错误信息",code:"对应错误编码"}
   * }
   *
   * 只可解冻被冻结的企业应用，即status=-1，其他状态不可解冻
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  unfreezeEnterpriseApp(enterpriseIds: any, appId: any, __this: any, successHandler: any) {
    let url = this.dataServerSrc + '/enterprise/unfreezeFromApp';
    //post方法参数要放在 body中, 拼接在url中后台API接收不到参数
    let body = JSON.stringify({
      enterpriseIds: enterpriseIds.toString(),
      appId: appId.toString()
    });
    this.commonRequestMethodService.doPost(__this, url, body, successHandler);
  }

  /*
   * 解冻企业
   * 请求方式:post
   * url: enterprise/unfreeze
   * 入参: {"enterpriseIds":"", //企业ID，必填，多个用逗号隔开
   *      }
   *返回结果: {
   * 成功：{success:1,rows:[结果]}
   * 失败：{success:-1，msg："对应错误信息",code:"对应错误编码"}
   * }
   */
  // unfreeze(enterpriseIds: any): Promise<any> {
  //   let url = this.dataServerSrc + '/enterprise/unfreeze' + '?token=' + this.token;
  //   let options = new RequestOptions({ headers: this.JsonHeader });
  //   let body = JSON.stringify({
  //     enterpriseIds: enterpriseIds.toString(),
  //   })
  //   return this.http.post(url, body, options)
  //     .toPromise()
  //     .then(this.extractData)
  //     .catch(this.handleError)
  // }

  /*
   * 查询企业下的应用
   * 请求方式:GET
   * url: enterprise/getAppList
   * 入参: enterpriseId = 企业ID
   *      appIds = 应用ID，多个用逗号隔开
   *@param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  getEnterpriseAppList(enterpriseIds: any, appIds: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/enterprise/getAppList';
    let params = {
      'enterpriseId': enterpriseIds,
      'appIds': appIds,
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }

  /*
   * 获取应用企业列表
   * 请求方式:GET
   * url: http://<cloudlink-core-framework-url>/ enterprise/getListByApp
   * 入参: "appCode":"", //应用I
   *       "enterpriseName":"", //企业名称
   *       "enterpriseScale":"", //企业规模，支持多组合
   *       "enterpriseStatus":"", //企业状态，支持多组合，
   *       "enterpriseAppStatus":"", //企业使用应用状态，支持多组合，
   *       "enterpriseIds":"", //企业ID，多个用逗号隔开
   *
   *返回结果: {
   * 成功：{success:1,rows:[企业列表]}
   * 失败：{success:-1，msg："对应错误信息",code:"对应错误编码"}
   * }
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  getListByApp(appCode: any, authenticateStatus: any, enterpriseName: any, pageNum: any, pageSize: any,
               __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/enterprise/getListByApp';
    let params = {
      'appCode': appCode,
      'authenticateStatus': authenticateStatus,
      'enterpriseName': enterpriseName,
      'pageNum': pageNum,
      'pageSize': pageSize,
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }


  // /**
  //  * 查询企业的管理员账号
  //  * param 企业id  查询管理员
  //  */


  // getSysAdmin(enterpriseId: string): Promise<any> {
  //     let url = this.dataServerSrc + '/user/getById?' + 'enterpriseId=' + enterpriseId + '&isSysadmin=1' + '&token=' + this.token;
  //     return this.http.get(url)
  //         .toPromise()
  //         .then(this.extractData)
  //         .catch(this.handleError)

  // }

  /**
   * 查询企业的创建人账号
   * param 企业id  用户id
   */
  getCreatUser(enterpriseId: string, objectId: any): Promise<any> {
    let url = this.dataServerSrc + '/user/getById?' + 'enterpriseId=' + enterpriseId + '&objectId=' + objectId + '&token=' + this.token;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }


  /*
   * 查询企业名称是否已经存在
   * 请求方式:GET
   * url: http://<cloudlink-core-framework-url>/enterprise/checkEnpName
   * 入参: "enterpriseName": 企业名称，必选，字符串类型
   *       "enterpriseId":"", 企业id，必选，字符串类型
   *
   *返回结果: {
   * 成功：{"success":1,"code":"200","msg":"ok","rows":[{"isExist":true}]}
   * 失败：{success:-1，msg:"对误信息",code:"对应错误编应错码"}
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   * */
  checkEnpName(name: string, enterpriseId: string, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/enterprise/checkEnpName';
    let params = {
      'name': name,
      'enterpriseId': enterpriseId,
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }
}
