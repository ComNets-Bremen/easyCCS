import { Component, HostListener, OnInit } from "@angular/core";
import { UserService } from "./services/user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  public showSettings = false;
  public showMainMenu = false;

  constructor(public userService: UserService) {}

  public ngOnInit(): void {}

  // listener for whole app clicks to close menu
  @HostListener("document:click") resetToggle(): void {
    if (this.showSettings) {
      this.showSettings = false;
    }
    if (this.showMainMenu) {
      this.showMainMenu = false;
    }
  }

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
      case 2:
        window.open("https://www.uni-bremen.de/comnets", "_blank");
        break;
      default:
        break;
    }
  }
}
