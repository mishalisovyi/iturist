import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckUpServicesStartPage } from './check-up-services-start.page';

describe('CheckUpServicesStartPage', () => {
  let component: CheckUpServicesStartPage;
  let fixture: ComponentFixture<CheckUpServicesStartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckUpServicesStartPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckUpServicesStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
