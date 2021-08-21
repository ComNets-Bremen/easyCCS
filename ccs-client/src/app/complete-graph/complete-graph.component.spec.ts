import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteGraphComponent } from './complete-graph.component';

describe('CompleteGraphComponent', () => {
  let component: CompleteGraphComponent;
  let fixture: ComponentFixture<CompleteGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});