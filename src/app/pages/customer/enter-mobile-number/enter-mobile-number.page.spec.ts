import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMobileNumberPage } from './enter-mobile-number.page';

describe('EnterMobileNumberPage', () => {
  let component: EnterMobileNumberPage;
  let fixture: ComponentFixture<EnterMobileNumberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterMobileNumberPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMobileNumberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
