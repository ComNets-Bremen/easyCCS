import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  MatBottomSheetModule,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from "@angular/material/bottom-sheet";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterTestingModule } from "@angular/router/testing";

import { CookieInfoSheetComponent } from "./cookie-info-sheet.component";

describe("CookieInfoSheetComponent", () => {
  let component: CookieInfoSheetComponent;
  let fixture: ComponentFixture<CookieInfoSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CookieInfoSheetComponent],
      imports: [
        MatBottomSheetModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: MatBottomSheetRef, useValue: {} },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieInfoSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
