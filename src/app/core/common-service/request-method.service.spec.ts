/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RequestMethodService } from './request-method.service';

describe('Service: RequestMethod', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestMethodService]
    });
  });

  it('should ...', inject([RequestMethodService], (service: RequestMethodService) => {
    expect(service).toBeTruthy();
  }));
});