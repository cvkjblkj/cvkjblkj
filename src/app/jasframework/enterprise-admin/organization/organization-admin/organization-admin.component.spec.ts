import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { OrganizationAdminComponent } from './organization-admin.component';
import { OrganizationAdminService } from './shared/organization-admin.service';
import { OrganizationAdmin } from './shared/organization-admin.model';

describe('a organization-admin component', () => {
	let component: OrganizationAdminComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: OrganizationAdminService, useClass: MockOrganizationAdminService },
				OrganizationAdminComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([OrganizationAdminComponent], (OrganizationAdminComponent) => {
		component = OrganizationAdminComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original organization-admin service
class MockOrganizationAdminService extends OrganizationAdminService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
