
import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp, RequestOptions, Response } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class JasService {

  private token: string = window.localStorage["jasToken"];
  private JsonHeader = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.JsonHeader });
  // 微服务名字
  public fileServerSrc = '/cloudlink/v1/cloudlink-core-file';
  public dataServerSrc = '/cloudlink/v1/cloudlink-core-framework';

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

  constructor(private http: Http) { }

  public getMenu(parentId: any): Observable<any> {
    let url = this.dataServerSrc + '/app/view/getTreeByLoginUser' + '?token=' + this.token + '&parentId=' + parentId + '&viewFuncType=1' + '&appCode=PaasCloud' + '&viewTypeCode=WebManage';
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError)
  }

}

