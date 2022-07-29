import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ToolService } from "../services/tool.service";

import { EditModuleComponent } from "./edit-module.component";

describe("EditModuleComponent", () => {
  let component: EditModuleComponent;
  let fixture: ComponentFixture<EditModuleComponent>;
  const snapShot = {
    snapshot: {
      paramMap: {
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        get(): string {
          return "-1";
        },
      },
    },
  } as unknown as ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditModuleComponent],
      imports: [
        MatSnackBarModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        RouterTestingModule.withRoutes([]),
        MatFormFieldModule,
        MatInputModule,
        MatExpansionModule,
        MatChipsModule,
        MatListModule,
        MatCardModule,
        MatIconModule,
        BrowserAnimationsModule,
      ],
      providers: [ToolService, { provide: ActivatedRoute, useValue: snapShot }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
