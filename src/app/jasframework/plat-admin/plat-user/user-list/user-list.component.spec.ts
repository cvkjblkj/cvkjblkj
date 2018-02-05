import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { UserListComponent } from './user-list.component';
import { UserListService } from './shared/user-list.service';
import { UserList } from './shared/user-list.model';

describe('a user-list component', () => {
	let component: UserListComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: UserListService, useClass: MockUserListService },
				UserListComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([UserListComponent], (UserListComponent) => {
		component = UserListComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original user-list service
class MockUserListService extends UserListService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
