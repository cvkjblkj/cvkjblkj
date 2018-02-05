import { Component, OnInit } from '@angular/core';

import { Enterprise } from './shared/enterprise.model';
import { EnterpriseService } from './shared/enterprise.service';

@Component({
	selector: 'enterprise',
	templateUrl: 'enterprise.component.html',
	providers: [EnterpriseService]
})

export class EnterpriseComponent implements OnInit {
	enterprise: Enterprise[] = [];

	constructor(private enterpriseService: EnterpriseService) { }

	ngOnInit() {
		this.enterpriseService.getList().subscribe((res) => {
			this.enterprise = res;
		});
	}
}