import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  public token = "";
  public readonly tokenName = "ccsSession";
  private readonly baseApi = "rest/";
  private readonly end = "/";
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  // CONTENT

  public getContent(): Observable<any> {
    const url = this.baseApi + "content" + this.end;
    return this.getAuthRequest(url);
  }

  public deleteContent(id: number): Observable<any> {
    const url = this.baseApi + "content/" + id + this.end;
    return this.deleteAuthRequest(url);
  }

  // default http requests
  private postRequest(nodeUrl: string, body: any): Observable<any> {
    const headers = new HttpHeaders(); // .set("django_language", cookie);
    return this.http.post(nodeUrl, body, {
      headers,
    });
  }

  private getRequest(nodeUrl: string): Observable<any> {
    const headers = new HttpHeaders(); // .set("django_language", cookie);
    return this.http.get(nodeUrl, { headers });
  }

  private postAuthRequest(nodeUrl: string, body: any): Observable<any> {
    const headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.post(nodeUrl, body, {
      headers,
    });
  }

  private getAuthRequest(nodeUrl: string): Observable<any> {
    const headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.get(nodeUrl, {
      headers,
    });
  }

  private putAuthRequest(nodeUrl: string, body: any): Observable<any> {
    const headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.put(nodeUrl, body, {
      headers,
    });
  }

  private deleteAuthRequest(nodeUrl: string): Observable<any> {
    const headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.delete(nodeUrl, {
      headers,
    });
  }
}
