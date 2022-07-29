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
    this.httpService.login(user.username, user.password).subscribe(
      (token: string) => {
        this.toolService.openSnackBar(
          $localize`:@@LoginSuccessfull:Login successfull`,
          $localize`:@@Ok:Ok`,
          ESnackbarTypes.Info
        );
        this.httpService.token = token;
        this.router.navigate(["/start"]);
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 7);
        this.cookieService.set(
          this.httpService.tokenName,
          this.httpService.token
        );
      },
      (err) => {
        this.toolService.openSnackBar(
          $localize`:@@LoginFailed:Login failed`,
          $localize`:@@Ok:Ok`,
          ESnackbarTypes.Error
        );
      }
    );
  }

  public logout(): void {
    this.httpService.logout().subscribe(() => {
      this.toolService.openSnackBar(
        $localize`:@@LogoutSuccessfull:Logout successfull`,
        $localize`:@@Ok:Ok`,
        ESnackbarTypes.Info
      );
      this.loggedIn = false;
      this.httpService.token = "";
      this.cookieService.set(this.httpService.tokenName, "");
      this.router.navigate(["/"]);
    });
  }
}
