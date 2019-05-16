import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetStartInfoPage } from './set-start-info.page';

describe('SetStartInfoPage', () => {
  let component: SetStartInfoPage;
  let fixture: ComponentFixture<SetStartInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetStartInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetStartInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
