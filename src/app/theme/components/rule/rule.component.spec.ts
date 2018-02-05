import { TestBed, inject } from '@angular/core/testing';

import { RuleComponent } from './rule.component';

describe('a rule component', () => {
	let component: RuleComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				RuleComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([RuleComponent], (RuleComponent) => {
		component = RuleComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});