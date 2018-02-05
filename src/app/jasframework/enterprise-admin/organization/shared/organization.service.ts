import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Organization } from './organization.model';

@Injectable()
export class OrganizationService {

	constructor(private http: Http) { }

	getList(): Observable<Organization[]> {
		return this.http.get('/api/list').map(res => res.json() as Organization[]);
	}
}