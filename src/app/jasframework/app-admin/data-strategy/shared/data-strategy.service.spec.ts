/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DataStrategyService } from './data-strategy.service';

describe('Service: DataStrategy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataStrategyService]
    });
  });

  it('should ...', inject([DataStrategyService], (service: DataStrategyService) => {
    expect(service).toBeTruthy();
  }));
});