import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Match1Component } from './match1.component';

describe('Match1Component', () => {
  let component: Match1Component;
  let fixture: ComponentFixture<Match1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Match1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Match1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
