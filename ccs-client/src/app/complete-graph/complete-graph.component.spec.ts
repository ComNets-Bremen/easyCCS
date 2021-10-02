import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CompleteGraphTemplateComponent } from "../complete-graph-template/complete-graph-template.component";

import { CompleteGraphComponent } from "./complete-graph.component";

describe("CompleteGraphComponent", () => {
  let component: CompleteGraphComponent;
  let fixture: ComponentFixture<CompleteGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteGraphComponent, CompleteGraphTemplateComponent],
      imports: [HttpClientTestingModule],
      providers: [],
    });
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
