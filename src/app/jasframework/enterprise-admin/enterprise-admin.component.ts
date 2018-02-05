import { Component, OnInit } from '@angular/core';

import { EnterpriseAdmin } from './shared/enterprise-admin.model';
import { EnterpriseAdminService } from './shared/enterprise-admin.service';

@Component({
	selector: 'enterprise-admin',
	templateUrl: 'enterprise-admin.component.html',
	providers: [EnterpriseAdminService]
})

export class EnterpriseAdminComponent implements OnInit {
	enterpriseAdmin: EnterpriseAdmin[] = [];

	constructor(private enterpriseAdminService: EnterpriseAdminService) { }

	ngOnInit() {
		
	}
}