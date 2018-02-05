import { Component, OnInit } from '@angular/core';

import { Organization } from './shared/organization.model';
import { OrganizationService } from './shared/organization.service';

@Component({
	selector: 'organization',
	templateUrl: 'organization.component.html',
	providers: [OrganizationService]
})

export class OrganizationComponent implements OnInit {
	organization: Organization[] = [];

	constructor(private organizationService: OrganizationService) { }

	ngOnInit() {
		
	}
}