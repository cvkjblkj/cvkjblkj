import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { GridpaginationComponent } from './grid-pagination.component';
import { Gridpagination } from './shared/grid-pagination.model';

describe('a datagrid component', () => {
	let component: GridpaginationComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				// { provide: DatagridService, useClass: MockDatagridService },
				GridpaginationComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([GridpaginationComponent], (DatagridComponent) => {
		component = DatagridComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original datagrid service
// class MockDatagridService extends DatagridService {
// 	getList(): Observable<any> {
// 		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
// 	}
// }
