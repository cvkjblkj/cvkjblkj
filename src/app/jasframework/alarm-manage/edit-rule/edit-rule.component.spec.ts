import { TestBed, inject } from '@angular/core/testing';

import { EditRuleComponent } from './edit-rule.component';

describe('a edit-rule component', () => {
	let component: EditRuleComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				EditRuleComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([EditRuleComponent], (EditRuleComponent) => {
		component = EditRuleComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});