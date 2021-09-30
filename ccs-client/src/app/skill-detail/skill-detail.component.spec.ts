import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatCardModule } from "@angular/material/card";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ToolService } from "../services/tool.service";

import { SkillDetailComponent } from "./skill-detail.component";

describe("SkillDetailComponent", () => {
  let component: SkillDetailComponent;
  let fixture: ComponentFixture<SkillDetailComponent>;
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
      declarations: [SkillDetailComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        MatSnackBarModule,
        MatCardModule,
        HttpClientTestingModule,
      ],
      providers: [ToolService, { provide: ActivatedRoute, useValue: snapShot }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
