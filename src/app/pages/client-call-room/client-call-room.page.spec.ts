import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCallRoomPage } from './client-call-room.page';

describe('ClientCallRoomPage', () => {
  let component: ClientCallRoomPage;
  let fixture: ComponentFixture<ClientCallRoomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientCallRoomPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCallRoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
