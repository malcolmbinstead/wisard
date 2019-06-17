import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Store4Component } from './store4.component';

describe('Store4Component', () => {
  let component: Store4Component;
  let fixture: ComponentFixture<Store4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Store4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Store4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
