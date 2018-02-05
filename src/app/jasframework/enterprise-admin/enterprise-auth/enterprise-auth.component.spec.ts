import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { EnterpriseAuthComponent } from './enterprise-auth.component';
import { EnterpriseAuthService } from './shared/enterprise-auth.service';
import { EnterpriseAuth } from './shared/enterprise-auth.model';

describe('a enterprise-auth component', () => {
	let component: EnterpriseAuthComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: EnterpriseAuthService, useClass: MockEnterpriseAuthService },
				EnterpriseAuthComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([EnterpriseAuthComponent], (EnterpriseAuthComponent) => {
		component = EnterpriseAuthComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original enterprise-auth service
class MockEnterpriseAuthService extends EnterpriseAuthService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
