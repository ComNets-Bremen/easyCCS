import { HttpClientModule } from "@angular/common/http";
import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import {
  BaseGraphConfiguration,
  GraphConfiguration,
} from "../classes/configuration";
import { ContactFormData } from "../classes/contactFormData";
import { Content, SkillContent, UploadContent } from "../classes/content";
import { ContentModule } from "../classes/contentModule";
import { DocFile } from "../classes/docFile";
import { SkillGraphData, BaseNode } from "../classes/graphData";
import { Skill } from "../classes/skill";
import { WikidataObject } from "../classes/wikiDataObj";

import { HttpService } from "./http.service";

describe("HttpService", () => {
  let httpTestingController: HttpTestingController;
  let service: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientModule] });
    service = TestBed.inject(HttpService);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
    // httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    //  httpTestingController.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  // AUTHENTICATION AND USER STUFF

  it("login", async (done: DoneFn) => {
    const user = "dummy";
    const pw = "dummypw";
    service.login(user, pw).subscribe(
      (resultToken: string) => {
        expect(resultToken.length).not.toEqual(0);
        done();
      },
      (err) => {
        fail(`login failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  // it("logoff", async (done: DoneFn) => {
  //   service.logout().subscribe((result: boolean) => {
  //     expect(result).toBe(true);
  //   }, (err) => {
  //     fail(`logout failed: ${err.status} - ${err.statusText}`);
  //   });
  // });

  it("contact", async (done: DoneFn) => {
    const formData = new ContactFormData();
    formData.name = "test";
    formData.subject = "test subject";
    formData.email = "test@test.de";
    formData.message = "test message";
    service.contact(formData).subscribe(
      (result: boolean) => {
        expect(result).toBe(true);
        done();
      },
      (err) => {
        fail(`send contact message failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  // CONTENTS

  it("get all contents", async (done: DoneFn) => {
    service.getContentAll().subscribe(
      (contents: Content[]) => {
        expect(contents).toBeDefined();
        done();
      },
      (err) => {
        fail(`get all contents failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  it("get specific content", async (done: DoneFn) => {
    const id = 1;
    service.getContent(id).subscribe(
      (singleContent: Content) => {
        expect(singleContent).toBeDefined();
        done();
      },
      (err) => {
        fail(`get content failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  it("delete content", async (done: DoneFn) => {
    const id = 1;
    service.deleteContent(id).subscribe(
      (result: boolean) => {
        expect(result).toBe(true);
        done();
      },
      (err) => {
        fail(`delete content failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  it("create content", async (done: DoneFn) => {
    const content = new Content();
    content.content_name = "test";
    content.content_description = "Test description";
    content.content_workload = 90;
    content.new_skills = [];
    const newSkillId = 1;
    const reqSkillId = 2;
    service.getSkill(newSkillId).subscribe(
      (skill: Skill) => {
        expect(skill).toBeDefined();
        if (skill) {
          content.new_skills.push(skill);
        }
        service.getSkill(reqSkillId).subscribe(
          (skillReq: Skill) => {
            expect(skillReq).toBeDefined();
            if (skillReq) {
              content.required_skills.push(skillReq);
            }
            service.createContent(content).subscribe(
              (result: boolean) => {
                expect(result).toBe(true);
                done();
              },
              (err) => {
                fail(
                  `create content failed: ${err.status} - ${err.statusText}`
                );
                done();
              }
            );
          },
          (err) => {
            fail(
              `get skill with ${reqSkillId} for create content failed: ${err.status} - ${err.statusText}`
            );
            done();
          }
        );
      },
      (err) => {
        fail(
          `get skill with ${newSkillId} for create content failed: ${err.status} - ${err.statusText}`
        );
        done();
      }
    );
  });

  it("update content", async (done: DoneFn) => {
    const content = new Content();
    content.content_name = "test";
    content.content_description = "Test description";
    content.content_workload = 90;
    content.new_skills = [];
    content.required_skills = [];
    const newSkillId = 1;
    const reqSkillId = 2;
    service.getSkill(newSkillId).subscribe(
      (skill: Skill) => {
        expect(skill).toBeDefined();
        if (skill) {
          content.new_skills.push(skill);
        }
        service.getSkill(reqSkillId).subscribe(
          (skillReq: Skill) => {
            expect(skillReq).toBeDefined();
            if (skillReq) {
              content.required_skills.push(skillReq);
            }
            service.saveContent(content).subscribe(
              (result: boolean) => {
                expect(result).toBe(true);
                done();
              },
              (err) => {
                fail(`save content failed: ${err.status} - ${err.statusText}`);
                done();
              }
            );
          },
          (err) => {
            fail(
              `get skill with ${reqSkillId} for save content failed: ${err.status} - ${err.statusText}`
            );
            done();
          }
        );
      },
      (err) => {
        fail(
          `get skill with ${newSkillId} for save content failed: ${err.status} - ${err.statusText}`
        );
        done();
      }
    );
  });

  const fakeBlob = (
    name: string,
    size: number,
    type: string,
    lastModified = new Date()
  ) => {
    const blob = new Blob(["a".repeat(size)], { type });
    return new File([blob], name);
  };

  it("upload content", async (done: DoneFn) => {
    const formData = new FormData();
    const file = fakeBlob("file.txt", 50000, "plain/txt");
    formData.append("file", file, "fileTestData.doc");
    const content = new UploadContent(10, formData);
    service.uploadContent(content).subscribe(
      (result: boolean) => {
        expect(result).toBe(true);
        done();
      },
      (err) => {
        fail(`upload content failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  it("remove binary content", async (done: DoneFn) => {
    const docFile = new DocFile();
    docFile.id = 10;
    docFile.name = "test";
    service.removeBinaryContent(10, docFile).subscribe(
      (result: boolean) => {
        expect(result).toBe(true);
        done();
      },
      (err) => {
        fail(`remove binary content failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  // SKILLS

  it("get all skills", async (done: DoneFn) => {
    service.getSkillAll().subscribe(
      (skills: Skill[]) => {
        expect(skills).toBeDefined();
        done();
      },
      (err) => {
        fail(`get all skills failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  it("get specific skill", async (done: DoneFn) => {
    const id = 1;
    service.getSkill(id).subscribe(
      (skill: Skill) => {
        expect(skill).toBeDefined();
        done();
      },
      (err) => {
        fail(`get skill iwth ${id} failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  it("delete skill", async (done: DoneFn) => {
    const id = 1;
    service.deleteSkill(id).subscribe(
      (result: boolean) => {
        expect(result).toBe(true);
        done();
      },
      (err) => {
        fail(`delete skill failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  it("create skill", async (done: DoneFn) => {
    const skill = new Skill();
    skill.skill_name = "test";
    skill.description = "Test description";
    service.createSkill(skill).subscribe(
      (result: boolean) => {
        expect(result).toBe(true);
        done();
      },
      (err) => {
        fail(`create skill failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  it("save skill", async (done: DoneFn) => {
    const skill = new Skill();
    skill.skill_name = "test";
    skill.description = "Test description";
    service.saveSkill(skill).subscribe(
      (result: boolean) => {
        expect(result).toBe(true);
        done();
      },
      (err) => {
        fail(`save skill failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  it("get skill tree", async (done: DoneFn) => {
    const id = 1;
    service.getTree(id).subscribe(
      (contents: Content[]) => {
        expect(contents).toBeDefined();
        done();
      },
      (err) => {
        fail(`get skill tree failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  // MODULE
  it("get all modules", async (done: DoneFn) => {
    service.getModuleAll().subscribe(
      (modules: ContentModule[]) => {
        expect(modules).toBeDefined();
        done();
      },
      (err) => {
        fail(`get all modules failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  it("get specific module", async (done: DoneFn) => {
    const id = 1;
    service.getModule(id).subscribe(
      (module: ContentModule) => {
        expect(module).toBeDefined();
        done();
      },
      (err) => {
        fail(`get module with ${id} failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  it("delete module", async (done: DoneFn) => {
    const id = 1;
    service.deleteModule(id).subscribe(
      (result: boolean) => {
        expect(result).toBe(true);
        done();
      },
      (err) => {
        fail(`delete module failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  it("create module", async (done: DoneFn) => {
    const module = new ContentModule();
    module.module_name = "test";
    module.module_description = "Test description";
    module.module_content_modules = [];
    service.getContent(1).subscribe(
      (content: Content) => {
        expect(content).toBeDefined();
        if (content) {
          module.module_content_modules.push(content);
        }
        service.createModule(module).subscribe(
          (result: boolean) => {
            expect(result).toBe(true);
            done();
          },
          (err) => {
            fail(`create module failed: ${err.status} - ${err.statusText}`);
            done();
          }
        );
      },
      (err) => {
        fail(`content not found: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  it("save module", async (done: DoneFn) => {
    const module = new ContentModule();
    module.module_name = "test";
    module.module_description = "Test description";
    module.module_content_modules = [];
    service.getContent(1).subscribe(
      (content: Content) => {
        expect(content).toBeDefined();
        if (content) {
          module.module_content_modules.push(content);
        }
        service.saveModule(module).subscribe(
          (result: boolean) => {
            expect(result).toBe(true);
            done();
          },
          (err) => {
            fail(`save module failed: ${err.status} - ${err.statusText}`);
            done();
          }
        );
      },
      (err) => {
        fail(`content not found: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  // WIKI DATA OBJECTS
  it("get all wiki data objects", async (done: DoneFn) => {
    service.getWikidataAll().subscribe(
      (wikiDataObjs: WikidataObject[]) => {
        expect(wikiDataObjs).toBeDefined();
        done();
      },
      (err) => {
        fail(
          `get all wiki data objects failed: ${err.status} - ${err.statusText}`
        );
        done();
      }
    );
  });

  it("get specific wiki data obj", async (done: DoneFn) => {
    const id = 1;
    service.getWikiData(id).subscribe(
      (wikiObj: WikidataObject) => {
        expect(wikiObj).toBeDefined();
        done();
      },
      (err) => {
        fail(
          `get wiki data object with ${id} failed: ${err.status} - ${err.statusText}`
        );
        done();
      }
    );
  });

  // GRAPH
  it("get complete graph", async (done: DoneFn) => {
    service.getCompleteGraphData().subscribe(
      (graphData: SkillGraphData) => {
        expect(graphData).toBeDefined();
        done();
      },
      (err) => {
        fail(`get complete grapj failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  it("get levels", async (done: DoneFn) => {
    const reqSkills = [1, 2];
    const newSkills = [3, 4];
    service.getLevels(reqSkills, newSkills).subscribe(
      (levels: Array<Array<BaseNode>>) => {
        expect(levels).toBeDefined();
        done();
      },
      (err) => {
        fail(`get graph levels failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  it("get skill graph", async (done: DoneFn) => {
    const reqSkills = [1, 2];
    const newSkills = [3, 4];
    service.getSkillGraphContent(reqSkills, newSkills).subscribe(
      (skillGraphData: SkillContent) => {
        expect(skillGraphData).toBeDefined();
        done();
      },
      (err) => {
        fail(`get skill graph failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  // GRAPH Configurations
  it("get all configurations", async (done: DoneFn) => {
    service.getAllConfigurations().subscribe(
      (configs: BaseGraphConfiguration[]) => {
        expect(configs).toBeDefined();
        done();
      },
      (err) => {
        fail(
          `get all graph configurations failed: ${err.status} - ${err.statusText}`
        );
        done();
      }
    );
  });

  it("get specific config", async (done: DoneFn) => {
    const loadConfig = new BaseGraphConfiguration();
    loadConfig.id = 1;
    loadConfig.title = `TitleToLoad${loadConfig.id}`;
    service.loadConfig(loadConfig).subscribe(
      (config: GraphConfiguration) => {
        expect(config).toBeDefined();
        done();
      },
      (err) => {
        fail(
          `get graph config with ${loadConfig.id} failed: ${err.status} - ${err.statusText}`
        );
        done();
      }
    );
  });

  it("delete config", async (done: DoneFn) => {
    const id = 1;
    service.deleteConfiguration(id).subscribe(
      (result: boolean) => {
        expect(result).toBe(true);
        done();
      },
      (err) => {
        fail(`delete graph config failed: ${err.status} - ${err.statusText}`);
        done();
      }
    );
  });

  it("save config", async (done: DoneFn) => {
    const config = new GraphConfiguration();
    config.title = "test";
    service.saveConfiguration(config).subscribe(
      (result: boolean) => {
        expect(result).toBe(true);
        done();
      },
      (err) => {
        fail(
          `save graph configuration failed: ${err.status} - ${err.statusText}`
        );
        done();
      }
    );
  });
});
