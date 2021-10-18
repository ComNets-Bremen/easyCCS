import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormGroupDirective,
} from "@angular/forms";
import { LicenseFormData } from "../classes/contactFormData";
import { ESnackbarTypes } from "../enums/snackbarTypes";
import { HttpService } from "../services/http.service";
import { ToolService } from "../services/tool.service";

@Component({
  selector: "app-license-request",
  templateUrl: "./license-request.component.html",
  styleUrls: ["./license-request.component.scss"],
})
export class LicenseRequestComponent implements OnInit {
  public contactForm!: FormGroup;

  constructor(
    private toolService: ToolService,
    private httpService: HttpService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.email]),
      affiliation: new FormControl("", Validators.required),
      interest: new FormControl("", Validators.required),
    });
  }

  public sendMsg(event: Event): void {
    const contactData = new LicenseFormData();
    contactData.name = this.contactForm.get("name")?.value;
    contactData.email = this.contactForm.get("email")?.value;
    contactData.affiliation = this.contactForm.get("affiliation")?.value;
    contactData.interest = this.contactForm.get("interest")?.value;
    this.httpService.licenseRequest(contactData).subscribe(
      () => {
        this.toolService.openSnackBar(
          $localize`:@@ContactMsgSent:Your message has been sent successfully`,
          $localize`:@@Ok:Ok`,
          ESnackbarTypes.Info
        );
        this.resetForm(event);
      },
      (err) => {
        this.toolService.openSnackBar(
          $localize`:@@ContactMsgSentFailed:Your message could not be sent`,
          $localize`:@@Ok:Ok`,
          ESnackbarTypes.Error
        );
      }
    );
  }

  private resetForm(event: Event): void {
    // currenttargt can't be directly casted to Form - we need the directive to reset not the form itself
    // https://github.com/angular/components/issues/4190
    const form = event.currentTarget as unknown;
    const formDirective = form as FormGroupDirective;
    formDirective.reset();
  }
}
