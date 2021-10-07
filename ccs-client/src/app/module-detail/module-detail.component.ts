import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ContentModule } from "../classes/contentModule";
import { Skill } from "../classes/skill";
import { ESnackbarTypes } from "../enums/snackbarTypes";
import { ContentService } from "../services/content.service";
import { HttpService } from "../services/http.service";
import { ToolService } from "../services/tool.service";
import { SkillService } from "../skill.service";

@Component({
  selector: "app-module-detail",
  templateUrl: "./module-detail.component.html",
  styleUrls: ["./module-detail.component.scss"],
})
export class ModuleDetailComponent implements OnInit {
  public module: ContentModule = new ContentModule();
  public requiredSkills: Skill[] = [];
  public newSkills: Skill[] = [];

  private id = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toolService: ToolService,
    private httpService: HttpService,
    private contentService: ContentService,
    private skillService: SkillService
  ) {
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
    this.httpService.getModule(this.id).subscribe((module: ContentModule) => {
      if (module) {
        this.contentService.fromRoute = `module/${this.id}`;
        this.skillService.fromRoute = `module/${this.id}`;
        this.module = module;
        this.createSkills();
      } else {
        this.showInvalidIdError();
      }
    });
  }

  public goBack(): void {
    this.router.navigate(["/module"]);
  }

  private createSkills() {
    for (const content of this.module.module_content_modules) {
      for (const reqSkill of content.required_skills) {
        this.requiredSkills.push(reqSkill);
      }
      for (const newSkill of content.new_skills) {
        this.newSkills.push(newSkill);
      }
    }
  }

  private initAll(): void {
    // this.httpService
    //   .getWikidataAll()
    //   .subscribe((wikiObjs: WikidataObject[]) => {
    //     if (wikiObjs) {
    //       this.allWikiObj = wikiObjs;
    //     }
    //   });
  }

  private showInvalidIdError(): void {
    this.toolService.openSnackBar(
      $localize`:@@InvalidModuleIdDetail:Invalid id - can't find module!`,
      $localize`:@@Ok:Ok`,
      ESnackbarTypes.Error
    );
  }
}
