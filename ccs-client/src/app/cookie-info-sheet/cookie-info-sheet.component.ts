import { Component, OnInit } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-cookie-info-sheet",
  templateUrl: "./cookie-info-sheet.component.html",
  styleUrls: ["./cookie-info-sheet.component.scss"],
})
export class CookieInfoSheetComponent implements OnInit {
  public showSecondText = false;
  constructor(
    private bottomSheetRef: MatBottomSheetRef<CookieInfoSheetComponent>,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {}

  public accept() {
    const expireDate = new Date();
    expireDate.setMonth(expireDate.getMonth() + 3);
    this.cookieService.set("cookieAccepted", "true", expireDate);
    this.bottomSheetRef.dismiss();
  }

  public decline() {
    this.cookieService.delete("cookieAccepted", "false");
    this.showSecondText = true;
  }
}
