import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterTestingModule } from "@angular/router/testing";

import { CanActivateService } from "./can-activate.service";

describe("CanActivateService", () => {
  let service: CanActivateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        MatSnackBarModule,
      ],
    });
    service = TestBed.inject(CanActivateService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
