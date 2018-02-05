/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlatAdminService } from './plat-admin.service';

describe('Service: PlatAdmin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlatAdminService]
    });
  });

  it('should ...', inject([PlatAdminService], (service: PlatAdminService) => {
    expect(service).toBeTruthy();
  }));
});