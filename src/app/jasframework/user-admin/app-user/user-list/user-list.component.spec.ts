import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { ListComponent } from './list.component';
import { ListService } from './shared/list.service';
import { List } from './shared/list.model';

describe('a list component', () => {
	let component: ListComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: ListService, useClass: MockListService },
				ListComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([ListComponent], (ListComponent) => {
		component = ListComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original list service
class MockListService extends ListService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
