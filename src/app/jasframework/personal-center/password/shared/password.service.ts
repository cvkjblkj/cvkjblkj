import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class PersonalCenterService {
	   
	    public fileServerSrc = '/cloudlink/v1/cloudlink-core-file';
	    public dataServerSrc = '/cloudlink/v1/cloudlink-core-framework'
		
	// private extractData(res: Response) {
	// 	let body = res.json();
	// 	// console.log(body['rows'])
	// 	return body || {};
	// }

	// private handleError(error: any) {
	// 	let errMsg = (error.message) ? error.message :
	// 		error.status ? `${error.status} - ${error.statusText}` : 'Server error';
	// 	console.error(errMsg); // log to console instead
	// 	return Promise.reject(errMsg);

	// }
   
	constructor(private http: Http) { }
   
	  
}