import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { AppEnterpriseComponent } from './app-enterprise.component';
import { AppEnterpriseService } from './shared/app-enterprise.service';
import { AppEnterprise } from './shared/app-enterprise.model';

describe('a app-enterprise component', () => {
	let component: AppEnterpriseComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: AppEnterpriseService, useClass: MockAppEnterpriseService },
				AppEnterpriseComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([AppEnterpriseComponent], (AppEnterpriseComponent) => {
		component = AppEnterpriseComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original app-enterprise service
class MockAppEnterpriseService extends AppEnterpriseService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
