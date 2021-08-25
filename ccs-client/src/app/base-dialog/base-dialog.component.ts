import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ConfirmDialogData } from "../classes/confirmDialogData";

@Component({
  selector: "app-base-dialog",
  templateUrl: "./base-dialog.component.html",
  styleUrls: ["./base-dialog.component.scss"],
})
export class BaseDialogComponent implements OnInit {
  public header1 = "";
  public text1 = "";
  public header2 = "";
  public text2 = "";
  public buttonDeny = "";
  public buttonConfirm = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {
    this.header1 = data.header1;
    this.text1 = data.text1;
    this.header2 = data.header2;
    this.text2 = data.text2;
    this.buttonDeny = data.buttonDeny;
    this.buttonConfirm = data.buttonConfirm;
  }

  ngOnInit(): void {}
}
