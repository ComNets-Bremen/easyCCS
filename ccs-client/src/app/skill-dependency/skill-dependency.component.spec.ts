import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { SkillDependencyComponent } from "./skill-dependency.component";

describe("SkillDependencyComponent", () => {
  let component: SkillDependencyComponent;
  let fixture: ComponentFixture<SkillDependencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillDependencyComponent],
      imports: [HttpClientTestingModule, MatSnackBarModule, MatDialogModule],
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
