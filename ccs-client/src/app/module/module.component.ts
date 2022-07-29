import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { BaseDialogComponent } from "../base-dialog/base-dialog.component";
import { ConfirmDialogData } from "../classes/confirmDialogData";
import { ContentModule } from "../classes/contentModule";
import { ESnackbarTypes } from "../enums/snackbarTypes";
import { HttpService } from "../services/http.service";
import { ToolService } from "../services/tool.service";

@Component({
  selector: "app-module",
  templateUrl: "./module.component.html",
  styleUrls: ["./module.component.scss"],
})
export class ModuleComponent implements OnInit {
  public displayedColumns: string[] = [
    "module_name",
    "module_workload",
    "action",
  ];

  public modules!: ContentModule[];
  public dataSource!: MatTableDataSource<ContentModule>;

  constructor(
    private httpService: HttpService,
    private toolService: ToolService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getModules();
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public deleteModule(id: number): void {
    const dialogData = new ConfirmDialogData(
      $localize`:@@DeleteModule:Delete module?`,
      $localize`:@@AreYouSure:Are your sure to delete selected data?`,
      $localize`:@@Cancel:Cancel`,
      $localize`:@@Delete:Delete`
    );
    const dialogRef = this.dialog.open(BaseDialogComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.httpService.deleteModule(id).subscribe(() => {
          this.toolService.openSnackBar(
            $localize`:@@Saved:Data saved successfully`,
            $localize`:@@Ok:Ok`,
            ESnackbarTypes.Info
          );
          this.getModules();
        });
      }
    });
  }

  public editModule(id: number): void {
    this.router.navigate(["/editmodule", id]);
  }

  public sortData(sort: Sort): void {
    const data = this.modules.slice();
    if (!sort.active || sort.direction === "") {
      this.modules = data;
      this.dataSource.connect().next(this.modules);
      return;
    }

    this.modules = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "module_name":
          return this.toolService.compare(a.module_name, b.module_name, isAsc);
        default:
          return 0;
      }
    });
    this.dataSource.connect().next(this.modules);
  }

  private getModules(): void {
    this.httpService.getModuleAll().subscribe((modules: ContentModule[]) => {
      this.modules = modules;
      for (const module of this.modules) {
        module.calcWorkload();
      }
      this.modules.sort((a, b) =>
        this.toolService.compare(a.module_name, b.module_name, true)
      );
      this.dataSource = new MatTableDataSource(modules);
    });
  }
}
