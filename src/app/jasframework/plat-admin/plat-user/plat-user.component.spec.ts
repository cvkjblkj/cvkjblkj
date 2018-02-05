/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PlatUserComponent } from './plat-user.component';

describe('PlatUserComponent', () => {
  let component: PlatUserComponent;
  let fixture: ComponentFixture<PlatUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});