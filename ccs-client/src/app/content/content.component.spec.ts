import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpService } from "../services/http.service.test";
import { ContentTestData, SkillTestData } from "../test/testdata";

import { ContentComponent } from "./content.component";

describe("ContentComponent", () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;
  let service: HttpService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ContentComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatTableModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [HttpService, ContentTestData, SkillTestData],
    });
    SkillTestData.create();
    ContentTestData.create();
    service = TestBed.inject(HttpService);
    TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("get all contents", () => {
    service.getContentAll().subscribe((contents) => {
      const content = ContentTestData.contents;
      expect(contents).toEqual(content);
    });
  });
});
