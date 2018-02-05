import 'rxjs/add/operator/toPromise';

import { Headers, Http, Response } from '@angular/http';

import { Injectable } from '@angular/core';

@Injectable()
export class AppViewService {
  private token: string = window.localStorage["jasToken"];
  private JsonHeader = new Headers({ 'Content-Type': 'application/json' });
  // 微服务名字
  public fileServerSrc = '/cloudlink/v1/cloudlink-core-file';
  public dataServerSrc = '/cloudlink/v1/cloudlink-core-framework';
  constructor(private http: Http) { }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  getViewList(appId) {
    let url = `${this.dataServerSrc}/app/view/type/queryList?appId=${appId}&token=${this.token}`;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }
  addViewList(obj) {
    let url = `${this.dataServerSrc}/app/view/type/add?token=${this.token}`;
    return this.http.post(url, JSON.stringify(obj), { headers: this.JsonHeader })
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  /*云产品研发平台-接口使用说明书-V2.0.1  2017-05-17
   * 删除视图类型
   * 请求方式:post
   * http://<cloudlink-core-framework-url>/app/view/type/delete
   * 入参: {
   *      objectId: 视图类型ID，必选，字符类型
   *      checked: 删除前是否校验，默认为true，可选，布尔类型.
   *              校验顺序：该类型下是否已定义视图，如果校验结果为true，则不允许删除
   *      }
   *返回结果: {
   * 成功：{ "success": 1, "code": "200", "msg": "ok", "rows": [  { "booleanResult": true } ]}
   * 失败：{success:-1，msg："对应错误信息",code:"对应错误编码","rows":[]}
   *      【类型ID为空】{success:-1，msg:" 视图类型ID不能为空！",code:"403"}
   *      【已被视图调用】｛success:-1,msg:“该视图类型已被视图调用！”，code:”PU00221”！“,code:“PU00230”｝
   *      【应用视图Code重复】：｛success:-1,msg:“应用视图Code重复！“,code:“PU00212”｝
   *      }
   */
  deleteViewList(obj) {
    let url = `${this.dataServerSrc}/app/view/type/delete?token=${this.token}`;
    return this.http.post(url, JSON.stringify(obj), { headers: this.JsonHeader })
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  /*云产品研发平台-接口使用说明书-V2.0.1  2017-05-17
   * 获取应用视图树
   * 请求方式:Get
   * http://<cloudlink-core-framework-url>/app/view/getTree
   * 入参: appId:        【应用ID，字符类型】 和appCode至少有一个不能为空
   *      appCode:      【应用Code，字符类型】和appId至少有一个不能为空
   *      viewTypeId:   【视图类型ID，必选，字符类型】和viewTypeCode至少有一个不能为空
   *      viewTypeCode: 【视图类型Code，必选，字符类型】和viewTypeId至少有一个不能为空
   *      parentId:     【父节点ID，可选，字符类型】
   *      viewFuncType: 【功能类型，可选，字符类型，支持组合查询，多个用逗号隔开，默认为所有类型，取值范围：1|2】1菜单，2 按钮
   *      selfIncluded: 【是否包含自身，可选，默认为true】
   *      isQueryAll:   【是否查询所有,可选，默认为true】
   *返回结果:
   * 成功：{"success": 1,"code": "200","msg": "ok","rows": [{视图树}]}
   * 失败：{success:-1，msg："对应错误信息",code:"对应错误编码","rows":[]}
   *      【应用ID和应用Code均为空】｛success: -1, msg: " 应用ID和应用Code至少有一个不能为空！",code: "403"｝
   *      【视图类型ID和视图类型Code都为空】｛success: -1,msg:"视图类型ID和视图类型Code至少有一个不能为空！",code: "403"｝
   */
  getViewData(viewTypeId, appId) {
    let url = `${this.dataServerSrc}/app/view/getTree?viewTypeId=${viewTypeId}&token=${this.token}&appId=${appId}`;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }
  getfunctionTree(appCode) {
    let url = `${this.dataServerSrc}/app/func/getTree?appCode=${appCode}&token=${this.token}`;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  /*云产品研发平台-接口使用说明书-V2.0.1  2017-05-16
   * 添加应用视图
   * 请求方式:post
   * url: http://<cloudlink-core-framework-url>/app/view/add
   * 入参: {"appId":应用ID，字符类型
   *      appCode:应用Code，字符类型
   *      viewFuncName: 视图功能名称，必选，字符类型，最大长度为200
   *      viewFuncCode: 视图功能Code，必选，字符类型，最大长度为50
   *      viewTypeId: 视图类型ID, 必选，字符类型，最大长度为50
   *      parentId: 父节点ID，必选，字符类型，最大长度为50
   *      viewFuncType: 视图功能类型，可选, 整型：1菜单2 按钮，默认为菜单
   *      funcId: 关联功能ID,可选，字符类型，最大长度为50
   *      icon: 图标样式，可选，字符类型，最大长度为500
   *      handeler: 按钮处理函数，可选，字符类型，最大长度为50
   *      url: URL，可选，字符类型，最大长度为500
   *      description: 视图功能描述，可选，字符类型，最大长度为2000
   *      remark: 备注，可选，字符类型，最大长度为2000
   *      opened: 是否开放：1开放 0不开放，默认为0开放的功能视图不受权限约束
   *      }
   *返回结果: {
   * 成功：{ "success": 1, "code": "200", "msg": "ok","rows": [  { "objectId": "功能视图ID" } ]}
   * 失败：{success:-1，msg："对应错误信息",code:"对应错误编码","rows":[]}
   *      【应用ID和应用Code】｛success:-1,msg:“应用ID和应用Code至少有一个不能为空！“,code:“403”｝
   *      【父节点为空】：{success:-1，“msg”：”父节点ID不能为空！”,code:”403”}
   *      【视图类型ID为空】：｛success:-1,msg:“视图类型ID不能为空！“,code:“403”｝
   *      【视图功能名称为空】：｛success:-1,msg:“视图功能名称不能为空！,code:“403”｝
   *      【视图功能Code为空】：｛success:-1,msg:“视图功能Code不能为空！“,code:“PU00201”｝
   *      【应用不存在】：｛success:-1,msg:“应用不存在！“,code:“PU00000”｝
   *      【视图类型不存在】：｛success:-1,msg:“该视图类型不存在！,code:“PU00201”｝
   *      【视图类型所属应用和参数应用不一致】：｛success:-1,msg:“应用视图类型不属于该应用！”,code:“PU00231”｝
   *      【父节点不存在】：｛success:-1,msg:“父应用视图节点不存在！“,code:“PU00200”｝
   *      【父节点所属应用和参数应用不一致】：｛success:-1,msg:“父应用视图节点不属于该应用！“,code:“PU00230”｝
   *      【应用视图Code重复】：｛success:-1,msg:“应用视图Code重复！“,code:“PU00212”｝
   * }
   */
  addView(obj) {
    let url = `${this.dataServerSrc}/app/view/add?token=${this.token}`;
    return this.http.post(url, JSON.stringify(obj), { headers: this.JsonHeader })
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  /*云产品研发平台-接口使用说明书-V2.0.1  2017-05-18
   * 更新应用视图基本信息
   * 请求方式:Post
   * http://<cloudlink-core-framework-url>/app/view/update
   * 入参: objectId:        【要更新的视图ID，必选，字符类型】
   *      可更新字段:
   *      viewFuncName:      【视图功能名称，必选，字符类型，最大长度为200】
   *      viewFuncCode:   【视图功能Code，必选，字符类型，最大长度为50】 同一应用视图类型下必须唯一
   *      viewFuncType:   【视图功能类型，可选：1菜单2 按钮, 整型】
   *      funcId:         【关联功能ID,可选，字符类型，最大长度为50】
   *      icon:           【图标样式，可选，字符类型，最大长度为500】
   *      handeler:       【按钮处理函数，可选，字符类型，最大长度为50】
   *      url:            【URL，可选，字符类型，最大长度为500】
   *      description:    【视图功能描述，可选，字符类型，最大长度为2000】
   *      remark:         【备注，可选，字符类型，最大长度为2000】
   *      
   *返回结果:
   * 成功：{ "success": 1, "code": "200", "msg": "ok","rows": [  { "objectId": "视图ID"  } ]}
   * 失败：{success:-1，msg："对应错误信息",code:"对应错误编码","rows":[]}
   *      【应用视图ID为空】｛success:-1,msg:“应用视图ID不能为空！“，code:”403｝
   *      【更新字段为空】｛success:-1,msg:“要更新的字段不能为空！，code:”403｝
   *      【应用视图不存在】｛success:-1,msg:”该应用视图不存在！”,code:”PU00202｝
   *      【应用视图Code重复】｛success:-1,msg:”应用视图Code重复！”,code:” PU00212”｝
   *      【父节点不存在】｛success:-1,msg:” 父应用视图节点不存在！”,code:” PU00200”｝
   *      【父节点所属应用和要更新的视图所属应用不一致】｛success:-1,msg:”父应用视图节点不属于该应用！”,code:” PU00230”｝
   */
  putViewData(obj) {
    let url = `${this.dataServerSrc}/app/view/update?token=${this.token}`;
    return this.http.post(url, JSON.stringify(obj), { headers: this.JsonHeader })
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  deleteViewData(id) {
    let obj = { 'objectId': id };
    let url = `${this.dataServerSrc}/app/view/delete?token=${this.token}`;
    return this.http.post(url, JSON.stringify(obj), { headers: this.JsonHeader })
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  /*云产品研发平台-接口使用说明书-V2.0.1  2017-05-17
   * 校验视图Code是否重复
   * 请求方式:Get
   * http://<cloudlink-core-framework-url>/app/view/checkCode
   * 使用场景: 给应用添加新视图或更新视图信息时校验应用视图Code是否重复
   * 入参: {
   *      viewTypeId:   【视图类型ID,必选，字符类型】
   *      viewFuncCode: 【应用视图标识,必选，字符类型】
   *      viewId:       【视图ID,可选，字符类型】更新视图校验Code时必选以排除自身
   *      }
   *返回结果: {
   * 成功：{ "success": 1,"code": "200","msg": "ok","rows": [ {  "isExist": true|false}]}
   * 失败：{success:-1，msg："对应错误信息",code:"对应错误编码","rows":[]}
   *      【应用视图类型ID为空】{success:-1，msg:" 应用视图类型ID不能为空！",code:" 403"}
   *      【视图Code为空】{success:-1，msg:" 应用视图Code不能为空！",code:" 403"}
   *      }
   */
  checkCode(viewFuncCode: any, viewTypeId: any) {
    let url = this.dataServerSrc + '/app/view/checkCode?' + 'viewFuncCode=' + viewFuncCode + '&viewTypeId=' + viewTypeId + '&token=' + this.token;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  /*云产品研发平台-接口使用说明书-V2.0.1  2017-05-17
   * 校验视图类型Code是否重复
   * 请求方式:Get
   * http://<cloudlink-core-framework-url>/app/view/type/checkCode
   * 使用场景: 给应用添加新视图类型或更新视图类型信息时校验应用视图类型Code是否重复
   * 入参: {
   *      appId:        【应用ID，字符类型】 和appCode至少有一个不能为空
   *      appCode:      【应用Code，字符类型】和appId至少有一个不能为空
   *      viewTypeCode: 【视图类型英文标识，必选，字符类型】
   *      viewTypeId:   【视图类型ID,可选，字符类型】更新视图类型校验Code时必选以排除自身
   *      }
   *返回结果: {
   * 成功：{ "success": 1,"code": "200","msg": "ok","rows": [ {  "isExist": true|false}}]}
   * 失败：{success:-1，msg："对应错误信息",code:"对应错误编码","rows":[]
   *      【应用ID和应用Code都为空】{success:-1，msg:" 应用ID和应用Code至少有一个不能为空！",code:" 403"}
   *      【视图类型Code为空】{success:-1，msg:" 视图类型Code不能为空！",code:" 403"}
   *      【应用不存在】：｛success:-1,msg:“应用不存在！“,code:“PU00000”｝
   *      }
   */
  checkViewTypeCode(viewTypeCode, appId) {
    let url =`${this.dataServerSrc}/app/view/type/checkCode?viewTypeCode=${viewTypeCode}&appId=${appId}&token=${this.token}`;
    return this.http.get(url)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError)
  }

  checkName(viewTypeName: any, appId: any) {
    let url = this.dataServerSrc + '/app/view/type/checkCode?' + 'viewTypeName=' + viewTypeName + '&appId=' + appId + '&token=' + this.token;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }
  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Promise.reject(errMsg);

  }

  /**
 * 获取视图的基本信息
 */
   getViewInfo(objectId: any) {
    let url = this.dataServerSrc + '/app/view/getById?' + 'objectId=' + objectId + '&token=' + this.token;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)

  }
}
