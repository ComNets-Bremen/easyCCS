import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterTestingModule } from "@angular/router/testing";

import { UserService } from "./user.service";

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        MatSnackBarModule,
      ],
    });
    service = TestBed.inject(UserService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
