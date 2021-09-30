import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpService } from "../services/http.service.test";

import { CompleteGraphComponent } from "./complete-graph.component";

describe("CompleteGraphComponent", () => {
  let component: CompleteGraphComponent;
  let fixture: ComponentFixture<CompleteGraphComponent>;
  let service: HttpService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteGraphComponent],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(HttpService);
    TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
