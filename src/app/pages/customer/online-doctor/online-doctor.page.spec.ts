import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineDoctorPage } from './online-doctor.page';

describe('OnlineDoctorPage', () => {
  let component: OnlineDoctorPage;
  let fixture: ComponentFixture<OnlineDoctorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineDoctorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineDoctorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
