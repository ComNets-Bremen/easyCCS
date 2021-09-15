import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { Content, UploadContent } from "../classes/content";
import { ContentModule } from "../classes/contentModule";
import { DocFile } from "../classes/docFile";
import { Skill } from "../classes/skill";

export abstract class BaseHttpService {
  public token = "";
  public readonly tokenName = "ccsSession";
  protected readonly baseApi = "rest/";
  protected readonly end = "/";

  constructor(
    protected http: HttpClient,
    protected cookieService: CookieService
  ) {}

  // CONTENT

  public abstract getContentAll(): Observable<any>;

  public abstract getContent(id: number): Observable<any>;

  public abstract getSkillGraphContent(
    reqSkillIds: number[],
    newSkillIds: number[]
  ): Observable<any>;

  public abstract deleteContent(id: number): Observable<any>;

  public abstract saveContent(content: Content): Observable<any>;

  public abstract createContent(content: Content): Observable<any>;

  public abstract uploadContent(uploadContent: UploadContent): Observable<any>;

  public abstract removeBinaryContent(
    contentId: number,
    docFile: DocFile
  ): Observable<any>;

  // SKILL

  public abstract getSkillAll(): Observable<any>;

  public abstract getSkill(id: number): Observable<any>;

  public abstract deleteSkill(id: number): Observable<any>;

  public abstract saveSkill(skill: Skill): Observable<any>;

  public abstract createSkill(skill: Skill): Observable<any>;

  // MODULE

  public abstract getModuleAll(): Observable<any>;

  public abstract getModule(id: number): Observable<any>;

  public abstract deleteModule(id: number): Observable<any>;

  public abstract saveModule(module: ContentModule): Observable<any>;

  public abstract createModule(module: ContentModule): Observable<any>;

  // WIKIDATA OBJECTS

  public abstract getWikidataAll(): Observable<any>;

  public abstract getWikiData(id: number): Observable<any>;

  // GRAPH

  public abstract getLevels(
    reqSkills: number[],
    newSkills: number[]
  ): Observable<any>;

  public abstract getCompleteGraphData(): Observable<any>;

  // default http requests
  protected abstract postRequest(nodeUrl: string, body: any): Observable<any>;

  protected abstract getRequest(nodeUrl: string): Observable<any>;

  protected abstract postAuthRequest(
    nodeUrl: string,
    body: any
  ): Observable<any>;

  protected abstract getAuthRequest(nodeUrl: string): Observable<any>;

  protected abstract putAuthRequest(
    nodeUrl: string,
    body: any
  ): Observable<any>;

  protected abstract deleteAuthRequest(nodeUrl: string): Observable<any>;
}
