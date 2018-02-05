import 'rxjs/add/operator/toPromise';
//http返回结果中一些错误处理,比如404,500,等错误
import {CommonRequestMethodService} from './../../../../core/common-service/request-method.service';

import {Headers, Http, Jsonp, RequestOptions, Response} from "@angular/http"

import {Injectable} from '@angular/core';

@Injectable()
export class AppEnterpriseApplicationService {
    private JsonHeader = new Headers({'Content-Type': 'application/json'});

    private extractData(res: Response) {
        let body = res.json();
        // console.log(body['rows'])
        return body || {};
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);

    }

    private token: string = window.localStorage['jasToken'];

    // 定义两个微服务名字
    public fileServerSrc = '/cloudlink/v1/cloudlink-core-file';
    public dataServerSrc = '/cloudlink/v1/cloudlink-core-framework';

    constructor(private http: Http, private commonRequestMethodService: CommonRequestMethodService) {
    }

    /*
     * 获取当前登录用户管理的的应用列表（支持分页）
     * 请求方式:GET
     * url: http://<cloudlink-core-framework-url>/user/getManagedAppList
     * 入参: {   "appCode":"",   //应用英文标识，可选，字符串类型，最大长度50
     *          "appName":"",   //应用中文名称，可选，字符串类型，最大长度200
     *          "status":"",    //应用状态，可选，数字类型，支持多组合
     *      }
     *返回结果: {
     * 成功：{token: ””，success:1,rows:[ 应用对象列表 ]}
     * 失败：{success:-1，msg："对应错误信息",code:"对应错误编码"}
     * }
     * 可选参数：appCode?:string, appName?:string, status?:string,pageNum?: string | number, pageSize?: number | string
     */
    // getEnterpriseAppName(params: any, __this: any, successHandler: any): Promise<any> {
    //     // let url = this.dataServerSrc + "/app/getUserManagedApp?" + "appCode="+ appCode + "&appName=" + appName + "&status="
    //     //     + status + "&pageNum=" + pageNum + "&pageSize=" + pageSize+ '&token=' + this.token;
    //     let url = this.dataServerSrc + "/user/getManagedAppList";
    //
    //   return this.commonRequestMethodService.doGet(url, params, __this, successHandler);
    // }
}
