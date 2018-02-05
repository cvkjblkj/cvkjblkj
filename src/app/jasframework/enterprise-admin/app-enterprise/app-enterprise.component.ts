import { Component, OnInit } from '@angular/core';

import { AppEnterprise } from './shared/app-enterprise.model';
import { AppEnterpriseService } from './shared/app-enterprise.service';

@Component({
	selector: 'app-enterprise',
	templateUrl: 'app-enterprise.component.html',
	providers: [AppEnterpriseService]
})

export class AppEnterpriseComponent implements OnInit {
	appEnterprise: AppEnterprise[] = [];

	constructor(private appEnterpriseService: AppEnterpriseService) { }

	ngOnInit() {
		
	}
}