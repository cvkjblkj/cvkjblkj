/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlatUserService } from './plat-user.service';

describe('Service: PlatUser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlatUserService]
    });
  });

  it('should ...', inject([PlatUserService], (service: PlatUserService) => {
    expect(service).toBeTruthy();
  }));
});