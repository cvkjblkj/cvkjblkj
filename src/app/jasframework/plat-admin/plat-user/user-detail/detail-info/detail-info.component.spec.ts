import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { DetailInfoComponent } from './detail-info.component';
import { DetailInfoService } from './shared/detail-info.service';
import { DetailInfo } from './shared/detail-info.model';

describe('a detail-info component', () => {
	let component: DetailInfoComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: DetailInfoService, useClass: MockDetailInfoService },
				DetailInfoComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([DetailInfoComponent], (DetailInfoComponent) => {
		component = DetailInfoComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original detail-info service
class MockDetailInfoService extends DetailInfoService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
