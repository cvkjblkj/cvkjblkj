import 'rxjs/add/operator/toPromise';

import { Headers, Http, Jsonp, RequestOptions, Response } from "@angular/http";
import { INCONFIG } from './../../../../../core/global'
import { Injectable } from '@angular/core';
import { OrganizationAdmin } from './organization-admin.model';
import { TreeNode } from 'primeng/primeng';
import { CommonRequestMethodService } from './../../../../../core/common-service/request-method.service'
@Injectable()
export class OrganizationAdminService {
  public dataServerSrc = INCONFIG.dataServerSrc;

  constructor(
    private http: Http,
    private commonRequestMethodService: CommonRequestMethodService
  ) { }
	/**
   * 获取组织机构树
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
	 * 删除组织机构
	 * params 组织机构id值
	 */
  delete(__this: any, url: any, value: any, successhandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doPost(__this, requestUrl, value, successhandler);
  };

	/**
   * 查看组织机构
   * @param url
   * @param params
   * @param _this
   * @param successhandler
   * @param errorhandler
   */
  getOrganizationMes(url: any, params?: any, _this?: any, successhandler?: any, errorhandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doGet(requestUrl, params, _this, successhandler, errorhandler);
  };

	/**
	 * 添加组织机构
	 * params
	 * 必选参数：
			token
			部门名称orgName(string)
			所属企业：enterpriseId(string)
			父部门ID：parentId(string)
			可选参数：
			负责人：manager(用户ID）
	 */
  addSave(__this: any, url: any, value: any, successhandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doPost(__this, requestUrl, value, successhandler);
  };
	/**
	 * 判断部门名称是否存在
	 * parameter
	 * 		orgName 组织机构名称
			orgId 父组织机构ID
			enterpriseId 企业ID
	 */

  isExist(url: any, params?: any, _this?: any, successhandler?: any, errorhandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doGet(requestUrl, params, _this, successhandler, errorhandler);
  };
  /*编辑本门名称校验*/



	/**
	 * 更新组织机构
	 * params
	 * 必填参数：token    组织机构ID：objectId(string),
	 *可更新参数：
			部门名称orgName
			父部门ID：parentId
			负责人：manager(用户ID）
	 */
  updateSave(__this: any, url: any, value: any, successhandler?: any) {
    let requestUrl = this.dataServerSrc + url;
    this.commonRequestMethodService.doPost(__this, requestUrl, value, successhandler);
  };
}
