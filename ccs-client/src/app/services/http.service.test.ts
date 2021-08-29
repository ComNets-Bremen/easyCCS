import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable, of } from "rxjs";
import {
  ContentTestData,
  ModuleTestData,
  SkillTestData,
  WikiDataTestData,
} from "../test/testdata";
import { BaseHttpService } from "../baseService/BaseHttpService";
import { Content, UploadContent } from "../classes/content";
import { ContentModule } from "../classes/contentModule";
import { Skill } from "../classes/skill";
import { DocFile } from "../classes/docFile";
import { SkillGraphDataDemo, GraphDataDemo } from "../test/graph";

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
    SkillTestData.create();
    ContentTestData.create();
    ModuleTestData.create();
    WikiDataTestData.create();
  }

  // CONTENT

  public getContentAll(): Observable<any> {
    return of(ContentTestData.contents);
  }

  public getContent(id: number): Observable<any> {
    return of(ContentTestData.getbyId(id));
  }

  public deleteContent(id: number): Observable<any> {
    return of(ContentTestData.delete(id));
  }

  public createContent(content: Content): Observable<any> {
    return of(ContentTestData.update(content));
  }

  public saveContent(content: Content): Observable<any> {
    return of(ContentTestData.update(content));
  }

  public uploadContent(uploadContent: UploadContent): Observable<any> {
    return of(ContentTestData.upload(uploadContent));
  }

  public removeBinaryContent(
    contentId: number,
    docFile: DocFile
  ): Observable<any> {
    return of(ContentTestData.deleteBinaryContent(contentId, docFile));
  }

  // SKILL

  public getSkillAll(): Observable<any> {
    return of(SkillTestData.skills);
  }

  public getSkill(id: number): Observable<any> {
    return of(SkillTestData.getbyId(id));
  }

  public deleteSkill(id: number): Observable<any> {
    return of(SkillTestData.delete(id));
  }

  public saveSkill(skill: Skill): Observable<any> {
    return of(SkillTestData.update(skill));
  }
  public createSkill(skill: Skill): Observable<any> {
    return of(SkillTestData.update(skill));
  }

  // MODULE

  public getModuleAll(): Observable<any> {
    return of(ModuleTestData.modules);
  }
  public getModule(id: number): Observable<any> {
    return of(ModuleTestData.getbyId(id));
  }
  public deleteModule(id: number): Observable<any> {
    return of(ModuleTestData.delete(id));
  }
  public saveModule(module: ContentModule): Observable<any> {
    return of(ModuleTestData.update(module));
  }
  public createModule(module: ContentModule): Observable<any> {
    return of(ModuleTestData.update(module));
  }

  // WIKI DATA OBJECTS

  public getWikidataAll(): Observable<any> {
    return of(WikiDataTestData.wikidataObjs);
  }

  public getWikiData(id: number): Observable<any> {
    return of(WikiDataTestData.getbyId(id));
  }

  // GRAPH

  public getLevels(reqSkills: number[], newSkills: number[]): Observable<any> {
    return of(SkillGraphDataDemo.levels);
  }
  public getCompleteGraphData(): Observable<any> {
    return of(GraphDataDemo.demo);
  }

  // default http requests
  protected postRequest(nodeUrl: string, body: any): Observable<any> {
    const headers = new HttpHeaders(); // .set("django_language", cookie);
    return this.http.post(nodeUrl, body, {
      headers,
    });
  }

  protected getRequest(nodeUrl: string): Observable<any> {
    const headers = new HttpHeaders(); // .set("django_language", cookie);
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
