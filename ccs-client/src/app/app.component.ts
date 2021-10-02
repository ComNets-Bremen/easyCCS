import { Component, HostListener, OnInit } from "@angular/core";
import {
  MatBottomSheet,
  MatBottomSheetConfig,
} from "@angular/material/bottom-sheet";
import { CookieService } from "ngx-cookie-service";
import { CookieInfoSheetComponent } from "./cookie-info-sheet/cookie-info-sheet.component";
import { UserService } from "./services/user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  public showSettings = false;
  public showMainMenu = false;

  constructor(
    public userService: UserService,
    private cookieService: CookieService,
    private bottomSheet: MatBottomSheet
  ) {
    this.checkCookieSettings();
  }

  // listener for whole app clicks to close menu
  @HostListener("document:click") resetToggle(): void {
    if (this.showSettings) {
      this.showSettings = false;
    }
    if (this.showMainMenu) {
      this.showMainMenu = false;
    }
  }

  public ngOnInit(): void {}

  public openSettings(event: MouseEvent): void {
    event.stopPropagation();
    this.showSettings = !this.showSettings;
    this.showMainMenu = false;
  }

  public openMainMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.showMainMenu = !this.showMainMenu;
    this.showSettings = false;
  }

  public openExtLink(type: number): void {
    switch (type) {
      case 1:
        window.open("https://twitter.com/ComNetsBremen", "_blank");
        break;
      case 2:
        window.open("https://www.youtube.com/ComNetsBremen", "_blank");
        break;
      case 3:
        window.open("https://www.uni-bremen.de/comnets", "_blank");
        break;
      case 4:
        window.open(
          "https://www.uni-bremen.de/en/data-privacy?disableOptIn=1",
          "_blank"
        );
        break;
      default:
        break;
    }
  }

  private checkCookieSettings(): void {
    if (
      !this.cookieService.check("cookieAccepted") ||
      this.cookieService.get("cookieAccepted") === "false"
    ) {
      this.openCookieInfo();
      return;
    }
  }

  private openCookieInfo() {
    const config = new MatBottomSheetConfig();
    config.disableClose = true;
    this.bottomSheet.open(CookieInfoSheetComponent, config);
  }
}
