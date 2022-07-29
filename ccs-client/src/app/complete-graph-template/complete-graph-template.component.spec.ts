import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CompleteGraphTemplateComponent } from "./complete-graph-template.component";

describe("CompleteGraphTemplateComponent", () => {
  let component: CompleteGraphTemplateComponent;
  let fixture: ComponentFixture<CompleteGraphTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CompleteGraphTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteGraphTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
