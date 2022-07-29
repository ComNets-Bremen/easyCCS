import { WikidataObject } from "./wikiDataObj";

export class Skill {
  public id = -1;
  public skill_name = "";
  public description = ""; // TODO => check if needed
  public skill_keywords: WikidataObject[] = [];
}
