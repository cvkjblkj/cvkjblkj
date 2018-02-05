import 'rxjs/add/operator/toPromise';

import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { Injectable } from '@angular/core';
import { ReplaySubject } from "rxjs";

@Injectable()
export class RegisterService {

    constructor(
        private http: Http
    ) { }

    // 企业id和系统id
    private systemId = '';
    private enterpriseId = "b909b469-f7e6-4c98-85a0-98e1c2b54a4e";
    // 定义两个微服务名字
    public fileServerSrc = '/cloudlink/v1/cloudlink-core-file';
    public dataServerSrc = '/cloudlink/v1/cloudlink-core-framework';

    private JsonHeader = new Headers({ 'Content-Type': 'application/json' });
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

    register(value: any): Promise<any> {
        let url = this.dataServerSrc + "/login/loginByPassword";
        let body = JSON.stringify({
            loginNum: value.text,
            password: value.password,
            enterpriseId: this.enterpriseId,
            systemId: this.systemId,
        });
        let options = new RequestOptions({ headers: this.JsonHeader });
        return this.http.post(url, body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }
}