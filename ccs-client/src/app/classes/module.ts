import { Content } from "./content";

export class Module {
  public id = -1;
  public module_name = "";
  public module_description = "";
  public module_content_modules: Content[] = [];
}
