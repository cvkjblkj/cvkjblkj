import { TestBed, inject } from '@angular/core/testing';

import { AlarmRuleComponent } from './alarm-rule.component';

describe('a alarm-rule component', () => {
	let component: AlarmRuleComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AlarmRuleComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([AlarmRuleComponent], (AlarmRuleComponent) => {
		component = AlarmRuleComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});
