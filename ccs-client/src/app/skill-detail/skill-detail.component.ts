import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "d3";
import { startWith } from "rxjs/operators";
import { Skill } from "../classes/skill";
import { WikidataObject } from "../classes/wikiDataObj";
import { ESnackbarTypes } from "../enums/snackbarTypes";
import { HttpService } from "../services/http.service";
import { ToolService } from "../services/tool.service";
import { WikiDataObjService } from "../services/wiki-data-obj.service";

@Component({
  selector: "app-skill-detail",
  templateUrl: "./skill-detail.component.html",
  styleUrls: ["./skill-detail.component.scss"],
})
export class SkillDetailComponent implements OnInit {
  private id = 0;
  public skill!: Skill;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toolService: ToolService,
    private httpService: HttpService
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
    this.router.navigate(["/skillgraph"]);
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
