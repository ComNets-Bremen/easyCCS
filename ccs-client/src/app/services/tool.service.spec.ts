import { TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { ToolService } from "./tool.service";

describe("ToolService", () => {
  let service: ToolService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
    });
    service = TestBed.inject(ToolService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
