import { Component, OnInit } from '@angular/core';

import { EnterpriseAuth } from './shared/enterprise-auth.model';
import { EnterpriseAuthService } from './shared/enterprise-auth.service';

@Component({
	selector: 'enterprise-auth',
	templateUrl: 'enterprise-auth.component.html',
	providers: [EnterpriseAuthService]
})

export class EnterpriseAuthComponent implements OnInit {
	enterpriseAuth: EnterpriseAuth[] = [];

	constructor(private enterpriseAuthService: EnterpriseAuthService) { }

	ngOnInit() {
		
	}
}