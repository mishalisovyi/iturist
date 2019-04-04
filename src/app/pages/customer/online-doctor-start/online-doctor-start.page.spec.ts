import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineDoctorStartPage } from './online-doctor-start.page';

describe('OnlineDoctorStartPage', () => {
  let component: OnlineDoctorStartPage;
  let fixture: ComponentFixture<OnlineDoctorStartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineDoctorStartPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineDoctorStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
