import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp, RequestOptions, Response } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class PersonalCenterService {
	    private token:string =window.localStorage['jasToken']
	    public fileServerSrc = '/cloudlink/v1/cloudlink-core-file';
	    public dataServerSrc = '/cloudlink/v1/cloudlink-core-framework'
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
   
	constructor(private http: Http) { }

	//     getList(objectId:any,): Promise<any> {
    //     let url = this.dataServerSrc + '/user/getById?'+ 'objectId='+objectId;
    //     return this.http.get(url)
    //         .toPromise()
    //         .then(this.extractData)
    //         .catch(this.handleError)
    // }
}
	      
