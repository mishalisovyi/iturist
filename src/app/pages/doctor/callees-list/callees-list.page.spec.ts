import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalleesListPage } from './callees-list.page';

describe('CalleesListPage', () => {
  let component: CalleesListPage;
  let fixture: ComponentFixture<CalleesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalleesListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalleesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
