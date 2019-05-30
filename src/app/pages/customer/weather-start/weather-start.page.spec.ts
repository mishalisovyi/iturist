import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherStartPage } from './weather-start.page';

describe('WeatherStartPage', () => {
  let component: WeatherStartPage;
  let fixture: ComponentFixture<WeatherStartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherStartPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
