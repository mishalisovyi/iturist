import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimCardChoosePage } from './sim-card-choose.page';

describe('SimCardChoosePage', () => {
  let component: SimCardChoosePage;
  let fixture: ComponentFixture<SimCardChoosePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimCardChoosePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimCardChoosePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
