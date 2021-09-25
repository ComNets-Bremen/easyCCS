import { BaseUser } from "./baseUser";
import { DocFile } from "./docFile";
import { Skill } from "./skill";
import { WikidataObject } from "./wikiDataObj";

export class Content {
  public id = -1;
  public content_name = "";
  public level = 0;
  public content_description = "";
  public required_skills: Skill[] = [];
  public new_skills: Skill[] = [];
  public content_keywords: WikidataObject[] = [];
  public content_workload = 0;
  public binary_content: DocFile[] = [];
  public url_content: string[] = [];
  public created!: Date;
  public updated!: Date;
  public added_by!: BaseUser;
  public is_public = false;
}

export class UploadContent {
  constructor(public contentId: number, public formData: FormData) {}
}

export class SkillContent {
  public contents: Content[] = [];
  public knownSkills: number[] = [];
  public criticalSkills: Skill[] = [];
}
