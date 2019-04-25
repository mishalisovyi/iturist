import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeReaderPage } from './qr-code-reader.page';

describe('QrCodeReaderPage', () => {
  let component: QrCodeReaderPage;
  let fixture: ComponentFixture<QrCodeReaderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrCodeReaderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodeReaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
