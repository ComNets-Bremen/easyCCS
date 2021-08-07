import { Injectable } from "@angular/core";
import { BaseUser } from "../classes/BaseUser";

@Injectable({
  providedIn: "root",
})
export class UserService {
  public loggedIn = false;

  constructor() {}

  public logIn(user: BaseUser): void {
    this.loggedIn = true;
  }

  public logout(): void {
    this.loggedIn = false;
  }
}
