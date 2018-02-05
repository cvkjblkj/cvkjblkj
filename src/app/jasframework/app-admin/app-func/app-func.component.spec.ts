/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppFuncComponent } from './app-func.component';

describe('AppFuncComponent', () => {
  let component: AppFuncComponent;
  let fixture: ComponentFixture<AppFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});