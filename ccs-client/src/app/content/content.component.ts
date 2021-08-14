import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Content } from "../classes/content";
import { HttpService } from "../services/http.service";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.css"],
})
export class ContentComponent implements OnInit {
  public displayedColumns: string[] = [
    "content_name",
    "material",
    "content_workload",
    "action",
  ];
  public dataSource!: MatTableDataSource<Content>;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getContent();
  }

  private getContent(): void {
    this.httpService.getContent().subscribe((contents: Content[]) => {
      this.dataSource = new MatTableDataSource(contents);
    });
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public deleteContent(id: number): void {
    this.httpService.deleteContent(id).subscribe(() => {
      this.getContent();
    });
  }

  public editContent(id: number): void {
    // TODO edit content view
  }
}
