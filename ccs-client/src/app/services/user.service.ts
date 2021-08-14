import { Injectable, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { BaseUser } from "../classes/baseUser";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  public loggedIn = false;

  constructor(
    private cookieService: CookieService,
    private httpService: HttpService
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
  }

  public logout(): void {
    this.loggedIn = false;
    this.httpService.token = "";
  }
}
