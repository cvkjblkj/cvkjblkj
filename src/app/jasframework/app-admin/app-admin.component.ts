import { Component, OnInit } from '@angular/core';

import { AppAdmin } from './shared/app-admin.model';


@Component({
	selector: 'app-admin',
	templateUrl: 'app-admin.component.html',

})

export class AppAdminComponent implements OnInit {
	appAdmin: AppAdmin[] = [];

	constructor() { }

	ngOnInit() {
	}
}
