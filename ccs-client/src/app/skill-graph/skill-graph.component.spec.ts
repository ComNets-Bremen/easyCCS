import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { SkillGraphComponent } from "./skill-graph.component";

describe("SkillGraphComponent", () => {
  let component: SkillGraphComponent;
  let fixture: ComponentFixture<SkillGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillGraphComponent],
      imports: [
        MatSnackBarModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatCardModule,
        MatSelectModule,
        BrowserAnimationsModule,
        MatChipsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
