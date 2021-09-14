import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { BaseUser } from "../classes/baseUser";
import { ESnackbarTypes } from "../enums/snackbarTypes";
import { HttpService } from "./http.service";
import { ToolService } from "./tool.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  public loggedIn = false;

  constructor(
    private cookieService: CookieService,
    private httpService: HttpService,
    private router: Router,
    private toolService: ToolService
  ) {
    const token = this.cookieService.get(this.httpService.tokenName);
    if (token) {
      this.httpService.token = token;
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }

  public logIn(user: BaseUser): void {
    this.loggedIn = true;
    this.httpService.token = "newsessiontoken";
    this.cookieService.set(this.httpService.tokenName, this.httpService.token);
    this.router.navigate(["/start"]);
    this.toolService.openSnackBar(
      $localize`:@@LoginSuccessfull:Login successfull`,
      $localize`:@@Ok:Ok`,
      ESnackbarTypes.Info
    );
  }

  public logout(): void {
    this.loggedIn = false;
    this.httpService.token = "";
  }
}
