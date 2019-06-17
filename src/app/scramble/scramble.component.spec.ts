import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrambleComponent } from './scramble.component';

describe('ScrambleComponent', () => {
  let component: ScrambleComponent;
  let fixture: ComponentFixture<ScrambleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrambleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrambleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
