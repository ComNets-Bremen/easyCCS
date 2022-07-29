import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MyErrorHandler } from "../helper/errorHandler";

import { ErrorInterceptorService } from "./error-interceptor.service";

describe("ErrorInterceptorService", () => {
  let service: ErrorInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
      providers: [MyErrorHandler],
    });
    service = TestBed.inject(ErrorInterceptorService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
