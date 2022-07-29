import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Skill } from "../classes/skill";
import { ESnackbarTypes } from "../enums/snackbarTypes";
import { HttpService } from "../services/http.service";
import { ToolService } from "../services/tool.service";
import { SkillService } from "../skill.service";

@Component({
  selector: "app-skill-detail",
  templateUrl: "./skill-detail.component.html",
  styleUrls: ["./skill-detail.component.scss"],
})
export class SkillDetailComponent implements OnInit {
  public skill: Skill = new Skill();

  private id = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toolService: ToolService,
    private httpService: HttpService,
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
    this.httpService.getSkill(this.id).subscribe((skill: Skill) => {
      if (skill) {
        this.skill = skill;
      } else {
        this.showInvalidIdError();
      }
    });
  }

  public goBack(): void {
    if (this.skillService.fromRoute.indexOf("/") === -1) {
      this.skillService.keepTempVals = true;
      this.router.navigate([`/${this.skillService.fromRoute}`]);
    } else {
      const tokens = this.skillService.fromRoute.split("/");
      this.router.navigate([`/${tokens[0]}`, tokens[1]]);
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
      $localize`:@@InvalidSkillIdDetail:Invalid id - can't find skill!`,
      $localize`:@@Ok:Ok`,
      ESnackbarTypes.Error
    );
  }
}
