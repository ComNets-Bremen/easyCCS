import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import {
  BaseGraphConfiguration,
  GraphConfiguration,
} from "../classes/configuration";
import { ContactFormData, LicenseFormData } from "../classes/contactFormData";
import { Content, SkillContent, UploadContent } from "../classes/content";
import { ContentModule } from "../classes/contentModule";
import { DocFile } from "../classes/docFile";
import { BaseNode, SkillGraphData } from "../classes/graphData";
import { Skill } from "../classes/skill";
import { WikidataObject } from "../classes/wikiDataObj";
import {
  GraphDataDemo,
  GraphStoredConfiguration,
  SkillGraphDataDemo,
} from "../test/graph";
import {
  ContentTestData,
  ModuleTestData,
  SkillTestData,
  WikiDataTestData,
} from "../test/testdata";

import { HttpService } from "./http.service.test";

describe("HttpService", () => {
  let service: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(HttpService);
    SkillTestData.create();
    ContentTestData.create();
  });

  it("should be created", async () => {
    expect(service).toBeTruthy();
  });

  // AUTHENTICATION AND USER STUFF

  it("login", async () => {
    const user = "dummy";
    const pw = "dummypw";
    service.login(user, pw).subscribe((resultToken: string) => {
      expect(resultToken).toBe("newsessiontoken");
    });
  });

  it("logoff", async () => {
    service.logout().subscribe((result: boolean) => {
      expect(result).toBe(true);
    });
  });

  it("contact", async () => {
    const formData = new ContactFormData();
    formData.name = "test";
    formData.subject = "test subject";
    formData.email = "test@test.de";
    formData.message = "test message";
    service.contact(formData).subscribe((result: boolean) => {
      expect(result).toBe(true);
    });
  });

  it("register", async () => {
    const formData = new LicenseFormData();
    formData.name = "test";
    formData.affiliation = "my company";
    formData.email = "test@test.de";
    formData.interest = "test interest message";
    service.licenseRequest(formData).subscribe((result: boolean) => {
      expect(result).toBe(true);
    });
  });

  // CONTENTS

  it("get all contents", async () => {
    service.getContentAll().subscribe((contents: Content[]) => {
      const content = ContentTestData.contents;
      expect(contents).toEqual(content);
    });
  });

  it("get specific content", async () => {
    const id = 1;
    service.getContent(id).subscribe((singleContent: Content) => {
      const content = ContentTestData.getbyId(id);
      if (singleContent) {
        expect(singleContent).toEqual(content as Content);
      }
    });
  });

  it("delete content", async () => {
    const id = 1;
    service.deleteContent(id).subscribe((result: boolean) => {
      expect(result).toBe(true);
    });
  });

  it("create content", async () => {
    const content = new Content();
    content.content_name = "test";
    content.content_description = "Test description";
    content.content_workload = 90;
    content.new_skills = [];
    const skill = SkillTestData.getbyId(1);
    if (skill) {
      content.new_skills.push(skill);
    }
    const skill2 = SkillTestData.getbyId(2);
    if (skill2) {
      content.required_skills.push(skill2);
    }
    service.createContent(content).subscribe((result: boolean) => {
      expect(result).toBe(true);
    });
  });

  it("update content", async () => {
    const content = new Content();
    content.content_name = "test";
    content.content_description = "Test description";
    content.content_workload = 90;
    content.new_skills = [];
    content.required_skills = [];
    const skill = SkillTestData.getbyId(1);
    if (skill) {
      content.new_skills.push(skill);
    }
    const skill2 = SkillTestData.getbyId(2);
    if (skill2) {
      content.required_skills.push(skill2);
    }
    service.saveContent(content).subscribe((result: boolean) => {
      expect(result).toBe(true);
    });
  });

  it("upload content", async () => {
    const formData = new FormData();
    formData.append("file", ContentTestData.testFile, "fileTestData.doc");
    const content = new UploadContent(10, formData);
    service.uploadContent(content).subscribe((result: boolean) => {
      expect(result).toBe(true);
    });
  });

  it("remove binary content", async () => {
    const docFile = new DocFile();
    docFile.id = 10;
    docFile.name = "test";
    service.removeBinaryContent(10, docFile).subscribe((result: boolean) => {
      expect(result).toBe(true);
    });
  });

  // SKILLS

  it("get all skills", async () => {
    service.getSkillAll().subscribe((skills: Skill[]) => {
      const skill = SkillTestData.skills;
      expect(skills).toEqual(skill);
    });
  });

  it("get specific skill", async () => {
    const id = 1;
    service.getSkill(id).subscribe((skill: Skill) => {
      const ski = SkillTestData.getbyId(id);
      expect(skill).toEqual(ski as Skill);
    });
  });

  it("delete skill", async () => {
    const id = 1;
    service.deleteSkill(id).subscribe((result: boolean) => {
      expect(result).toBe(true);
    });
  });

  it("create skill", async () => {
    const skill = new Skill();
    skill.skill_name = "test";
    skill.description = "Test description";
    service.createSkill(skill).subscribe((result: boolean) => {
      expect(result).toBe(true);
    });
  });

  it("save skill", async () => {
    const skill = new Skill();
    skill.skill_name = "test";
    skill.description = "Test description";
    service.saveSkill(skill).subscribe((result: boolean) => {
      expect(result).toBe(true);
    });
  });

  it("get skill tree", async () => {
    const id = 1;
    service.getTree(id).subscribe((contents: Content[]) => {
      expect(contents).toBeDefined();
    });
  });

  // MODULE
  it("get all modules", async () => {
    service.getModuleAll().subscribe((modules: ContentModule[]) => {
      const module = ModuleTestData.modules;
      expect(modules).toEqual(module);
    });
  });

  it("get specific module", async () => {
    const id = 1;
    service.getModule(id).subscribe((module: ContentModule) => {
      const mod = ModuleTestData.getbyId(id);
      expect(module).toEqual(mod as ContentModule);
    });
  });

  it("delete module", async () => {
    const id = 1;
    service.deleteModule(id).subscribe((result: boolean) => {
      expect(result).toBe(true);
    });
  });

  it("create module", async () => {
    const module = new ContentModule();
    module.module_name = "test";
    module.module_description = "Test description";
    module.module_content_modules = [];
    const content = ContentTestData.getbyId(1);
    if (content) {
      module.module_content_modules.push(content);
    }
    service.createModule(module).subscribe((result: boolean) => {
      expect(result).toBe(true);
    });
  });

  it("save module", async () => {
    const module = new ContentModule();
    module.module_name = "test";
    module.module_description = "Test description";
    module.module_content_modules = [];
    const content = ContentTestData.getbyId(1);
    if (content) {
      module.module_content_modules.push(content);
    }
    service.saveModule(module).subscribe((result: boolean) => {
      expect(result).toBe(true);
    });
  });

  // WIKI DATA OBJECTS
  it("get all wiki data objects", async () => {
    service.getWikidataAll().subscribe((wikiDataObjs: WikidataObject[]) => {
      const objs = WikiDataTestData.wikidataObjs;
      expect(wikiDataObjs).toEqual(objs);
    });
  });

  it("get specific wiki data obj", async () => {
    const id = 1;
    service.getWikiData(id).subscribe((wikiObj: WikidataObject) => {
      const obj = WikiDataTestData.getbyId(id);
      expect(obj).toEqual(wikiObj as WikidataObject);
    });
  });

  // GRAPH
  it("get complete graph", async () => {
    service.getCompleteGraphData().subscribe((graphData: SkillGraphData) => {
      const objs = GraphDataDemo.demo;
      expect(graphData).toEqual(objs);
    });
  });

  it("get levels", async () => {
    const reqSkills = [1, 2];
    const newSkills = [3, 4];
    service
      .getLevels(reqSkills, newSkills)
      .subscribe((levels: Array<Array<BaseNode>>) => {
        const objs = SkillGraphDataDemo.levels;
        expect(levels).toEqual(objs);
      });
  });

  it("get skill graph", async () => {
    const reqSkills = [1, 2];
    const newSkills = [3, 4];
    service
      .getSkillGraphContent(reqSkills, newSkills)
      .subscribe((skillGraphData: SkillContent) => {
        const objs = ContentTestData.getSkillGraphContent(reqSkills, newSkills);
        expect(skillGraphData).toEqual(objs);
      });
  });

  // GRAPH Configurations
  it("get all configurations", async () => {
    service
      .getAllConfigurations()
      .subscribe((configs: BaseGraphConfiguration[]) => {
        const configTitles = GraphStoredConfiguration.titles;
        expect(configs).toEqual(configTitles);
      });
  });

  it("get specific config", async () => {
    const loadConfig = new BaseGraphConfiguration();
    loadConfig.id = 1;
    loadConfig.title = `TitleToLoad${loadConfig.id}`;
    service.loadConfig(loadConfig).subscribe((config: GraphConfiguration) => {
      const testConf = GraphStoredConfiguration.demo(loadConfig);
      expect(testConf).toBeDefined();
      if (testConf) {
        expect(config).toEqual(testConf);
      }
    });
  });

  it("delete config", async () => {
    const id = 1;
    service.deleteConfiguration(id).subscribe((result: boolean) => {
      expect(result).toBe(true);
    });
  });

  it("save config", async () => {
    const config = new GraphConfiguration();
    config.title = "test";
    service.saveConfiguration(config).subscribe((result: boolean) => {
      expect(result).toBe(true);
    });
  });
});
