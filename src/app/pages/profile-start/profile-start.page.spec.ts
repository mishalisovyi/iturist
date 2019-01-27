import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileStartPage } from './profile-start.page';

describe('ProfileStartPage', () => {
  let component: ProfileStartPage;
  let fixture: ComponentFixture<ProfileStartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileStartPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
