import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { AppComponent } from './app.component';
import { AppService } from './shared/app.service';
import { App } from './shared/app.model';

describe('a app component', () => {
	let component: AppComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: AppService, useClass: MockAppService },
				AppComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([AppComponent], (AppComponent) => {
		component = AppComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original app service
class MockAppService extends AppService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
