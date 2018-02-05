import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { OrganizationComponent } from './organization.component';
import { OrganizationService } from './shared/organization.service';
import { Organization } from './shared/organization.model';

describe('a organization component', () => {
	let component: OrganizationComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: OrganizationService, useClass: MockOrganizationService },
				OrganizationComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([OrganizationComponent], (OrganizationComponent) => {
		component = OrganizationComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original organization service
class MockOrganizationService extends OrganizationService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
