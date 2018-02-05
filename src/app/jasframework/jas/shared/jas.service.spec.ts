/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { JasService } from './jas.service';

describe('Service: Jas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JasService]
    });
  });

  it('should ...', inject([JasService], (service: JasService) => {
    expect(service).toBeTruthy();
  }));
});