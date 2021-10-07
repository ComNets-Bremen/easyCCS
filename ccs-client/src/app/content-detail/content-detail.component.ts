import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Content } from "../classes/content";
import { Skill } from "../classes/skill";
import { ESnackbarTypes } from "../enums/snackbarTypes";
import { ContentService } from "../services/content.service";
import { HttpService } from "../services/http.service";
import { ToolService } from "../services/tool.service";
import { SkillService } from "../skill.service";

@Component({
  selector: "app-content-detail",
  templateUrl: "./content-detail.component.html",
  styleUrls: ["./content-detail.component.scss"],
})
export class ContentDetailComponent implements OnInit {
  public content: Content = new Content();

  private id = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toolService: ToolService,
    private httpService: HttpService,
    private skillService: SkillService,
    private contentService: ContentService
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
    this.httpService.getContent(this.id).subscribe((content: Content) => {
      if (content) {
        this.content = content;
        this.skillService.fromRoute = `content/${this.id}`;
      } else {
        this.showInvalidIdError();
      }
    });
  }

  public goBack(): void {
    if (this.contentService.fromRoute.indexOf("/") === -1) {
      this.router.navigate([`/${this.contentService.fromRoute}`]);
    } else {
      const tokens = this.contentService.fromRoute.split("/");
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
      $localize`:@@InvalidContentDetail:Invalid id - can't find content!`,
      $localize`:@@Ok:Ok`,
      ESnackbarTypes.Error
    );
  }
}
