import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSimPage } from './order-sim.page';

describe('OrderSimPage', () => {
  let component: OrderSimPage;
  let fixture: ComponentFixture<OrderSimPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSimPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSimPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
