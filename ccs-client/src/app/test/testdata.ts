import { Content, SkillContent, UploadContent } from "../classes/content";
import { DocFile } from "../classes/docFile";
import { ContentModule } from "../classes/contentModule";
import { Skill } from "../classes/skill";
import { WikidataObject } from "../classes/wikiDataObj";

export class ContentTestData {
  public static contents: Content[];

  public static create(): void {
    const contents: Content[] = [];
    for (let i = 0; i < 20; i++) {
      const content = new Content();
      content.id = i + 1;
      content.content_name = `Content${i}`;
      content.content_description = `Content${i} description as a long text`;
      content.content_workload = i * 10;
      content.required_skills = [];
      content.new_skills = [];
      content.level = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
      for (let j = 0; j < 3; j++) {
        const skill = SkillTestData.getbyId(j + i);
        const newSkill = SkillTestData.getbyId(j + i + 2);
        if (skill) {
          content.required_skills.push(skill);
        }
        if (newSkill) {
          content.new_skills.push(newSkill);
        }
      }
      if (i % 2 !== 0) {
        content.url_content = [];
        content.url_content.push(`url_${i}`);
      }
      if (i % 3 !== 0) {
        content.binary_content = [];
        const docFile = new DocFile();
        docFile.id = i + 1;
        docFile.name = `docfile${i}`;
        content.binary_content.push(docFile);
      }
      contents.push(content);
    }

    this.contents = contents;
  }

  public static getbyId(id: number): Content | null {
    for (const content of this.contents) {
      if (content.id === id) {
        return content;
      }
    }
    return null;
  }

  static getSkillGraphContent(
    reqSkillIds: number[],
    newSkillIds: number[]
  ): SkillContent {
    const contents = [];
    for (const content of this.contents) {
      const cReSkillIds = content.required_skills.map((r) => r.id);
      const cnewSkillIds = content.new_skills.map((r) => r.id);
      for (const id of reqSkillIds) {
        if (cReSkillIds.indexOf(id) > -1) {
          if (contents.indexOf(content) === -1) {
            contents.push(content);
          }
        }
      }
      for (const id of newSkillIds) {
        if (cnewSkillIds.indexOf(id) > -1) {
          if (contents.indexOf(content) === -1) {
            contents.push(content);
          }
        }
      }
    }
    const skillC = new SkillContent();
    skillC.contents = contents;
    skillC.knownSkills = newSkillIds;
    const skill = SkillTestData.getbyId(reqSkillIds[reqSkillIds.length - 1]);
    if (skill) {
      skillC.criticalSkills.push(skill);
    }

    return skillC;
  }

  public static getSkillContent(id: number): any {
    const contents = [];
    for (const content of this.contents) {
      contents.push(content);
    }
    return contents;
  }

  public static update(content: Content): any {
    if (content.id) {
      for (let con of this.contents) {
        if (con.id === content.id) {
          con = content;
          return;
        }
      }
    }
    this.contents.push(content);
  }

  public static delete(id: number): any {
    if (id) {
      for (let i = 0; i < this.contents.length; i++) {
        const element = this.contents[i];
        if (element.id === id) {
          this.contents.splice(i, 1);
          return;
        }
      }
    }
  }

  public static upload(uploadContent: UploadContent): any {
    if (uploadContent.contentId) {
      for (const element of this.contents) {
        if (element.id === uploadContent.contentId) {
          const docFile = new DocFile();
          docFile.id = element.binary_content.length;
          const file = uploadContent.formData.get("file") as File;
          docFile.name = file.name;
          element.binary_content.push(docFile);
          return;
        }
      }
    }
  }

  public static deleteBinaryContent(contentId: number, docFile: DocFile): any {
    if (docFile && contentId) {
      for (const element of this.contents) {
        if (element.id === contentId) {
          element.binary_content.forEach((binEle, index) => {
            if (binEle.id === docFile.id) {
              element.binary_content.splice(index, 1);
              return;
            }
          });
        }
      }
    }
  }
}

export class SkillTestData {
  public static skills: Skill[];

  public static create(): void {
    this.skills = [];
    for (let j = 0; j < 100; j++) {
      const reqSkill = new Skill();
      reqSkill.id = j + 1;
      reqSkill.skill_name = `ReqSkill${j}`;
      reqSkill.description = `ReqSkill${j} description`;
      this.skills.push(reqSkill);
    }
  }

  public static getbyId(id: number): Skill | null {
    for (const skill of this.skills) {
      if (skill.id === id) {
        return skill;
      }
    }
    return null;
  }

  public static update(skill: Skill): any {
    if (skill.id) {
      for (let ski of this.skills) {
        if (ski.id === skill.id) {
          ski = skill;
          return;
        }
      }
    }
    this.skills.push(skill);
  }

  public static delete(id: number): any {
    if (id) {
      for (let i = 0; i < this.skills.length; i++) {
        const element = this.skills[i];
        if (element.id === id) {
          this.skills.splice(i, 1);
          return;
        }
      }
    }
  }
}

export class ModuleTestData {
  public static modules: ContentModule[];

  public static create(): void {
    this.modules = [];
    for (let j = 0; j < 10; j++) {
      const module = new ContentModule();
      module.id = j + 1;
      module.module_name = `Module${j}`;
      module.module_description = `Module${j} description`;
      module.module_content_modules = [];
      for (let i = 0; i < 3; i++) {
        const content = ContentTestData.getbyId(j + i);
        if (content) {
          module.module_content_modules.push(content);
        }
      }

      this.modules.push(module);
    }
  }

  public static getbyId(id: number): ContentModule | null {
    for (const module of this.modules) {
      if (module.id === id) {
        return module;
      }
    }
    return null;
  }

  public static update(cMod: ContentModule): any {
    if (cMod.id) {
      for (let module of this.modules) {
        if (module.id === cMod.id) {
          module = cMod;
          return;
        }
      }
    }
    this.modules.push(cMod);
  }

  public static delete(id: number): any {
    if (id) {
      for (let i = 0; i < this.modules.length; i++) {
        const element = this.modules[i];
        if (element.id === id) {
          this.modules.splice(i, 1);
          return;
        }
      }
    }
  }
}

export class WikiDataTestData {
  public static wikidataObjs: WikidataObject[];

  public static create(): void {
    this.wikidataObjs = [];
    for (let j = 0; j < 10; j++) {
      const wikiObj = new WikidataObject();
      wikiObj.wikidata_id = j + 1;
      wikiObj.wikidata_name = `WikiObj${j}`;
      for (let i = 0; i < 5; i++) {
        wikiObj.wikidata_related_fields.push(`Field${i}`);
        wikiObj.wikidata_related_fields_raw.push(`RawField${i}`);
      }
      this.wikidataObjs.push(wikiObj);
    }
  }

  public static getbyId(id: number): WikidataObject | null {
    for (const wikiObj of this.wikidataObjs) {
      if (wikiObj.wikidata_id === id) {
        return wikiObj;
      }
    }
    return null;
  }

  public static update(wikiObj: WikidataObject): any {
    if (wikiObj.wikidata_id) {
      for (let ski of this.wikidataObjs) {
        if (ski.wikidata_id === wikiObj.wikidata_id) {
          ski = wikiObj;
          return;
        }
      }
    }
    this.wikidataObjs.push(wikiObj);
  }

  public static delete(id: number): any {
    if (id) {
      for (let i = 0; i < this.wikidataObjs.length; i++) {
        const element = this.wikidataObjs[i];
        if (element.wikidata_id === id) {
          this.wikidataObjs.splice(i, 1);
          return;
        }
      }
    }
  }
}
