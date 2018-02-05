import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { AppAdminComponent } from './app-admin.component';
import { AppAdminService } from './shared/app-admin.service';
import { AppAdmin } from './shared/app-admin.model';

describe('a app-admin component', () => {
	let component: AppAdminComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: AppAdminService, useClass: MockAppAdminService },
				AppAdminComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([AppAdminComponent], (AppAdminComponent) => {
		component = AppAdminComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original app-admin service
class MockAppAdminService extends AppAdminService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
