import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSimStartPage } from './order-sim-start.page';

describe('OrderSimStartPage', () => {
  let component: OrderSimStartPage;
  let fixture: ComponentFixture<OrderSimStartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSimStartPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSimStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
