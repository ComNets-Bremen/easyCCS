import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";

import { ContentComponent } from "./content.component";

describe("ContentComponent", () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ContentComponent],
      imports: [
        MatSnackBarModule,
        RouterTestingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatTableModule,
        HttpClientTestingModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [],
    });
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
});
