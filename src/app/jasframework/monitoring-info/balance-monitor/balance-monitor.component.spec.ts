import { TestBed, inject } from '@angular/core/testing';

import { BalanceMonitorComponent } from './balance-monitor.component';

describe('a balance-monitor component', () => {
	let component: BalanceMonitorComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				BalanceMonitorComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([BalanceMonitorComponent], (BalanceMonitorComponent) => {
		component = BalanceMonitorComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});