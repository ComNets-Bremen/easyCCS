import { Content } from "./content";

// named "ContentModule" to prevent nameing issues with angular Module import
export class ContentModule {
  public id = -1;
  public module_name = "";
  public module_description = "";
  public module_content_modules: Content[] = [];
}
