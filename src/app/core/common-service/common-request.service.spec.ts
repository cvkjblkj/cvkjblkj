/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CommonRequestService } from './common-request.service';

describe('Service: CommonRequest', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonRequestService]
    });
  });

  it('should ...', inject([CommonRequestService], (service: CommonRequestService) => {
    expect(service).toBeTruthy();
  }));
});