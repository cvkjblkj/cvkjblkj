import { TestBed, inject } from '@angular/core/testing';

import { CreateRuleComponent } from './create-rule.component';

describe('a create-rule component', () => {
	let component: CreateRuleComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				CreateRuleComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([CreateRuleComponent], (CreateRuleComponent) => {
		component = CreateRuleComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});