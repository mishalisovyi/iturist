import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckUpServicesPage } from './check-up-services.page';

describe('CheckUpServicesPage', () => {
  let component: CheckUpServicesPage;
  let fixture: ComponentFixture<CheckUpServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckUpServicesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckUpServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
