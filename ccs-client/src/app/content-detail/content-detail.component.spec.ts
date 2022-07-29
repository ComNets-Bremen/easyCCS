import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatCardModule } from "@angular/material/card";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ToolService } from "../services/tool.service";

import { ContentDetailComponent } from "./content-detail.component";

describe("ContentDetailComponent", () => {
  let component: ContentDetailComponent;
  let fixture: ComponentFixture<ContentDetailComponent>;
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
      declarations: [ContentDetailComponent],
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
    fixture = TestBed.createComponent(ContentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
