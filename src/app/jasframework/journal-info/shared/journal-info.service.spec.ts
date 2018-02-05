/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { JournalInfoService } from './journal-info.service';

describe('Service: JournalInfo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JournalInfoService]
    });
  });

  it('should ...', inject([JournalInfoService], (service: JournalInfoService) => {
    expect(service).toBeTruthy();
  }));
});