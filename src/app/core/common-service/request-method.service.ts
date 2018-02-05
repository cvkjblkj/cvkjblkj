import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ConfirmationService } from 'primeng/primeng';
import { Router, } from '@angular/router';
declare var $: any;

@Injectable()
export class CommonRequestMethodService {
  private token: string = window.localStorage['jasToken'];
  private appCode: string = window.localStorage['appCode'];
  private viewTypeCode: string = 'WebManage';
  public viewTypeId: string = '';
  private JsonHeader = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.JsonHeader });
  // 微服务名字
  public fileServerSrc = '/cloudlink/v1/cloudlink-core-file';
  public dataServerSrc = '/cloudlink/v1/cloudlink-core-framework';

  constructor(private http: Http, private confirmationService: ConfirmationService, private route: Router) { }


  /**
   * post请求
   * @param ___this 调用服务的组件的 this指向
   * @param url 请求的url
   * @param data 请求的参数
   * @param successHandler 成功获取数据的处理函数
   * @param errorHandler 没有获取到数据的处理函数
   */
  doPost(__this: any, url: string, data: any, successHandler?: any, errorHandler?: any): any {
    let urls = url + '?token=' + this.token;
    let options = new RequestOptions({ headers: this.JsonHeader });
    return this.http.post(urls, data, options)
      .toPromise()
      .then((res: Response) => {
        let rel = res.json();
        if (rel['code'] == '402') {
          let msg = '登录超时，请重新登录！';
          this.confirmationService.confirm({
            message: msg,
            accept: () => {
              this.route.navigate(['./login']);
            }
          })
        }
        // 成功的处理函数
        successHandler(res.json());
      })
      .catch(error => {
        if (error.status == 500) {
          //
          this.errorHand(__this, 'error', '服务器发生未知错误');

        } else if (error.status == 400) {
          this.errorHand(__this, 'error', '网页发生未知错误，请联系管理员');
        } else if (error.status == 401) {
          let msg = '登录超时，请重新登录！';
          this.confirmationService.confirm({
            message: msg,
            accept: () => {
              this.route.navigate(['./login'])
            }
          })
        }
        if (errorHandler && typeof errorHandler == 'function') {
          errorHandler(error.status);
        }

      });


  }


  /**
   * get 请求
   * @param url 请求路径
   * @param ___this 调用服务的组件  this指向
   * @param params 请求参数
   * @param successHandler 成功的处理函数
   * @param errorHandler  识别的处理函数
   */
  doGet(url: string, params?: any, __this?: any, successHandler?: any, errorHandler?: any): any {
    let urls = url + '?token=' + this.token;
    let searchParams = '';
    // params 存在且不能为空
    if (params && !$.isEmptyObject(params)) {
      for (var key in params) {
        searchParams += '&' + key + '=' + params[key];
      }
    }
    urls = urls + searchParams;
    let options = new RequestOptions({ headers: this.JsonHeader });
    return this.http.get(urls)
      .toPromise()
      .then((res: Response) => {
        let rel = res.json();
        if (rel['code'] == '402') {
          let msg = '请重新登录';
          this.confirmationService.confirm({
            message: msg,
            accept: () => {
              this.route.navigate(['./login'])
            }
          })
        }
        // 成功的处理函数
        successHandler(res.json());
      })
      .catch(error => {
        if (error.status == 500) {
          this.errorHand(__this, 'error', '服务器发生未知错误');

        } else if (error.status == 400) {
          this.errorHand(__this, 'error', '网页发生未知错误，请联系管理员');
        } else if (error.status == 401) {
          let msg = '请重新登录';
          this.confirmationService.confirm({
            message: msg,
            accept: () => {
              this.route.navigate(['./login'])
            }
          })
        };
        if (errorHandler && typeof errorHandler == 'function') {
          errorHandler(error.status);
        }
      });
  }
  // 失败的处理函数，调用growl插件
  errorHand(__this, rel, msg) {
    __this.msgs = [];
    __this.msgs.push({ severity: rel, summary: '', detail: msg })
  }
}
