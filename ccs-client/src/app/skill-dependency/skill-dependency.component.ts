import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Content } from "../classes/content";
import { Skill } from "../classes/skill";
import { HttpService } from "../services/http.service";
import { ToolService } from "../services/tool.service";

@Component({
  selector: "app-skill-dependency",
  templateUrl: "./skill-dependency.component.html",
  styleUrls: ["./skill-dependency.component.scss"],
})
export class SkillDependencyComponent implements OnInit {
  public displayedColumns: string[] = ["skill_name"];
  public showResult = false;

  public displayedColumnsResult: string[] = [
    "content_name",
    "content_level",
    "required_skills",
    "new_skills",
  ];
  public dataSourceResult!: MatTableDataSource<Content>;

  public skills!: Skill[];
  public dataSource!: MatTableDataSource<Skill>;

  constructor(
    private httpService: HttpService,
    private toolService: ToolService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getSkills();
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  public showSkillDependency(event: Event, skill: Skill): void {
    event.preventDefault();
    this.httpService.getTree(skill.id).subscribe((contents: Content[]) => {
      this.dataSourceResult = new MatTableDataSource(contents);
      this.showResult = true;
    });
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
