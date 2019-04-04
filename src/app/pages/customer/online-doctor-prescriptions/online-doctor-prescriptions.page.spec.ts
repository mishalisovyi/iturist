import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineDoctorPrescriptionsPage } from './online-doctor-prescriptions.page';

describe('OnlineDoctorPrescriptionsPage', () => {
  let component: OnlineDoctorPrescriptionsPage;
  let fixture: ComponentFixture<OnlineDoctorPrescriptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineDoctorPrescriptionsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineDoctorPrescriptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
