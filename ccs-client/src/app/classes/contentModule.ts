import { Content } from "./content";

// named "ContentModule" to prevent nameing issues with angular Module import
export class ContentModule {
  public id = -1;
  public module_name = "";
  public module_description = "";
  public module_workload = 0; // used from content
  public module_content_modules: Content[] = [];

  public calcWorkload(): void {
    for (const content of this.module_content_modules) {
      this.module_workload += content.content_workload;
    }
  }
}
