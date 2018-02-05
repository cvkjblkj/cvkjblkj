import 'rxjs/add/operator/toPromise';

import { Headers, Http, Jsonp, RequestOptions, Response } from "@angular/http";

import { Injectable } from '@angular/core';
import {ApplicationAdmin} from './application-admin.model'
@Injectable()

export class AppAdminService {


constructor( private http: Http){}
	 private token: string = window.localStorage['jasToken'];
   private JsonHeader = new Headers({ 'Content-Type': 'application/json' });
   public dataServerSrc = '/cloudlink/v1/cloudlink-core-framework';
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
  //   	getList(): Promise<any> {
	// 	let url = this.dataServerSrc + '/enterprise/queryList';
	// 	return this.http.get(url)
	// 		.toPromise()
	// 		.then(this.extractData)
	// 		.catch(this.handleError)
	// }

     /*增加功能*/
  // 	addSave(obj: any): Promise<any> {
	// 	let url = this.dataServerSrc + '/organization/add?' + 'token=' + this.token;
	// 	let options = new RequestOptions({ headers: this.JsonHeader });
	// 	let body = obj;
	// 	return this.http.post(url, body, options)
	// 		.toPromise()
	// 		.then(this.extractData)
	// 		.catch(this.handleError)
	// }
     /*删除功能*/
  // 	delete(objectId: string): Promise<any> {
	// 	let url = this.dataServerSrc + "/organization/delete";
	// 	let options = new RequestOptions({ headers: this.JsonHeader });
	// 	let body = JSON.stringify({
	// 		objectId: objectId
	// 	});
	// 	return this.http.post(url, body, options)
	// 		.toPromise()
	// 		.then(this.extractData)
	// 		.catch(this.handleError)
	// }
  	/**
	 * 更新组织机构*/
	// updateSave(obj: any): Promise<any> {
	// 	let url = this.dataServerSrc + '/organization/update?' + 'token=' + this.token;
	// 	let options = new RequestOptions({ headers: this.JsonHeader });
	// 	let body = obj;
	// 	return this.http.post(url, body, options)
	// 		.toPromise()
	// 		.then(this.extractData)
	// 		.catch(this.handleError)
	// }

}
