import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EnterpriseAuth } from './enterprise-auth.model';

@Injectable()
export class EnterpriseAuthService {

	constructor(private http: Http) { }

	getList(): Observable<EnterpriseAuth[]> {
		return this.http.get('/api/list').map(res => res.json() as EnterpriseAuth[]);
	}
}