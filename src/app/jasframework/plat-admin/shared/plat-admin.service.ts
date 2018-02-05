import { INCONFIG } from './../../../core/global';
import { Params } from '@angular/router';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
import { Grid } from './../../../demo/ui/components/grid/grid.component';
import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp, RequestOptions, Response } from "@angular/http";

@Injectable()
export class PlatAdminService {
  private token: string = window.localStorage["jasToken"];
  public userId: string = window.localStorage["userId"];
  public orgId: string = window.localStorage["orgId"];
  public appCode: string = INCONFIG.appCode;
  public appId: string = INCONFIG.appId;
  public enterpriseId: string = window.localStorage["enterpriseId"];
  // 微服务名字
  public fileServerSrc = INCONFIG.fileServerSrc;
  public dataServerSrc = INCONFIG.dataServerSrc;

  constructor(private http: Http, private commonRequestMethodService: CommonRequestMethodService) { }


  //    平台角色模块    接口
  /**
   * 获取平台角色管理  的 角色列表
   * @param appId 应用id
   * @param token 用户token
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public getRoleList(appId: any, appCode: any, __this, successHandler): Promise<any> {
    let url = this.dataServerSrc + '/role/getTreeByLoginUser';
    let params = {
      'appId': appId,
      'appCode': appCode,
      'selfIncluded': false
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler)
  }
  /**
   * 获取平台角色管理  的 角色列表 在添加弹窗中
   * @param __this 组件的this值
   * @param appId 应用id
   * @param token 用户token
   * @param successHandler 成功处理函数
   */
  public getRoleAddList(__this: any, appId: any, appCode: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/role/getTreeByLoginUser';
    let params = {
      'appId': appId,
      'appCode': appCode,
      'selfIncluded': true
    }
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);

  }
  /**
   * 添加角色
   * 点击保存按钮时    保存
   * @param body 表单中的内容
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public addSave(body: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/role/add';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)


  }
  /**
   * 获取角色信息
   * @param objectId 角色id
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public getRoleMsg(objectId: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/role/getById';
    let params = {
      'objectId': objectId
    }
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler)


  }
  /**
   * 检验角色Code是否重复
   * @param roleCode 角色code
   * @param appCode 应用code
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public checkRoleCode(roleCode: any, appCode: any, __this, successHandler): Promise<any> {
    let url = this.dataServerSrc + '/role/checkCode';
    let params = {
      'appCode': appCode,
      'enterpriseId': 0,
      'roleCode': roleCode,
    }
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler)
  }


  /**
   * 修改角色信息   保存
   * @param body 请求参数
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public editSave(body: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/role/update';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler);

  }
  /**
   * 删除角色
   * @param body 请求参数
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public deleteRole(body: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/role/delete';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler);
  }
  // /**
  //  * 获取角色授权树
  //  * @param parentId:父角色ID
  //  * @param appId 应用Id
  //  */
  // public roleTree(parentId: any, appId: any, appCode: any): Promise<any> {
  //     let url = this.dataServerSrc + '/role/getTreeByApp' + '?token=' + this.token + '&appId=' + appId + '&parentId=' + parentId + '&appCode=' + appCode;
  //     return this.http.get(url)
  //         .toPromise()
  //         .then(this.extractData)
  //         .catch(this.handleError)
  // }
  /**
   * 角色 可访问的数据
   * 获取角色可访问的应用列表
   * @param appCode 应用标识
   * @param appId 应用id值
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public AppListByRole(roleId: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/role/getAccessAppList';
    let params = {
      'roleId': roleId,
      'pageNum': -1
    }
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler)
  }
  /**
   * 获取角色的功能权限树
   * @param parentId 角色父节点id值
   * @param roleId 角色id值
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public getRoleTree(parentId: any, roleId: any, __this: any, successHandler: any) {
    let url = this.dataServerSrc + '/app/func/getTreeByRole';
    let params = {
      'roleId': roleId,
      'parentRoleId': parentId,
      'appId': this.appId
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler)
  }
  /**
   * 保存 角色的分配数据权限
   * @param __this 组件的this值
   * @param roleIds 角色id
   * @param appIds 应用id
   * @param successHandler 成功处理函数
   */
  public saveRoleDataPrivilege(__this: any, roleIds: any, appIds: any, successHandler: any) {
    let body = JSON.stringify({
      roleIds: roleIds,
      appIds: appIds
    })
    let url = this.dataServerSrc + '/role/assignData';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)


  }
  /**
   * 角色的分配功能权限  保存
   * @param __this 组件的this值
   * @param body 请求参数
   * @param successHandler 成功处理函数
   */
  public roleAssign(__this: any, body: any, successHandler: any): Promise<any> {
    body.deassign = true;  //是否重新分配
    body.appCode = this.appCode;
    let url = this.dataServerSrc + '/role/assignPrivilege';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }
  /**
   * 移除 角色 功能权限
   * @param __this 组件的this值
   * @param body 请求参数
   * @param successHandler 成功处理函数
   */
  public removeAssign(__this: any, body: any, successHandler: any): Promise<any> {
    // body.deassign = true;
    // body.appCode = this.appCode;
    let url = this.dataServerSrc + '/role/removePrivilege';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }

  //平台用户模块

  /**
   * 组织机构树 用户能看到的
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public orgTree(__this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/organization/getTree';
    let params = {
      'enterpriseId': this.enterpriseId,
      'parentId': this.orgId
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler)
  }

  /**
   * 用户列表
   * @param pageNum 页码
   * @param pageSize 页容量
   * @param orgId 组织机构id
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public getUserList(params, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/user/getListByEnterprise';
    // let params = {
    //   'enterpriseId': this.enterpriseId,
    //   'orgId': orgId,
    //   'pageNum': pageNum,
    //   'pageSize': pageSize
    // };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler)

  }

  /**
   * 获取用户在企业中的具体信息
   * @param userId 用户id值
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public getUserDetail(userId: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/user/getById';
    let params = {
      'objectId': userId,
      'enterpriseId': this.enterpriseId
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }
  /**
   * 获取用户的基本信息
   * @param userId 用户id
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public getUserBasicInfo(userId: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/user/getById';
    let params = {
      'objectId': userId,
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }
  /**
   * 移除用户
   * @param id 用户id值
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public delUser(id: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/user/removeFromEnterprise';
    let body = JSON.stringify({
      enterpriseId: this.enterpriseId,
      userIds: id
    });
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler);
  }
  /**
   * 添加用户
   * @param body 添加的用户信息
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public saveUserAdd(body: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/user/add';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler);
  }
  /**
   * 获取用户 基本信息
   * @param userId 用户id值
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public getUserMsg(userId: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/user/getById';
    let params = {
      'objectId': userId
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
  }

  /**
   * 编辑用户信息
   * @param body 编辑的用户信息
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public saveUserEdit(body: any, __this: any, successHandler: any): Promise<any> {

    let url = this.dataServerSrc + '/user/update';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }

  /**
   * 冻结用户
   * @param userId 用户id值
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public frozenUser(userId: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/user/freeze';
    let body = {
      'userIds': userId,
    }
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
    // return this.http.post(url, body, this.options)
    //   .toPromise()
    //   .then(this.extractData)
    //   .catch(this.handleError)
  }
  /**
   * 冻结用户在企业中的状态
   * @param userId 用户id值
   * @param enterpriseId 用户所在的企业id值
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public freezeUserFromEnterprise(userId: any, enterpriseId: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/user/freezeFromEnterprise';
    let body = {
      'userIds': userId,
      'enterpriseId': enterpriseId
    }
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }
  /**
   * 解冻用户
   * @param userId 用户id值
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public thawUser(userId: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/user/unfreeze';
    let body = {
      'userIds': userId,
    }
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
    // return this.http.post(url, body, this.options)
    //   .toPromise()
    //   .then(this.extractData)
    //   .catch(this.handleError)
  }
  /**
   * 解冻用户在企业中的状态
   * @param userId 用户id值
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public unfreezeUserFromEnterprise(userId: any, enterpriseId: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/user/unfreezeFromEnterprise';
    let body = {
      'userIds': userId,
      'enterpriseId': enterpriseId
    }
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }
  /**
   * 给用户分配角色
   * @param body 参数
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public userAssign(body: any, __this: any, successHandler: any): Promise<any> {
    body.deassign = true; //TRUE：重新分配,false：不重新分配；
    body.appCode = this.appCode; //应用标识 ，deassign=true时有效；
    let url = this.dataServerSrc + '/user/assignRoles';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }
  /**
   * 移除用户功能权限
   * @param body 参数
   * @param __this 组件的this值
   * @param successHandler 成功处理函数
   */
  public removeRole(body: any, __this: any, successHandler: any): Promise<any> {
    body.appCode = this.appCode;
    let url = this.dataServerSrc + '/user/removeRoles';
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)

  }
  /**
   * 邀请用户加入企业
   * @param body
   */
  public inviteUser(body: any, __this: any, successHandler: any): Promise<any> {
    let url = this.dataServerSrc + '/invite/inviteUser' + '?token=' + this.token;
    return this.commonRequestMethodService.doPost(__this, url, body, successHandler)
  }

  /**
   * 判断是否存在同名的邮箱和电话
   * @param __this 组件的this值
   * @param type 验证的类型
   * @param value 验证的值
   * @param userId 可选参数 用户id
   * @param successHandler 成功处理函数

   * @param successHandler 成功处理函数
   */
  isExitSame(__this: any, type: any, value: any, userId?: any, successHandler?: any): Promise<any> {
    let objectId = userId ? userId : '';
    let url = this.dataServerSrc + '/user/checkUser';
    let params = {
      'checkType': type,
      'checkValue': value,
      'userId': objectId
    };
    return this.commonRequestMethodService.doGet(url, params, __this, successHandler);

  }

}
