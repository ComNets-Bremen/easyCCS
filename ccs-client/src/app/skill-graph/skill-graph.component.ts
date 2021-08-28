import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
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
  selector: "app-skill-graph",
  templateUrl: "./skill-graph.component.html",
  styleUrls: ["./skill-graph.component.scss"],
})
export class SkillGraphComponent implements OnInit {
  private id = 0;
  public graphForm!: FormGroup;
  public selectable = true;
  public removable = true;
  public reqSkillCtrl!: FormControl;
  public newSkillCtrl!: FormControl;
  public filteredReqSkills!: Observable<Skill[]>;
  public filteredNewSkills!: Observable<Skill[]>;
  public filteredWikiData!: Observable<WikidataObject[]>;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public requiredSkills: Skill[] = [];
  public newSkills: Skill[] = [];

  private allSkills: Skill[] = [];

  constructor(
    private route: ActivatedRoute,
    private toolService: ToolService,
    private httpService: HttpService,
    private fb: FormBuilder,
    private router: Router,
    private wikiService: WikiDataObjService,
    private skillService: SkillService
  ) {
    this.reqSkillCtrl = new FormControl("");
    this.newSkillCtrl = new FormControl("");

    this.initAll();
  }

  ngOnInit(): void {
    this.graphForm = this.fb.group({
      title: new FormControl(""),
      reqSkills: this.reqSkillCtrl,
      newSkills: this.newSkillCtrl,
    });
  }

  public selectedReqSkill(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (value) {
      for (const skill of this.allSkills) {
        if (skill.skill_name === value) {
          if (!this.requiredSkills.includes(skill)) {
            this.requiredSkills.push(skill);
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
          if (!this.newSkills.includes(skill)) {
            this.newSkills.push(skill);
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
    const index = this.requiredSkills.indexOf(skill);

    if (index >= 0) {
      this.requiredSkills.splice(index, 1);
    }
  }

  public removeNewSkill(skill: Skill): void {
    const index = this.newSkills.indexOf(skill);

    if (index >= 0) {
      this.newSkills.splice(index, 1);
    }
  }

  private filterSkills(value: string): Skill[] {
    return this.skillService.filterSkills(value, this.allSkills);
  }

  private initAll(): void {
    this.httpService.getSkillAll().subscribe((skills: Skill[]) => {
      if (skills) {
        this.allSkills = skills;
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
  }

  public submit(): void {}
}
