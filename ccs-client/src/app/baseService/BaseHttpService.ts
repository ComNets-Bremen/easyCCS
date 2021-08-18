import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import {
  SkillTestData,
  ContentTestData,
  ModuleTestData,
} from "../test/testdata";

export abstract class BaseHttpService {
  public token = "";
  public readonly tokenName = "ccsSession";
  protected readonly baseApi = "rest/";
  protected readonly end = "/";

  constructor(
    protected http: HttpClient,
    protected cookieService: CookieService
  ) {}

  // CONTENT

  public abstract getContentAll(): Observable<any>;

  public abstract getContent(id: number): Observable<any>;

  public abstract deleteContent(id: number): Observable<any>;

  // SKILL

  public abstract getSkillAll(): Observable<any>;

  public abstract getSkill(id: number): Observable<any>;

  public abstract deleteCSkill(id: number): Observable<any>;

  // default http requests
  protected abstract postRequest(nodeUrl: string, body: any): Observable<any>;

  protected abstract getRequest(nodeUrl: string): Observable<any>;

  protected abstract postAuthRequest(
    nodeUrl: string,
    body: any
  ): Observable<any>;

  protected abstract getAuthRequest(nodeUrl: string): Observable<any>;

  protected abstract putAuthRequest(
    nodeUrl: string,
    body: any
  ): Observable<any>;

  protected abstract deleteAuthRequest(nodeUrl: string): Observable<any>;
}
