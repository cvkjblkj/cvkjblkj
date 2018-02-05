import { INCONFIG } from './../../../core/global';
import { objectify } from 'tslint/lib/utils';
import { ANY_STATE } from '@angular/compiler/src/private_import_core';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TreeNode } from 'primeng/primeng';
import 'rxjs/add/operator/toPromise';
import { CommonRequestMethodService } from './../../../core/common-service/request-method.service';
@Injectable()
export class MonitorService {
  constructor(
    private http: Http,
    private commonRequestMethodService: CommonRequestMethodService
  ) { };

  public zipkinServerSrc = INCONFIG.zipkinServerSrc;

  /**
   * 接口服务
   * @param serviceName
   */
  public getList(url: any, params?: any, _this?: any, successhandler?: any, errorhandler?: any) {
    let requestUrl = this.zipkinServerSrc + url;
    params = {
      serviceName: params
    }
    this.commonRequestMethodService.doGet(requestUrl, params, _this, successhandler, errorhandler);
  };

  /**
   * 服务接口
   */
  public getServices(url: any, params?: any, _this?: any, successhandler?: any, errorhandler?: any) {
    let requestUrl = this.zipkinServerSrc + url;
    this.commonRequestMethodService.doGet(requestUrl, params, _this, successhandler, errorhandler);
  };

  /**
   * 获取列表的数据
   */
  search(url: any, params?: any, _this?: any, successhandler?: any, errorhandler?: any) {
    let requestUrl = this.zipkinServerSrc + url;
    this.commonRequestMethodService.doGet(requestUrl, params, _this, successhandler, errorhandler);
  };

}
