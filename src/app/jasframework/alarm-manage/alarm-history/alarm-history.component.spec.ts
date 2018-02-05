import { TestBed, inject } from '@angular/core/testing';

import { AlarmHistoryComponent } from './alarm-history.component';

describe('a alarm-history component', () => {
	let component: AlarmHistoryComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AlarmHistoryComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([AlarmHistoryComponent], (AlarmHistoryComponent) => {
		component = AlarmHistoryComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});
