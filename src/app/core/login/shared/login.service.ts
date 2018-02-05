import { GlobalState } from './../../../global.state';
import 'rxjs/add/operator/toPromise';

import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { Injectable } from '@angular/core';
import { ReplaySubject } from "rxjs";

// import { Login } from './login.model';
// import { TokenService } from './token.service';

@Injectable()
export class LoginService {
  constructor(
    private http: Http,
  ) { }


  private appCode = 'PaasCloud';
  private appId = '871e16bc-6e21-47fc-b358-47b9494179ff';
  private enterpriseId = "5acd6a55-7174-4072-9073-0b5a238f9d6a";
  // 定义两个微服务名字
  public fileServerSrc = '/cloudlink/v1/cloudlink-core-file';
  public dataServerSrc = '/cloudlink/v1/cloudlink-core-framework';

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


  getAuth(value: any): Promise<any> {
    let url = this.dataServerSrc + "/login/loginByPassword";
    let body = JSON.stringify({
      loginNum: value.text,
      password: value.password,
      enterpriseId: this.enterpriseId,
      appId: this.appId,
      validateType: 'mobile'
    });

    let options = new RequestOptions({ headers: this.JsonHeader });
    return this.http.post(url, body, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  // 退出？
  signout(token: any): Promise<any> {
    let url = this.dataServerSrc + "/login/logout" + "?token=" + token;
    let body = {};
    let options = new RequestOptions({ headers: this.JsonHeader });
    return this.http.post(url, body, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }
}
