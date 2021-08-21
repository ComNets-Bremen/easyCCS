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
    const url = this.baseApi + "content/" + id + this.end;
    return this.deleteAuthRequest(url);
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
    const url = this.baseApi + "skill/" + id + this.end;
    return this.deleteAuthRequest(url);
  }

  public saveSkill(skill: Skill): Observable<any> {
    throw new Error("Method not implemented.");
  }
  public createSkill(skill: Skill): Observable<any> {
    throw new Error("Method not implemented.");
  }

  // MODULE

  public getModuleAll(): Observable<any> {
    throw new Error("Method not implemented.");
  }
  public getModule(id: number): Observable<any> {
    throw new Error("Method not implemented.");
  }
  public deleteModule(id: number): Observable<any> {
    throw new Error("Method not implemented.");
  }
  public saveModule(module: ContentModule): Observable<any> {
    throw new Error("Method not implemented.");
  }
  public createModule(module: ContentModule): Observable<any> {
    throw new Error("Method not implemented.");
  }

  // WIKI DATA OBJECTS

  public getWikidataAll(): Observable<any> {
    return of(WikiDataTestData.wikidataObjs);
  }

  public getWikiData(id: number): Observable<any> {
    return of(WikiDataTestData.getbyId(id));
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
