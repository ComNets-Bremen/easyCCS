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
import { Skill } from "../classes/skill";
import { WikidataObject } from "../classes/wikiDataObj";
import { ESnackbarTypes } from "../enums/snackbarTypes";
import { HttpService } from "../services/http.service";
import { ToolService } from "../services/tool.service";
import { WikiDataObjService } from "../services/wiki-data-obj.service";
import { SkillService } from "../skill.service";

@Component({
  selector: "app-edit-skill",
  templateUrl: "./edit-skill.component.html",
  styleUrls: ["./edit-skill.component.scss"],
})
export class EditSkillComponent implements OnInit {
  public skill!: Skill;
  public editForm!: FormGroup;
  public selectable = true;
  public removable = true;
  public wikiDataObjCtrl!: FormControl;
  public filteredWikiData!: Observable<WikidataObject[]>;
  public separatorKeysCodes: number[] = [ENTER, COMMA];

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
    this.allWikiObj = [];
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
      this.skill = new Skill();
      this.createForm();
    } else {
      this.httpService.getSkill(this.id).subscribe((skill: Skill) => {
        if (skill) {
          this.skill = skill;
          this.createForm();
        } else {
          this.showInvalidIdError();
        }
      });
    }
  }

  public goBack(): void {
    this.router.navigate(["/skill"]);
  }

  public editSkill(): void {
    this.skill.skill_name = this.editForm.get("name")?.value;
    this.skill.description = this.editForm.get("desc")?.value;
    if (this.id === -1) {
      this.httpService.createSkill(this.skill).subscribe(() => {
        this.toolService.openSnackBar(
          $localize`:@@Saved:Data saved successfully`,
          $localize`:@@Ok:Ok`,
          ESnackbarTypes.Info
        );
        this.goBack();
      });
    } else {
      this.httpService.saveSkill(this.skill).subscribe(() => {
        this.toolService.openSnackBar(
          $localize`:@@Saved:Data saved successfully`,
          $localize`:@@Ok:Ok`,
          ESnackbarTypes.Info
        );
        this.initAll();
      });
    }
  }

  public selectedWikiDataObj(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (value) {
      for (const wikiObj of this.allWikiObj) {
        if (wikiObj.wikidata_name === value) {
          if (!this.skill.skill_keywords.includes(wikiObj)) {
            this.skill.skill_keywords.push(wikiObj);
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
    const index = this.skill.skill_keywords.indexOf(wikiObj);

    if (index >= 0) {
      this.skill.skill_keywords.splice(index, 1);
    }
  }
  private filterWikiDataObjs(value: string): WikidataObject[] {
    return this.wikiService.filterWikiDataObjs(value, this.allWikiObj);
  }

  private showInvalidIdError(): void {
    this.toolService.openSnackBar(
      $localize`:@@InvalidSkillId:Invalid id - can't find skill to edit!`,
      $localize`:@@Ok:Ok`,
      ESnackbarTypes.Error
    );
  }

  private initAll(): void {
    this.httpService
      .getWikidataAll()
      .subscribe((wikiObjs: WikidataObject[]) => {
        if (wikiObjs) {
          this.allWikiObj = wikiObjs;
        }
      });

    this.filteredWikiData = this.wikiDataObjCtrl.valueChanges.pipe(
      startWith(null),
      map((value) => (typeof value === "string" ? value : value?.skill_name)),
      map((name) =>
        name ? this.filterWikiDataObjs(name) : this.allWikiObj.slice()
      )
    );
  }

  private createForm(): void {
    this.editForm = this.fb.group({
      name: new FormControl(this.skill.skill_name, Validators.required),
      desc: new FormControl(this.skill.description, Validators.required),
      wikidata: this.wikiDataObjCtrl,
    });
  }
}
