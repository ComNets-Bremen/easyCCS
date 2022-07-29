import { Component, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Content, UploadContent } from "../classes/content";
import { Skill } from "../classes/skill";
import { ESnackbarTypes } from "../enums/snackbarTypes";
import { HttpService } from "../services/http.service";
import { ToolService } from "../services/tool.service";
import { map, startWith } from "rxjs/operators";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { WikidataObject } from "../classes/wikiDataObj";
import { WikiDataObjService } from "../services/wiki-data-obj.service";
import { SkillService } from "../skill.service";
import { DocFile } from "../classes/docFile";

@Component({
  selector: "app-edit-content",
  templateUrl: "./edit-content.component.html",
  styleUrls: ["./edit-content.component.scss"],
})
export class EditContentComponent implements OnInit {
  public content!: Content;
  public editForm!: FormGroup;
  public selectable = true;
  public removable = true;
  public newContent = false;
  public reqSkillCtrl!: FormControl;
  public newSkillCtrl!: FormControl;
  public wikiDataObjCtrl!: FormControl;
  public filteredReqSkills!: Observable<Skill[]>;
  public filteredNewSkills!: Observable<Skill[]>;
  public filteredWikiData!: Observable<WikidataObject[]>;
  public separatorKeysCodes: number[] = [ENTER, COMMA];

  private allSkills: Skill[];
  private allWikiObj: WikidataObject[];
  private id = 0;

