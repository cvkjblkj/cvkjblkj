import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { EnterpriseComponent } from './enterprise.component';
import { EnterpriseService } from './shared/enterprise.service';
import { Enterprise } from './shared/enterprise.model';

describe('a enterprise component', () => {
	let component: EnterpriseComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: EnterpriseService, useClass: MockEnterpriseService },
				EnterpriseComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([EnterpriseComponent], (EnterpriseComponent) => {
		component = EnterpriseComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original enterprise service
class MockEnterpriseService extends EnterpriseService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
