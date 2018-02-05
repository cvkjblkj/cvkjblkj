/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JasComponent } from './jas.component';

describe('JasComponent', () => {
  let component: JasComponent;
  let fixture: ComponentFixture<JasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});