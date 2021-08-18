import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { BaseHttpService } from "../baseService/BaseHttpService";

@Injectable({
  providedIn: "root",
})
export class HttpService extends BaseHttpService {
  public token = "";

  constructor(
    protected http: HttpClient,
    protected cookieService: CookieService
  ) {
    super(http, cookieService);
  }

  // CONTENT

  public getContentAll(): Observable<any> {
    const url = this.baseApi + "content" + this.end;
    return this.getAuthRequest(url);
  }

  public getContent(id: number): Observable<any> {
    const url = this.baseApi + `content/${id}` + this.end;
    return this.getAuthRequest(url);
  }

  public deleteContent(id: number): Observable<any> {
    const url = this.baseApi + "content/" + id + this.end;
    return this.deleteAuthRequest(url);
  }

  // SKILLS

  public getSkillAll(): Observable<any> {
    const url = this.baseApi + "skill" + this.end;
    return this.getAuthRequest(url);
  }

  public getSkill(id: number): Observable<any> {
    const url = this.baseApi + `skill/${id}` + this.end;
    return this.getAuthRequest(url);
  }

  public deleteCSkill(id: number): Observable<any> {
    const url = this.baseApi + "skill/" + id + this.end;
    return this.deleteAuthRequest(url);
  }

  // default http requests
  protected postRequest(nodeUrl: string, body: any): Observable<any> {
    const headers = new HttpHeaders(); // .set("django_language", cookie);
    return this.http.post(nodeUrl, body, {
      headers,
    });
  }

  protected getRequest(nodeUrl: string): Observable<any> {
    const headers = new HttpHeaders(); // .set("django_language", cookie);
    return this.http.get(nodeUrl, { headers });
  }

  protected postAuthRequest(nodeUrl: string, body: any): Observable<any> {
    const headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.post(nodeUrl, body, {
      headers,
    });
  }

  protected getAuthRequest(nodeUrl: string): Observable<any> {
    const headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.get(nodeUrl, {
      headers,
    });
  }

  protected putAuthRequest(nodeUrl: string, body: any): Observable<any> {
    const headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.put(nodeUrl, body, {
      headers,
    });
  }

  protected deleteAuthRequest(nodeUrl: string): Observable<any> {
    const headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.delete(nodeUrl, {
      headers,
    });
  }
}
