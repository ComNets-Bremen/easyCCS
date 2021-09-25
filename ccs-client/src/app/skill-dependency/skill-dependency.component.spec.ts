import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SkillDependencyComponent } from "./skill-dependency.component";

describe("SkillDependencyComponent", () => {
  let component: SkillDependencyComponent;
  let fixture: ComponentFixture<SkillDependencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillDependencyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillDependencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
