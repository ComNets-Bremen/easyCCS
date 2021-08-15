import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Content } from "../classes/content";
import { ESnackbarTypes } from "../enums/snackbarTypes";
import { HttpService } from "../services/http.service";
import { ToolService } from "../services/tool.service";

@Component({
  selector: "app-edit-content",
  templateUrl: "./edit-content.component.html",
  styleUrls: ["./edit-content.component.css"],
})
export class EditContentComponent implements OnInit {
  private id = 0;
  public content!: Content;
  public editForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private toolService: ToolService,
    private httpService: HttpService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      this.toolService.openSnackBar(
        $localize`@@InvalidContentId:Invalid id - can't find content to edit!`,
        $localize`@@Ok:Ok`,
        ESnackbarTypes.Error
      );
      return;
    }
    this.id = parseInt(id, 10);
    if (!this.id || isNaN(this.id)) {
      this.toolService.openSnackBar(
        $localize`@@InvalidContentId:Invalid id - can't find content to edit!`,
        $localize`@@Ok:Ok`,
        ESnackbarTypes.Error
      );
      return;
    }
    this.httpService.getContent(this.id).subscribe((content: Content) => {
      if (content) {
        this.content = content;
      } else {
        this.toolService.openSnackBar(
          $localize`@@InvalidContentId:Invalid id - can't find content to edit!`,
          $localize`@@Ok:Ok`,
          ESnackbarTypes.Error
        );
      }
    });
    this.editForm = this.fb.group({
      name: new FormControl("", Validators.required),
      desc: new FormControl("", Validators.required),
      reqSkills: new FormControl("", Validators.required),
      outSkills: new FormControl("", Validators.required),
      wikidata: new FormControl(0, [Validators.min(0), Validators.max(10000)]),
      workload: new FormControl("", Validators.required),
      binaryContent: new FormControl("", Validators.required),
      urlContent: new FormControl("", Validators.required),
    });
  }

  public goBack(): void {
    // TODO
  }

  public editContent(content: Content): void {
    // TODO
  }
}
