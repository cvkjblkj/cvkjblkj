import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { MicroService } from './micro-service.model';

@Injectable()
export class MicroServiceService {

	constructor(private http: Http) { }

	getList(): Observable<MicroService[]> {
		return this.http.get('/api/list').map(res => res.json() as MicroService[]);
	}
}