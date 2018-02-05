import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Enterprise } from './enterprise.model';

@Injectable()
export class EnterpriseService {

	constructor(private http: Http) { }

	getList(): Observable<Enterprise[]> {
		return this.http.get('/api/list').map(res => res.json() as Enterprise[]);
	}
}