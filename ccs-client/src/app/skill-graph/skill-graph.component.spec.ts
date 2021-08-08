import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillGraphComponent } from './skill-graph.component';

describe('SkillGraphComponent', () => {
  let component: SkillGraphComponent;
  let fixture: ComponentFixture<SkillGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
