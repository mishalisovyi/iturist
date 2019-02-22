import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCallListPage } from './doctor-call-list.page';

describe('CallListPage', () => {
  let component: DoctorCallListPage;
  let fixture: ComponentFixture<DoctorCallListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorCallListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorCallListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
