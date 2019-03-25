import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimCardStartPage } from './sim-card-start.page';

describe('SimCardStartPage', () => {
  let component: SimCardStartPage;
  let fixture: ComponentFixture<SimCardStartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimCardStartPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimCardStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
