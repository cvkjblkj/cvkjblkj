import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { RolePolicyComponent } from './role-policy.component';
import { RolePolicyService } from './shared/role-policy.service';
import { RolePolicy } from './shared/role-policy.model';

describe('a role-policy component', () => {
	let component: RolePolicyComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: RolePolicyService, useClass: MockRolePolicyService },
				RolePolicyComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([RolePolicyComponent], (RolePolicyComponent) => {
		component = RolePolicyComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original role-policy service
class MockRolePolicyService extends RolePolicyService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
