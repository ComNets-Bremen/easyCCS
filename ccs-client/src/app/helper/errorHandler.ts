import { NgModule, ErrorHandler, Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import HTTP_STATUS_CODES from "http-status-enum";
import { ToolService } from "../services/tool.service";
import { ESnackbarTypes } from "../enums/snackbarTypes";

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  constructor(private toolService: ToolService) {}

  public handleError(error: string): void {
    if (!error) {
      return;
    }
    this.toolService.openSnackBar(
      error,
      $localize`:@@Ok:Ok`,
      ESnackbarTypes.Error
    );
    console.error(error);
  }

  public handleHttpError(
    error: HttpErrorResponse | any,
    nodeUrl: string
  ): Observable<any> {
    // this allows to handle specific error status codes and handle different kind of errors if needed => TODO check if needed
    // the errorhandler will be triggered again with null error. At least with "do nothing"
    let message = "";
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case HTTP_STATUS_CODES.NOT_ACCEPTABLE:
        case HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR:
        case HTTP_STATUS_CODES.FORBIDDEN:
        case HTTP_STATUS_CODES.UNAUTHORIZED: {
          message = error.message;
          this.handleError(message);
          return throwError(null);
        }

        default: {
          const parsedError = error.error;
          if (parsedError) {
            message = parsedError.body
              ? parsedError.body
              : error.status
              ? `${error.status} - ${error.statusText}`
              : "Server error";
          } else {
            message = nodeUrl + " failed";
          }
          this.handleError(message);
          return throwError(null);
        }
      }
    } else {
      message = error.message
        ? error.message
        : error.status
        ? `${error.status} - ${error.statusText}`
        : "Server error";
      this.handleError(error);
      return throwError(null);
    }
  }
}

@NgModule({
  providers: [
    {
      provide: ErrorHandler,
      useClass: MyErrorHandler,
    },
  ],
})
export class MyErrorModule {}
