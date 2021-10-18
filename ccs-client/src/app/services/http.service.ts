import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { BaseHttpService } from "../baseService/BaseHttpService";
import {
  BaseGraphConfiguration,
  GraphConfiguration,
} from "../classes/configuration";
import { ContactFormData, LicenseFormData } from "../classes/contactFormData";
import { Content, UploadContent } from "../classes/content";
import { ContentModule } from "../classes/contentModule";
import { DocFile } from "../classes/docFile";
import { Skill } from "../classes/skill";

@Injectable({
  providedIn: "root",
})
export class HttpService extends BaseHttpService {
  public token = "";

  constructor(
    protected http: HttpClient,
    protected cookieService: CookieService
  ) {
    super(http, cookieService);
    this.baseApi = "http://localhost:8000/" + this.baseApi;
  }

  // AUTHENTICATION AND USER STUFF

  public login(user: string, password: string): Observable<any> {
    const url = this.baseApi + "login" + this.end;
    const body = { username: user, password };
    return this.postAuthRequest(url, body);
  }
  public logout(): Observable<any> {
    const url = this.baseApi + "logout" + this.end;
    return this.getAuthRequest(url);
  }

  public contact(formData: ContactFormData): Observable<any> {
    const url = this.baseApi + "contact" + this.end;
    const body = formData;
    return this.postAuthRequest(url, body);
  }

  public licenseRequest(formData: LicenseFormData): Observable<any> {
    const url = this.baseApi + "license" + this.end;
    const body = formData;
    return this.postAuthRequest(url, body);
  }

  // CONTENT

  public getContentAll(): Observable<any> {
    const url = this.baseApi + "content" + this.end;
    return this.getAuthRequest(url);
  }

  public getContent(id: number): Observable<any> {
    const url = this.baseApi + `content/${id}` + this.end;
    return this.getAuthRequest(url);
  }

  public deleteContent(id: number): Observable<any> {
    const url = this.baseApi + `content/${id}` + this.end;
    return this.deleteAuthRequest(url);
  }

  public saveContent(content: Content): Observable<any> {
    const url = this.baseApi + `content/${content.id}` + this.end;
    const body = content;
    return this.putAuthRequest(url, body);
  }

  public createContent(content: Content): Observable<any> {
    const url = this.baseApi + "content" + this.end;
    const body = content;
    return this.postAuthRequest(url, body);
  }

  public uploadContent(uploadContent: UploadContent): Observable<any> {
    const url = this.baseApi + "uploadcontent" + this.end;
    const body = uploadContent;
    return this.postAuthRequest(url, body);
  }

  public removeBinaryContent(
    contentId: number,
    docFile: DocFile
  ): Observable<any> {
    // TODO TBD
    const url = this.baseApi + "deleteBinaryContent" + this.end;
    const body = docFile;
    return this.postAuthRequest(url, body);
  }

  // SKILLS

  public getSkillAll(): Observable<any> {
    const url = this.baseApi + "skill" + this.end;
    return this.getAuthRequest(url);
  }

  public getSkill(id: number): Observable<any> {
    const url = this.baseApi + `skill/${id}` + this.end;
    return this.getAuthRequest(url);
  }

  public deleteSkill(id: number): Observable<any> {
    const url = this.baseApi + `skill/${id}` + this.end;
    return this.deleteAuthRequest(url);
  }

  public saveSkill(skill: Skill): Observable<any> {
    const url = this.baseApi + `skill/${skill.id}` + this.end;
    const body = skill;
    return this.putAuthRequest(url, body);
  }

  public createSkill(skill: Skill): Observable<any> {
    const url = this.baseApi + "skill" + this.end;
    const body = skill;
    return this.postAuthRequest(url, body);
  }

  public getTree(id: number): Observable<any> {
    const url = this.baseApi + `getTree/${id}` + this.end;
    return this.getAuthRequest(url);
  }

  // MODULE
  public getModuleAll(): Observable<any> {
    const url = this.baseApi + "module" + this.end;
    return this.getAuthRequest(url);
  }

  public getModule(id: number): Observable<any> {
    const url = this.baseApi + `module/${id}` + this.end;
    return this.deleteAuthRequest(url);
  }

