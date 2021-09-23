import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  NgForm,
} from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "d3";
import { Observable } from "rxjs";
import { startWith } from "rxjs/operators";
import { ContactFormData } from "../classes/contactFormData";
import { Content } from "../classes/content";
import { ContentModule } from "../classes/contentModule";
import { ESnackbarTypes } from "../enums/snackbarTypes";
import { ContentService } from "../services/content.service";
import { HttpService } from "../services/http.service";
import { ToolService } from "../services/tool.service";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
})
export class ContactComponent implements OnInit {
  private id = 0;
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

  public sendMsg(): void {
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
        this.resetForm();
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

  private resetForm(): void {
    this.contactForm.reset();
    this.contactForm.markAsPristine();
    this.contactForm.markAsUntouched();
    this.contactForm.updateValueAndValidity();
  }
}
