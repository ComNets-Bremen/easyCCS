import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Content } from "../classes/content";
import { Skill } from "../classes/skill";
import { ESnackbarTypes } from "../enums/snackbarTypes";
import { HttpService } from "../services/http.service";
import { ToolService } from "../services/tool.service";
import { map, startWith } from "rxjs/operators";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";

@Component({
  selector: "app-edit-content",
  templateUrl: "./edit-content.component.html",
  styleUrls: ["./edit-content.component.scss"],
})
export class EditContentComponent implements OnInit {
  private id = 0;
  public content!: Content;
  public editForm!: FormGroup;
  public selectable = true;
  public removable = true;
  public reqSkillCtrl!: FormControl;
  public newSkillCtrl!: FormControl;
  public filteredReqSkills: Observable<Skill[]>;
  public filteredNewSkills: Observable<Skill[]>;
  public separatorKeysCodes: number[] = [ENTER, COMMA];

  private allSkills: Skill[];

  constructor(
    private route: ActivatedRoute,
    private toolService: ToolService,
    private httpService: HttpService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.allSkills = [];
    this.reqSkillCtrl = new FormControl("", Validators.required);
    this.newSkillCtrl = new FormControl("", Validators.required);
    this.httpService.getSkillAll().subscribe((skills: Skill[]) => {
      if (skills) {
        this.allSkills = skills;
      }
    });
    this.filteredReqSkills = this.reqSkillCtrl.valueChanges.pipe(
      startWith(null),
      map((value) => (typeof value === "string" ? value : value?.skill_name)),
      map((name) => (name ? this.filter(name) : this.allSkills.slice()))
    );
    this.filteredNewSkills = this.newSkillCtrl.valueChanges.pipe(
      startWith(null),
      map((value) => (typeof value === "string" ? value : value?.skill_name)),
      map((name) => (name ? this.filter(name) : this.allSkills.slice()))
    );
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      this.toolService.openSnackBar(
        $localize`:@@InvalidContentId:Invalid id - can't find content to edit!`,
        $localize`:@@Ok:Ok`,
        ESnackbarTypes.Error
      );
      return;
    }
    this.id = parseInt(id, 10);
    if (!this.id || isNaN(this.id)) {
      this.toolService.openSnackBar(
        $localize`:@@InvalidContentId:Invalid id - can't find content to edit!`,
        $localize`:@@Ok:Ok`,
        ESnackbarTypes.Error
      );
      return;
    }
    this.httpService.getContent(this.id).subscribe((content: Content) => {
      if (content) {
        this.content = content;
      } else {
        this.toolService.openSnackBar(
          $localize`:@@InvalidContentId:Invalid id - can't find content to edit!`,
          $localize`:@@Ok:Ok`,
          ESnackbarTypes.Error
        );
      }
    });
    this.editForm = this.fb.group({
      name: new FormControl("", Validators.required),
      desc: new FormControl("", Validators.required),
      reqSkills: this.reqSkillCtrl,
      outSkills: this.newSkillCtrl,
      wikidata: new FormControl(0, [Validators.min(0), Validators.max(10000)]),
      workload: new FormControl("", Validators.required),
      binaryContent: new FormControl("", Validators.required),
      urlContent: new FormControl("", Validators.required),
    });
  }

  public goBack(): void {
    this.router.navigate(["/content"]);
  }

  public editContent(content: Content): void {
    // TODO
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

  public add(event: MatChipInputEvent): void {
    event?.chipInput?.clear();
    this.reqSkillCtrl.setValue(null);
  }

  public remove(skill: Skill): void {
    const index = this.content.required_skills.indexOf(skill);

    if (index >= 0) {
      this.content.required_skills.splice(index, 1);
    }
  }

  private filter(value: string): Skill[] {
    if (!value) {
      return this.allSkills;
    }
    const filterValue = value.toLowerCase();
    // we use for loop instead of "Array.filter()" option to keep code more readable
    const skills: Skill[] = [];
    for (const skill of this.allSkills) {
      if (skill.skill_name.toLowerCase().includes(filterValue)) {
        skills.push(skill);
        continue;
      }
      for (const wikiobj of skill.skill_keywords) {
        if (wikiobj.wikidata_name.toLocaleLowerCase().includes(filterValue)) {
          skills.push(skill);
          continue;
        }
        for (const keyword of wikiobj.wikidata_related_fields) {
          if (keyword.toLocaleLowerCase().includes(filterValue)) {
            skills.push(skill);
            continue;
          }
        }
      }
    }
    return skills;
  }
}
