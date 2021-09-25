import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormGroupDirective,
} from "@angular/forms";
import { ContactFormData } from "../classes/contactFormData";
import { ESnackbarTypes } from "../enums/snackbarTypes";
import { HttpService } from "../services/http.service";
import { ToolService } from "../services/tool.service";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
})
export class ContactComponent implements OnInit {
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
      subject: new FormControl("", Validators.required),
      message: new FormControl("", Validators.required),
    });
  }

  public sendMsg(event: Event): void {
    const contactData = new ContactFormData();
    contactData.name = this.contactForm.get("name")?.value;
    contactData.email = this.contactForm.get("email")?.value;
    contactData.subject = this.contactForm.get("subject")?.value;
    contactData.message = this.contactForm.get("message")?.value;
    this.httpService.contact(contactData).subscribe(
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
