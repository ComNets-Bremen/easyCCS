import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { BaseDialogComponent } from "./base-dialog.component";

describe("BaseDialogComponent", () => {
  let component: BaseDialogComponent;
  let fixture: ComponentFixture<BaseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseDialogComponent],
      imports: [MatDialogModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
