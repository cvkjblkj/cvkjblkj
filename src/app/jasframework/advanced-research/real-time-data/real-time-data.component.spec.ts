import { TestBed, inject } from '@angular/core/testing';

import { RealTimeDataComponent } from './real-time-data.component';

describe('a real-time-data component', () => {
  let component: RealTimeDataComponent;

  // register all needed dependencies
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RealTimeDataComponent
      ]
    });
  });

  // instantiation through framework injection
  beforeEach(inject([RealTimeDataComponent], ( RealTimeDataComponent ) => {
    component = RealTimeDataComponent;
  }));

  it('should have an instance', () => {
    expect(component).toBeDefined();
  });
});
