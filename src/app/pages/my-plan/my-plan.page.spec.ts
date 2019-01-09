import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPlanPage } from './my-plan.page';

describe('MyPlanPage', () => {
  let component: MyPlanPage;
  let fixture: ComponentFixture<MyPlanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPlanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
