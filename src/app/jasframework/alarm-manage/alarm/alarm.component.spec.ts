import { TestBed, inject } from '@angular/core/testing';

import { AlarmComponent } from './alarm.component';

describe('a alarm component', () => {
	let component: AlarmComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AlarmComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([AlarmComponent], (AlarmComponent) => {
		component = AlarmComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});