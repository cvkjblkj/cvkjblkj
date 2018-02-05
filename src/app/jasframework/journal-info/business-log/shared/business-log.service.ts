import 'rxjs/add/operator/toPromise';

import { Headers, Http, Jsonp, RequestOptions, Response } from "@angular/http";
import { INCONFIG } from './../../../../core/global'; //引入API路径
import { Injectable } from '@angular/core';

@Injectable()
export class BusinessLogServer {
  private JsonHeader = new Headers({ 'Content-Type': 'application/json' });
  public token = INCONFIG.getToken();
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


  constructor(private http: Http) {
  }

  /* 获取业务日志的数据
  * pageNum: 分页的第几页
  * pageSize: 每页有多少条数据
  * */
  getBusinessLogData(pageNum: any, pageSize: any): Promise<any> {
    let url = INCONFIG.journalServerSrc + "/log/business/v2/queryList" + "?token=" + this.token;
    + '?pageNum=' + pageNum + '&pageSize=' + pageSize;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

}
