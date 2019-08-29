import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingTourPage } from './onboarding-tour.page';

describe('OnboardingTourPage', () => {
  let component: OnboardingTourPage;
  let fixture: ComponentFixture<OnboardingTourPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingTourPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingTourPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
