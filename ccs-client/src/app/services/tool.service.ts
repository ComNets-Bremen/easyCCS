import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ESnackbarTypes } from "../enums/snackbarTypes";

@Injectable({
  providedIn: "root",
})
export class ToolService {
  constructor(private snackBar: MatSnackBar) {}

  public openSnackBar(
    text: string,
    btnText: string,
    type: ESnackbarTypes
  ): void {
    const cssClass = this.getClassFromType(type);
    this.snackBar.open(text, btnText, {
      duration: 3000,
      panelClass: cssClass,
    });
  }

  private getClassFromType(type: ESnackbarTypes): string {
    switch (type) {
      case ESnackbarTypes.Error:
        return "errorSnack";
      case ESnackbarTypes.Warn:
        return "warnSanck";
      default:
        return "";
    }
  }
}
