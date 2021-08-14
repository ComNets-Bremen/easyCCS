import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { HttpService } from "./http.service";
import { MyErrorHandler } from "../helper/errorHandler";

@Injectable({
  providedIn: "root",
})
export class ErrorInterceptorService implements HttpInterceptor {
  constructor(
    private httpService: HttpService,
    private errorHandler: MyErrorHandler
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authReq = req;
    // TODO keep this for upload/download routes
    // if (req.url.search(MyRoutes.apiDownloadLatestAssetReport()) != -1 || req.url.search(MyRoutes.apiExportAssets()) != -1) {
    //   authReq = req.clone({ headers: this.getAuthOptions(), responseType: "blob" as 'json' });
    //   authReq.observe = 'response';
    // } else {
    //   authReq = req.clone({ headers: this.getAuthOptions() });
    // }

    return next.handle(authReq).pipe(
      catchError((err) => {
        const result = this.handleError(err, req.url);
        return result;
      })
    );
  }

  public getDefaultOptions(): HttpHeaders {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return headers;
  }

  public getAuthOptions(): HttpHeaders {
    const token = this.httpService.token;
    if (token && token.length > 0) {
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", token);
      return headers;
    } else {
      const headers = new HttpHeaders().set("Content-Type", "application/json");
      return headers;
    }
  }

  private handleError(
    error: HttpErrorResponse,
    nodeUrl: string
  ): Observable<any> {
    const result = this.errorHandler.handleHttpError(error, nodeUrl);
    return result;
  }
}
