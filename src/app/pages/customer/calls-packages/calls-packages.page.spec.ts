import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsPackagesPage } from './calls-packages.page';

describe('CallsPackagesPage', () => {
  let component: CallsPackagesPage;
  let fixture: ComponentFixture<CallsPackagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallsPackagesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsPackagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
