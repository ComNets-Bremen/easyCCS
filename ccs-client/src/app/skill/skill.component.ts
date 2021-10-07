import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { BaseDialogComponent } from "../base-dialog/base-dialog.component";
import { ConfirmDialogData } from "../classes/confirmDialogData";
import { Skill } from "../classes/skill";
import { ESnackbarTypes } from "../enums/snackbarTypes";
import { HttpService } from "../services/http.service";
import { ToolService } from "../services/tool.service";
import { SkillService } from "../skill.service";

@Component({
  selector: "app-skill",
  templateUrl: "./skill.component.html",
  styleUrls: ["./skill.component.scss"],
})
export class SkillComponent implements OnInit {
  public displayedColumns: string[] = ["skill_name", "action"];

  public skills!: Skill[];
  public dataSource!: MatTableDataSource<Skill>;

  constructor(
    private httpService: HttpService,
    private toolService: ToolService,
    private router: Router,
    private skillService: SkillService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.skillService.fromRoute = "skill";
    this.getSkills();
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public deleteSkill(id: number): void {
    const dialogData = new ConfirmDialogData(
      $localize`:@@DeleteSkill:Delete Skill?`,
      $localize`:@@AreYouSure:Are your sure to delete selected data?`,
      $localize`:@@Cancel:Cancel`,
      $localize`:@@Delete:Delete`
    );
    const dialogRef = this.dialog.open(BaseDialogComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.httpService.deleteSkill(id).subscribe(() => {
          this.toolService.openSnackBar(
            $localize`:@@Saved:Data saved successfully`,
            $localize`:@@Ok:Ok`,
            ESnackbarTypes.Info
          );
          this.getSkills();
        });
      }
    });
  }

  public editSkill(id: number): void {
    this.router.navigate(["/editskill", id]);
  }

  public sortData(sort: Sort): void {
    const data = this.skills.slice();
    if (!sort.active || sort.direction === "") {
      this.skills = data;
      this.dataSource.connect().next(this.skills);
      return;
    }

    this.skills = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "skill_name":
          return this.toolService.compare(a.skill_name, b.skill_name, isAsc);
        default:
          return 0;
      }
    });
    this.dataSource.connect().next(this.skills);
  }

  private getSkills(): void {
    this.httpService.getSkillAll().subscribe((skills: Skill[]) => {
      this.skills = skills;
      this.skills.sort((a, b) =>
        this.toolService.compare(a.skill_name, b.skill_name, true)
      );
      this.dataSource = new MatTableDataSource(skills);
    });
  }
}