  public deleteModule(id: number): Observable<any> {
    const url = this.baseApi + `module/${id}` + this.end;
    return this.deleteAuthRequest(url);
  }

  public saveModule(module: ContentModule): Observable<any> {
    const url = this.baseApi + `module/${module.id}` + this.end;
    const body = module;
    return this.putAuthRequest(url, body);
  }

  public createModule(module: ContentModule): Observable<any> {
    const url = this.baseApi + "module" + this.end;
    const body = module;
    return this.postAuthRequest(url, body);
  }

  // WIKIDATA OBJECTS

  public getWikidataAll(): Observable<any> {
    const url = this.baseApi + "wikidata" + this.end;
    return this.getAuthRequest(url);
  }

  public getWikiData(id: number): Observable<any> {
    const url = this.baseApi + `wikidata/${id}` + this.end;
    return this.getAuthRequest(url);
  }

  // GRAPH

  public getCompleteGraphData(): Observable<any> {
    const url = this.baseApi + "completegraph" + this.end;
    return this.getAuthRequest(url);
  }

  public getLevels(
    reqSkillIds: number[],
    knownSkillIds: number[]
  ): Observable<any> {
    let reqIds = "";
    let knownIds = "";
    for (let i = 0; i < reqSkillIds.length; i++) {
      reqIds += reqSkillIds[i];
      if (i !== reqSkillIds.length - 1) {
        reqIds += ",";
      }
    }
    for (let i = 0; i < knownSkillIds.length; i++) {
      knownIds += knownSkillIds[i];
      if (i !== knownSkillIds.length - 1) {
        knownIds += ",";
      }
    }
    const url =
      this.baseApi +
      `skillgraph/required_skills?id=${reqIds}&known_skills?id=${knownIds}` +
      this.end;
    return this.getAuthRequest(url);
  }

  public getSkillGraphContent(
    reqSkillIds: number[],
    knownSkillIds: number[]
  ): Observable<any> {
    let reqIds = "";
    let knownIds = "";
    for (let i = 0; i < reqSkillIds.length; i++) {
      reqIds += reqSkillIds[i];
      if (i !== reqSkillIds.length - 1) {
        reqIds += ",";
      }
    }
    for (let i = 0; i < knownSkillIds.length; i++) {
      knownIds += knownSkillIds[i];
      if (i !== knownSkillIds.length - 1) {
        knownIds += ",";
      }
    }
    const url =
      this.baseApi +
      `skillGraphContent/required_skills?id=${reqIds}&known_skills?id=${knownIds}` +
      this.end;
    return this.getAuthRequest(url);
  }

  public getAllConfigurations(): Observable<any> {
    const url = this.baseApi + "skillgraph" + this.end;
    return this.getAuthRequest(url);
  }

  public loadConfig(loadConfig: BaseGraphConfiguration): Observable<any> {
    const url = this.baseApi + `skillgraph/${loadConfig.id}` + this.end;
    return this.getAuthRequest(url);
  }

  public saveConfiguration(config: GraphConfiguration): Observable<any> {
    const url = this.baseApi + "skillgraph" + this.end;
    const body = config;
    return this.postAuthRequest(url, body);
  }

  public deleteConfiguration(configId: number): Observable<any> {
    const url = this.baseApi + `skillgraph/${configId}` + this.end;
    return this.deleteAuthRequest(url);
  }

  // default http requests
  protected postRequest(nodeUrl: string, body: any): Observable<any> {
    const headers = new HttpHeaders();
    return this.http.post(nodeUrl, body, {
      headers,
    });
  }

  protected getRequest(nodeUrl: string): Observable<any> {
    const headers = new HttpHeaders();
    return this.http.get(nodeUrl, { headers });
  }

  protected postAuthRequest(nodeUrl: string, body: any): Observable<any> {
    const headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.post(nodeUrl, body, {
      headers,
    });
  }

  protected getAuthRequest(nodeUrl: string): Observable<any> {
    const headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.get(nodeUrl, {
      headers,
    });
  }

  protected putAuthRequest(nodeUrl: string, body: any): Observable<any> {
    const headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.put(nodeUrl, body, {
      headers,
    });
  }

  protected deleteAuthRequest(nodeUrl: string): Observable<any> {
    const headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${this.token}`
    );
    return this.http.delete(nodeUrl, {
      headers,
    });
  }
}
