import { INCONFIG } from './../../../core/global';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AppAdmin } from './app-admin.model';

@Injectable()
export class AppAdminService {
  private token: string = window.localStorage["jasToken"];
  // 微服务名字
  public fileServerSrc = INCONFIG.fileServerSrc;
  public dataServerSrc = INCONFIG.dataServerSrc;

  constructor(private http: Http, private commonRequestMethodService: CommonRequestMethodService) { }

	/**
	 * 获取角色列表数据
	 * 可以通过角色名称搜索
   * @param _this 调用组件的this指向
   * @param params 参数
            appCode 应用标识
      	    appId 应用id
            roleName 角色名称
   * @param successHandler 请求成功之后的处理函数
	 */
  public getRoleList(__this: any, params: any, successHandler: any): Promise<any> {

    let url = this.dataServerSrc + '/role/getTreeByApp';

    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }

  /**
   * 通过角色名称，搜索
   * @param __this 调用组件的this
   * @param appCode 应用的code
   *        appId  应用Id
   *        roleName 应用下的角色名称
   * @param successHandler 请求成功之后的处理函数
   */
  public searchRole(__this: any, params: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/role/getTreeByApp';
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }
	/**
	 * 删除角色
	 * @param roleId 角色id值
	 */
  public deletRole(__this, body, successHandler): Promise<any> {
    let url = this.dataServerSrc + "/role/delete";
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler);

  }
  // /**
  //  * 获取角色的信息 进行编辑
  //  * @param roleId 角色id值
  //  */
  // public getRoleInfo(roleId: any): Promise<any> {
  //   let url = this.dataServerSrc + "/role/getById" + '?token=' + this.token + '&objectId=' + roleId;
  //   return this.http.get(url)
  //     .toPromise()
  //     .then(this.extractData)
  //     .catch(this.handleError)
  // }
	/**
   * 保存 添加角色
   * @param _this 调用的this指向
   * @param body 需要保存的参数
   * @param successHandler 请求成功之后的处理函数
   */
  public saveRoleInfo(__this: any, body: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + "/role/add";
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler);
  }

	/**
   * 编辑角色  保存
   * @param ___this 调用组件的this
   * @param body 请求参数
   * @param successHandler 请求成功之后的处理函数
   */
  public editSaveRole(__this: any, body: any, successHandler: any): Promise<any> {
    delete body.id;
    let url = this.dataServerSrc + '/role/update';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }

	/**
   * 获取角色的权限功能树
   * @param ___this 调用组件的this指向
   * @param params 请求参数
	 *        roleIds 授权的角色id值
	 *        parentId 授权的角色id值
	 *        appCode 应用下的id
   * @param successHandler 请求成功后的处理函数
   */
  public getRoleTree(__this: any, params: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/app/func/getTreeByRole';
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }

	/**
	 * 角色的分配功能权限  保存
	 * @param privilegeIds 角色添加的  权限id值
	 */
  public roleAssign(body: any, appCode: any, __this: any, successHandler: any): Promise<any> {
    // body.deassign = true;
    body.deassign = true;
    body.appCode = appCode;
    let url = this.dataServerSrc + '/role/assignFuncs';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
    // role/assignPrivilege
  }
	/**
	 * 角色的分配功能权限  保存
   * 新的 角色授权 接口，包含功能和规则
	 * @param 
	 */
  public roleAssignPri(body: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/role/assignPrivilege';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }


  /**
   * 角色的分配功能权限  移除
   * @param privilegeIds 角色添加的  权限id值
   */
  public removeRoleAssign(body: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/role/removePrivilege';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }

  /**
   * 给角色分配功能和数据规则
   * 
   * @param {*} body roleId（必选）：角色id，
   *                 funcIds（必选）:功能id，
   *                 ruleIds（必选）:规则id，
   *                 deassign?(可选):boolean(是否在分配前先移除以分配的功能权限和数据规则)
   * @param {*} __this 
   * @param {*} successHandler 
   * @returns 
   * @memberof AppAdminService
   */
  public assignPrivilege(body: any, __this: any, successHandler: any) {
    let url = this.dataServerSrc + '';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }




  //////////////////////////// 资源管理 start ////////////////////////////


  /**
   * 获取资源的列表数据
   * post请求
   * @param {*} params 请求参数 appId
   * @param {*} __this
   * @param {*} successHandler
   * @returns
   * @memberof AppAdminService
   */
  public getResList(body: any, __this: any, successHandler: any) {
    let url = this.dataServerSrc + '/app/dataresource/query';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler);
  }
  /**
   * 添加资源
   *
   * @param {*} body  {appId:string,resourceCode：string,resourceName:string,parentId?:string,description?:String,remark?:String}
   * @param {*} __this
   * @param {*} successHandler
   * @returns 请求后的数据
   * @memberof AppAdminService
   */
  public addResourceReq(body: any, __this: any, successHandler: any) {

    let url = this.dataServerSrc + '/app/dataresource/add';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }

  /**
   * 更新资源
   * post 请求，编辑修改后保存的资源
   * @param {*} body  {objectId:String,resourceName?:string,parentId?:string,description?:String,remark?:String}
   * @param {*} __this
   * @param {*} successHandler
   * @returns 请求后的数据
   * @memberof AppAdminService
   */
  public UpdateResourceReq(body: any, __this: any, successHandler: any) {

    let url = this.dataServerSrc + '/app/dataresource/update';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }
  /**
   * 获取资源信息
   * 编辑资源和查看资源信息, get请求
   *
   * @param {*} body  objectId
   * @param {*} __this
   * @param {*} successHandler
   * @returns
   * @memberof AppAdminService
   */
  public getResourceByIdReq(body: any, __this: any, successHandler: any) {
    let url = this.dataServerSrc + '/app/dataresource/getById';
    return this.commonRequestMethodService.doGet(url, body, __this, successHandler)
  }


  /**
    * 查询数据资源是否关联功能
    * 删除数据资源之前提醒用户是否关联功能
    *
    * @param {*} body   objectId,删除的数据资源ID
    * @param {*} __this
    * @param {*} successHandler
    * @returns
    * @memberof AppAdminService
    */
  public confirmConnectFuncResourceReq(body: any, __this: any, successHandler: any) {
    let url = this.dataServerSrc + '/app/dataresource/delete/confirm';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }

  /**
   * 删除资源
   *
   * @param {*} body   objectId,删除的数据资源ID，如果删除的节点含有子节点，则传父节点和所以子节点的Id,用逗号隔开
   * @param {*} __this
   * @param {*} successHandler
   * @returns
   * @memberof AppAdminService
   */
  public deleteResourceReq(body: any, __this: any, successHandler: any) {
    let url = this.dataServerSrc + '/app/dataresource/delete';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }

  /**
   * 验证输入 资源编码 是否重复
   * post 请求
   * @param {*} body
   * @param {*} __this
   * @param {*} successHandler
   * @returns
   * @memberof AppAdminService
   */
  public verifyCode(body: any, __this: any, successHandler: any) {
    let url = this.dataServerSrc + '/app/dataresource/checkCode';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }

  /**
   * 功能资源中 关联数据
   *
   * @param {*} body
   * @param {*} __this
   * @param {*} successHandler
   * @returns
   * @memberof AppAdminService
   */
  public saveConnectedData(body: any, __this: any, successHandler: any) {
    let url = this.dataServerSrc + '/app/func/setDataresource';
    // return this.commonRequestMethodService.doGet(url, body, __this, successHandler)
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }

  /**
    * 移除 功能 关联的数据资源
    *
    * @param {*} body
    * @param {*} __this
    * @param {*} successHandler
    * @returns
    * @memberof AppAdminService
    */
  public delConnectedData(body: any, __this: any, successHandler: any) {
    let url = this.dataServerSrc + '/app/func/deleteDataresource';
    // return this.commonRequestMethodService.doGet(url, body, __this, successHandler)
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }

  //////////////////////////// 资源管理 end ////////////////////////////










  /**
   * 改变  数据资源的返回数据结构为  树状的 结构的数据
   *
   * @param {*} arr
   * @param {*} resultValue 结果
   * @memberof DataResourceComponent
   */
  changeDropDownData(arr: any, resultValue: any, nodeId?: any, type?: any) {
    if (!arr) return;
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      let label = item['text'];
      let id = item['id'];
      let children = item['children'];
      let attr = item['attributes'];
      let datas = {
        'label': label,
        'id': id,
        'children': [],
        'attributes': attr,
        'action': attr.action,
        'resourceCode': attr.funcCode,
        'expanded': true,
        checked: item.checked
      }
      if (children) {
        if (nodeId && nodeId != id && !type) {
          // 编辑,将自身及子节点删除
          resultValue[resultValue.length] = datas;
          if (children.length >= 1) {
            this.changeDropDownData(children, resultValue[resultValue.length - 1].children, nodeId);
          }
        } else if (!nodeId) {
          // 添加
          resultValue[i] = datas;
          if (children.length >= 1) {
            this.changeDropDownData(children, resultValue[i].children);
          }
        } else if (nodeId && type) {
          // 树 节点选中
          if (nodeId == id) {
            datas.checked = true;
          }
          resultValue[i] = datas;
          if (children.length >= 1) {
            this.changeDropDownData(children, resultValue[i].children, nodeId, type);
          }
        }

      }
    }
    return resultValue
  };
}

