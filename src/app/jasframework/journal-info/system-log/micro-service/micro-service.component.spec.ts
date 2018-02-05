import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { MicroServiceComponent } from './micro-service.component';
import { MicroServiceService } from './shared/micro-service.service';
import { MicroService } from './shared/micro-service.model';

describe('a micro-service component', () => {
	let component: MicroServiceComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: MicroServiceService, useClass: MockMicroServiceService },
				MicroServiceComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([MicroServiceComponent], (MicroServiceComponent) => {
		component = MicroServiceComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original micro-service service
class MockMicroServiceService extends MicroServiceService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
