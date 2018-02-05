/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoginJournalService } from './login-journal.service';

describe('Service: LoginJournal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginJournalService]
    });
  });

  it('should ...', inject([LoginJournalService], (service: LoginJournalService) => {
    expect(service).toBeTruthy();
  }));
});