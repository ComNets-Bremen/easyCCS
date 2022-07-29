import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
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
  public showLang = false;
  public showMobileFooter = false;
  public mobileFooter = false;

  constructor(
    public userService: UserService,
    private cookieService: CookieService,
    private bottomSheet: MatBottomSheet,
    private breakpointObserver: BreakpointObserver
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
    if (this.showLang) {
      this.showLang = false;
    }
    if (this.showMobileFooter) {
      this.showMobileFooter = false;
    }
  }

  public ngOnInit(): void {
    const layoutChanges = this.breakpointObserver.observe([
      Breakpoints.Small,
      Breakpoints.XSmall,
    ]);

    layoutChanges.subscribe((result) => {
      if (result.matches) {
        this.mobileFooter = true;
      } else {
        this.mobileFooter = false;
      }
    });
  }

  public openSettings(event: MouseEvent): void {
    event.stopPropagation();
    this.showSettings = !this.showSettings;
    this.showMainMenu = false;
    this.showLang = false;
    this.showMobileFooter = false;
  }

  public openMainMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.showMainMenu = !this.showMainMenu;
    this.showSettings = false;
    this.showLang = false;
    this.showMobileFooter = false;
  }

  public openLangMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.showLang = !this.showLang;
    this.showMainMenu = false;
    this.showSettings = false;
    this.showMobileFooter = false;
  }

  public showFooterMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.showMobileFooter = !this.showMobileFooter;
    this.showLang = false;
    this.showMainMenu = false;
    this.showSettings = false;
  }

  public changeLang(langCode: string): void {
    window.location.href = `/${langCode}`;
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
