import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { Content } from "../classes/content";
import { ContentModule } from "../classes/contentModule";
import { Skill } from "../classes/skill";
import { ESnackbarTypes } from "../enums/snackbarTypes";
import { ContentService } from "../services/content.service";
import { HttpService } from "../services/http.service";
import { ToolService } from "../services/tool.service";

@Component({
  selector: "app-edit-module",
  templateUrl: "./edit-module.component.html",
  styleUrls: ["./edit-module.component.scss"],
})
export class EditModuleComponent implements OnInit {
  private id = 0;
  public module!: ContentModule;
  public editForm!: FormGroup;
  public selectable = true;
  public removable = true;
  public contentCtrl!: FormControl;
  public filteredContent!: Observable<Content[]>;
  public separatorKeysCodes: number[] = [ENTER, COMMA];

  private allContents: Content[];

  constructor(
    private route: ActivatedRoute,
    private toolService: ToolService,
    private httpService: HttpService,
    private fb: FormBuilder,
    private router: Router,
    private contentService: ContentService
  ) {
    this.allContents = [];
    this.contentCtrl = new FormControl("");

    this.initAll();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      this.toolService.openSnackBar(
        $localize`:@@InvalidModuleId:Invalid id - can't find module to edit!`,
        $localize`:@@Ok:Ok`,
        ESnackbarTypes.Error
      );
      return;
    }
    this.id = parseInt(id, 10);
    if (!this.id || isNaN(this.id)) {
      this.toolService.openSnackBar(
        $localize`:@@InvalidModuleId:Invalid id - can't find module to edit!`,
        $localize`:@@Ok:Ok`,
        ESnackbarTypes.Error
      );
      return;
    }
    this.httpService.getModule(this.id).subscribe((module: ContentModule) => {
      if (module) {
        this.module = module;
      } else {
        this.toolService.openSnackBar(
          $localize`:@@InvalidModuleId:Invalid id - can't find module to edit!`,
          $localize`:@@Ok:Ok`,
          ESnackbarTypes.Error
        );
      }
    });
    this.editForm = this.fb.group({
      name: new FormControl(this.module.module_name, Validators.required),
      desc: new FormControl(
        this.module.module_description,
        Validators.required
      ),
      content: this.contentCtrl,
    });
  }

  public goBack(): void {
    this.router.navigate(["/skill"]);
  }

  public editModule(): void {
    this.module.module_name = this.editForm.get("name")?.value;
    this.module.module_description = this.editForm.get("desc")?.value;
    this.httpService.saveModule(this.module).subscribe(() => {
      this.toolService.openSnackBar(
        $localize`:@@Saved:Data saved successfully`,
        $localize`:@@Ok:Ok`,
        ESnackbarTypes.Info
      );
      this.initAll();
    });
  }

  public selectedContent(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (value) {
      for (const content of this.allContents) {
        if (content.content_name === value) {
          if (!this.module.module_content_modules.includes(content)) {
            this.module.module_content_modules.push(content);
          } else {
            this.toolService.openSnackBar(
              $localize`:@@ContentAlreadyExist:Content does already exist`,
              $localize`:@@Ok:Ok`,
              ESnackbarTypes.Info
            );
          }
        }
      }
    }
    this.contentCtrl.setValue(null);
  }

  public addContent(event: MatChipInputEvent): void {
    event?.chipInput?.clear();
    this.contentCtrl.setValue(null);
  }

  public removeContent(content: Content): void {
    const index = this.module.module_content_modules.indexOf(content);

    if (index >= 0) {
      this.module.module_content_modules.splice(index, 1);
    }
  }
  private filterContent(value: string): Content[] {
    return this.contentService.filterContent(value, this.allContents);
  }

  private initAll(): void {
    this.httpService.getContentAll().subscribe((contents: Content[]) => {
      if (contents) {
        this.allContents = contents;
      }
    });

    this.filteredContent = this.contentCtrl.valueChanges.pipe(
      startWith(null),
      map((value) => (typeof value === "string" ? value : value?.content_name)),
      map((name) =>
        name ? this.filterContent(name) : this.allContents.slice()
      )
    );
  }
}