  constructor(
    private route: ActivatedRoute,
    private toolService: ToolService,
    private httpService: HttpService,
    private fb: FormBuilder,
    private router: Router,
    private wikiService: WikiDataObjService,
    private skillService: SkillService
  ) {
    this.allSkills = [];
    this.allWikiObj = [];
    this.reqSkillCtrl = new FormControl("");
    this.newSkillCtrl = new FormControl("");
    this.wikiDataObjCtrl = new FormControl("");

    this.initAll();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      this.showInvalidIdError();
      return;
    }
    this.id = parseInt(id, 10);
    if (!this.id || isNaN(this.id)) {
      this.showInvalidIdError();
      return;
    }
    if (this.id === -1) {
      this.content = new Content();
      this.newContent = true;
      this.createForm();
    } else {
      this.httpService.getContent(this.id).subscribe((content: Content) => {
        if (content) {
          this.content = content;
          this.createForm();
        } else {
          this.showInvalidIdError();
        }
      });
    }
  }

  public goBack(): void {
    this.router.navigate(["/content"]);
  }

  public editContent(): void {
    this.content.content_name = this.editForm.get("name")?.value;
    this.content.content_description = this.editForm.get("desc")?.value;
    this.content.content_workload = this.editForm.get("workload")?.value;
    if (this.id === -1) {
      this.httpService.createContent(this.content).subscribe(() => {
        this.toolService.openSnackBar(
          $localize`:@@Saved:Data saved successfully`,
          $localize`:@@Ok:Ok`,
          ESnackbarTypes.Info
        );
        this.goBack();
      });
    } else {
      this.httpService.saveContent(this.content).subscribe(() => {
        this.toolService.openSnackBar(
          $localize`:@@Saved:Data saved successfully`,
          $localize`:@@Ok:Ok`,
          ESnackbarTypes.Info
        );
        this.initAll();
      });
    }
  }

  public selectedReqSkill(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (value) {
      for (const skill of this.allSkills) {
        if (skill.skill_name === value) {
          if (!this.content.required_skills.includes(skill)) {
            this.content.required_skills.push(skill);
          } else {
            this.toolService.openSnackBar(
              $localize`:@@SkillAlreadyExist:Skill does already exist`,
              $localize`:@@Ok:Ok`,
              ESnackbarTypes.Info
            );
          }
        }
      }
    }
    this.reqSkillCtrl.setValue(null);
  }

  public selectedNewSkill(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (value) {
      for (const skill of this.allSkills) {
        if (skill.skill_name === value) {
          if (!this.content.new_skills.includes(skill)) {
            this.content.new_skills.push(skill);
          } else {
            this.toolService.openSnackBar(
              $localize`:@@SkillAlreadyExist:Skill does already exist`,
              $localize`:@@Ok:Ok`,
              ESnackbarTypes.Info
            );
          }
        }
      }
    }
    this.newSkillCtrl.setValue(null);
  }

  public addReqSkill(event: MatChipInputEvent): void {
    event?.chipInput?.clear();
    this.reqSkillCtrl.setValue(null);
  }

  public addNewSkill(event: MatChipInputEvent): void {
    event?.chipInput?.clear();
    this.newSkillCtrl.setValue(null);
  }

  public removeReqSkill(skill: Skill): void {
    const index = this.content.required_skills.indexOf(skill);

    if (index >= 0) {
      this.content.required_skills.splice(index, 1);
    }
  }

  public removeNewSkill(skill: Skill): void {
    const index = this.content.new_skills.indexOf(skill);

    if (index >= 0) {
      this.content.new_skills.splice(index, 1);
    }
  }

  public selectedWikiDataObj(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (value) {
      for (const wikiObj of this.allWikiObj) {
        if (wikiObj.wikidata_name === value) {
          if (!this.content.content_keywords.includes(wikiObj)) {
            this.content.content_keywords.push(wikiObj);
          } else {
            this.toolService.openSnackBar(
              $localize`:@@WikidataObjAlreadyExist:Wikidata Object does already exist`,
              $localize`:@@Ok:Ok`,
              ESnackbarTypes.Info
            );
          }
        }
      }
    }
    this.wikiDataObjCtrl.setValue(null);
  }

  public addWikidataObj(event: MatChipInputEvent): void {
    event?.chipInput?.clear();
    this.wikiDataObjCtrl.setValue(null);
  }

  public removeWikiDataObj(wikiObj: WikidataObject): void {
    const index = this.content.content_keywords.indexOf(wikiObj);

    if (index >= 0) {
      this.content.content_keywords.splice(index, 1);
    }
  }

  public addUrl(): void {
    const url = this.editForm.get("urlContent")?.value;
    for (const element of this.content.url_content) {
      if (element === url) {
        this.toolService.openSnackBar(
          $localize`:@@UrlAlreadyExist:Url has already been added`,
          $localize`:@@Ok:Ok`,
          ESnackbarTypes.Info
        );
        return;
      }
    }
    this.content.url_content.push(url);
    this.editForm.get("urlContent")?.reset();
  }

  public removeUrl(url: string): void {
    for (let index = 0; index < this.content.url_content.length; index++) {
      const element = this.content.url_content[index];
      if (element === url) {
        this.content.url_content.splice(index, 1);
      }
    }
  }

  public removeBinaryContent(docFile: DocFile): void {
    this.httpService
      .removeBinaryContent(this.content.id, docFile)
      .subscribe(() => {
        this.toolService.openSnackBar(
          $localize`:@@Saved:Data saved successfully`,
          $localize`:@@Ok:Ok`,
          ESnackbarTypes.Info
        );
        this.initAll();
      });
  }

  public upload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files) {
      return;
    }
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files?.item(i);
      if (!file) {
        return;
      }
      formData.append("file", file);
      const uploadContent = new UploadContent(this.content.id, formData);
      this.httpService.uploadContent(uploadContent).subscribe(() => {
        this.toolService.openSnackBar(
          $localize`:@@Saved:Data saved successfully`,
          $localize`:@@Ok:Ok`,
          ESnackbarTypes.Info
        );
      });
      // TODO handle multiple uploads and then refresh!!
      this.initAll();
    }
  }

  private showInvalidIdError(): void {
    this.toolService.openSnackBar(
      $localize`:@@InvalidContentId:Invalid id - can't find content to edit!`,
      $localize`:@@Ok:Ok`,
      ESnackbarTypes.Error
    );
  }

  private createForm() {
    this.editForm = this.fb.group({
      name: new FormControl(this.content.content_name, Validators.required),
      desc: new FormControl(
        this.content.content_description,
        Validators.required
      ),
      reqSkills: this.reqSkillCtrl,
      newSkills: this.newSkillCtrl,
      wikidata: this.wikiDataObjCtrl,
      workload: new FormControl(0),
      binaryContent: new FormControl(""),
      urlContent: new FormControl(""),
    });
  }

  private filterSkills(value: string): Skill[] {
    return this.skillService.filterSkills(value, this.allSkills);
  }

  private filterWikiDataObjs(value: string): WikidataObject[] {
    return this.wikiService.filterWikiDataObjs(value, this.allWikiObj);
  }

  private initAll(): void {
    this.httpService.getSkillAll().subscribe((skills: Skill[]) => {
      if (skills) {
        this.allSkills = skills;
      }
    });

    this.httpService
      .getWikidataAll()
      .subscribe((wikiObjs: WikidataObject[]) => {
        if (wikiObjs) {
          this.allWikiObj = wikiObjs;
        }
      });

    this.filteredReqSkills = this.reqSkillCtrl.valueChanges.pipe(
      startWith(null),
      map((value) => (typeof value === "string" ? value : value?.skill_name)),
      map((name) => (name ? this.filterSkills(name) : this.allSkills.slice()))
    );

    this.filteredNewSkills = this.newSkillCtrl.valueChanges.pipe(
      startWith(null),
      map((value) => (typeof value === "string" ? value : value?.skill_name)),
      map((name) => (name ? this.filterSkills(name) : this.allSkills.slice()))
    );

    this.filteredWikiData = this.wikiDataObjCtrl.valueChanges.pipe(
      startWith(null),
      map((value) => (typeof value === "string" ? value : value?.skill_name)),
      map((name) =>
        name ? this.filterWikiDataObjs(name) : this.allWikiObj.slice()
      )
    );
  }
}
