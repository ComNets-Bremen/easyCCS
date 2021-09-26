import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Content } from "../classes/content";
import { HttpService } from "../services/http.service";
import { Sort } from "@angular/material/sort";
import { ToolService } from "../services/tool.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogData } from "../classes/confirmDialogData";
import { BaseDialogComponent } from "../base-dialog/base-dialog.component";
import { ESnackbarTypes } from "../enums/snackbarTypes";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.scss"],
})
export class ContentComponent implements OnInit {
  public displayedColumns: string[] = [
    "content_name",
    "material",
    "content_workload",
    "action",
  ];

  public contents!: Content[];
  public dataSource!: MatTableDataSource<Content>;

  constructor(
    private httpService: HttpService,
    private toolService: ToolService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getContent();
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public deleteContent(id: number): void {
    const dialogData = new ConfirmDialogData(
      $localize`:@@DeleteContent:Delete Content?`,
      $localize`:@@AreYouSure:Are your sure to delete selected data?`,
      $localize`:@@Cancel:Cancel`,
      $localize`:@@Delete:Delete`
    );
    const dialogRef = this.dialog.open(BaseDialogComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.httpService.deleteContent(id).subscribe(() => {
          this.toolService.openSnackBar(
            $localize`:@@Saved:Data saved successfully`,
            $localize`:@@Ok:Ok`,
            ESnackbarTypes.Info
          );
          this.getContent();
        });
      }
    });
  }

  public editContent(id: number): void {
    this.router.navigate(["/editcontent", id]);
  }

  public sortData(sort: Sort): void {
    const data = this.contents.slice();
    if (!sort.active || sort.direction === "") {
      this.contents = data;
      this.dataSource.connect().next(this.contents);
      return;
    }

    this.contents = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "content_name":
          return this.toolService.compare(
            a.content_name,
            b.content_name,
            isAsc
          );
        case "workload":
          return this.toolService.compare(
            a.content_workload,
            b.content_workload,
            isAsc
          );
        default:
          return 0;
      }
    });
    this.dataSource.connect().next(this.contents);
  }

  private getContent(): void {
    this.httpService.getContentAll().subscribe((contents: Content[]) => {
      this.contents = contents;
      this.contents.sort((a, b) =>
        this.toolService.compare(a.content_name, b.content_name, true)
      );
      this.dataSource = new MatTableDataSource(contents);
    });
  }
}
