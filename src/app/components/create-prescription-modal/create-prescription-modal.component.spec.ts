import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePrescriptionModalComponent } from './create-prescription-modal.component';

describe('CreatePrescriptionModalComponent', () => {
  let component: CreatePrescriptionModalComponent;
  let fixture: ComponentFixture<CreatePrescriptionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePrescriptionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePrescriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
