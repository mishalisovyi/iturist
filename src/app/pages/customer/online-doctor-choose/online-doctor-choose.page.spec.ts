import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineDoctorChoosePage } from './online-doctor-choose.page';

describe('OnlineDoctorChoosePage', () => {
  let component: OnlineDoctorChoosePage;
  let fixture: ComponentFixture<OnlineDoctorChoosePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineDoctorChoosePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineDoctorChoosePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
