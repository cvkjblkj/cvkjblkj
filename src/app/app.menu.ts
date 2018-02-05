import { CommonRequestMethodService } from './core/common-service/request-method.service';
import 'rxjs/add/operator/toPromise';

import { Headers, Http, Jsonp, RequestOptions, Response } from "@angular/http";

import { Injectable } from '@angular/core';

export declare type TreeNodes = TreeNode[];

export interface TreeNode {
  id?: string;       //节点ID
  text?: string;    //节点名称
  children?: TreeNode[];  //子节点
  attributes?: any;   //节点其他属性
};



@Injectable()
export class MenuService {
  private token: string = window.localStorage['jasToken'];
  private appCode: string = window.localStorage['appCode'];
  private viewTypeCode: string = 'WebManage';
  public viewTypeId: string = '';
  public parentId: string = '30c97ab2-c4c2-4906-88ad-1da49a9a30de';
  public fileServerSrc = '/cloudlink/v1/cloudlink-core-file';
  public dataServerSrc = '/cloudlink/v1/cloudlink-core-framework';

  constructor(
    private http: Http,
    private commonRequestMethodService: CommonRequestMethodService
  ) {

  }
  private JsonHeader = new Headers({ 'Content-Type': 'application/json' });
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
  getMenu(__this, successHandler) {
    // let url = this.dataServerSrc + '/app/view/getUserTree?' + "appCode=" + this.appCode + "&viewTypeCode=" + this.viewTypeCode+'&token='+this.token ;
    let params = {
      parentId: this.parentId,
      viewTypeCode: this.viewTypeCode,
      // token: this.token,
      appCode: this.appCode,
      selfIncluded: false,
      viewFuncType: 1
    }
    let url = this.dataServerSrc + '/app/view/getTreeByLoginUser';
    // + "parentId=" + this.parentId + "&viewTypeCode=" + this.viewTypeCode + '&token=' + this.token + '&appCode=' + this.appCode + '&selfIncluded=false' + '&viewFuncType=1';;
    this.commonRequestMethodService.doGet(url, params, __this, successHandler)

    // return this.http.get(url)
    //   .toPromise()
    //   .then(this.extractData)
    //   .catch(this.handleError)
  }
}
