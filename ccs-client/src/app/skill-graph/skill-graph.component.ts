import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import {
  BaseGraphConfiguration,
  GraphConfiguration,
} from "../classes/configuration";
import { Content, SkillContent } from "../classes/content";
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
  public showGraph = false;
  public loadGraphForm!: FormGroup;
  public graphForm!: FormGroup;
  public selectable = true;
  public removable = true;
  public reqSkillCtrl!: FormControl;
  public newSkillCtrl!: FormControl;
  public loadConfigCtrl!: FormControl;
  public filteredReqSkills!: Observable<Skill[]>;
  public filteredNewSkills!: Observable<Skill[]>;
  public filteredWikiData!: Observable<WikidataObject[]>;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public requiredSkills: Skill[] = [];
  public newSkills: Skill[] = [];
  public displayedColumns: string[] = [
    "content_name",
    "content_workload",
    "required_skills",
    "new_skills",
  ];
  public dataSource!: MatTableDataSource<Content>;
  public skillContent: SkillContent;
  public totalWorkload = 0;
  public allConfigs: BaseGraphConfiguration[] = [];

  private allSkills: Skill[] = [];

  constructor(
    private toolService: ToolService,
    private httpService: HttpService,
    private fb: FormBuilder,
    private router: Router,
    private skillService: SkillService
  ) {
    this.reqSkillCtrl = new FormControl("");
    this.newSkillCtrl = new FormControl("");
    this.skillContent = new SkillContent();
    this.initAll();
  }

  ngOnInit(): void {
    if (this.checkServiceValues()) {
      this.initGraph();
      this.initLoadGraph();
    }
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

  public submit(): void {
    this.showGraph = true;
    this.skillService.setTempValues(
      this.requiredSkills,
      this.newSkills,
      this.graphForm.get("title")?.value
    );
    this.getGraphContent(this.requiredSkills, this.newSkills);
  }

  public saveConfig(): void {
    const config = new GraphConfiguration();
    config.title = this.graphForm.get("title")?.value;
    config.required_skills = this.requiredSkills.map((r) => r.id);
    config.known_skills = this.newSkills.map((n) => n.id);
    if (config.title) {
      this.httpService.saveConfiguration(config).subscribe(() => {
        this.toolService.openSnackBar(
          $localize`:@@Saved:Data saved successfully`,
          $localize`:@@Ok:Ok`,
          ESnackbarTypes.Info
        );
      });
    }
  }

  public getTextClass(id: number): string {
    let style = "text-default";
    if (this.skillContent.knownSkills.indexOf(id) !== -1) {
      style = "text-algo";
    }
    return style;
  }

  public isCriticalSkill(id: number): boolean {
    const cSkillIds = this.skillContent.criticalSkills.map((c) => c.id);
    return cSkillIds.indexOf(id) !== -1;
  }

  public loadConfig(): void {
    const loadConfig = this.loadGraphForm.get("loadConfig")?.value;
    this.httpService
      .loadConfig(loadConfig)
      .subscribe((config: GraphConfiguration) => {
        if (!config) {
          return;
        }
        this.initGraph();
        for (const skill of this.allSkills) {
          if (config.required_skills.indexOf(skill.id) !== -1) {
            this.requiredSkills.push(skill);
          }
          if (config.known_skills.indexOf(skill.id) !== -1) {
            this.newSkills.push(skill);
          }
          this.graphForm.get("title")?.setValue(config.title);
        }
      });
  }

  private filterSkills(value: string): Skill[] {
    return this.skillService.filterSkills(value, this.allSkills);
  }

  private initAll(): void {
    this.httpService
      .getAllConfigurations()
      .subscribe((titles: BaseGraphConfiguration[]) => {
        this.allConfigs = titles;
      });

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

  private initGraph(): void {
    this.graphForm = this.fb.group({
      title: new FormControl(""),
      reqSkills: this.reqSkillCtrl,
      newSkills: this.newSkillCtrl,
    });
  }

  private initLoadGraph(): void {
    this.loadGraphForm = this.fb.group({
      loadConfig: this.loadConfigCtrl,
    });
  }

  private getGraphContent(reqSkills: Skill[], newSkills: Skill[]): void {
    const reqSkillsIds = reqSkills.map((r) => r.id);
    const newSkillsIds = newSkills.map((n) => n.id);
    this.httpService
      .getSkillGraphContent(reqSkillsIds, newSkillsIds)
      .subscribe((skillContent: SkillContent) => {
        for (const content of skillContent.contents) {
          this.totalWorkload += content.content_workload;
        }
        this.skillContent = skillContent;
        this.dataSource = new MatTableDataSource(skillContent.contents);
      });
  }

  private checkServiceValues(): boolean {
    if (
      this.skillService.requiredSkills.length > 0 ||
      this.skillService.newSkills.length > 0 ||
      this.skillService.title
    ) {
      this.initGraph();
      this.initLoadGraph();
      this.requiredSkills = this.skillService.requiredSkills;
      this.newSkills = this.skillService.newSkills;
      this.graphForm.get("title")?.setValue(this.skillService.title);
      this.showGraph = true;
      this.getGraphContent(this.requiredSkills, this.newSkills);
      this.skillService.clearTempValues();
      return false;
    }
    return true;
  }
}
