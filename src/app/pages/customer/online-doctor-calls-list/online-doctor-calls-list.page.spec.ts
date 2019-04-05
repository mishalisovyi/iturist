import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineDoctorCallsListPage } from './online-doctor-calls-list.page';

describe('OnlineDoctorCallsListPage', () => {
  let component: OnlineDoctorCallsListPage;
  let fixture: ComponentFixture<OnlineDoctorCallsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineDoctorCallsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineDoctorCallsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
