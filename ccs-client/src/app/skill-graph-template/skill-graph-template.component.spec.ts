import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillGraphTemplateComponent } from './skill-graph-template.component';

describe('SkillGraphTemplateComponent', () => {
  let component: SkillGraphTemplateComponent;
  let fixture: ComponentFixture<SkillGraphTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillGraphTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillGraphTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
