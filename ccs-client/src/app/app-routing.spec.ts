import { Location } from "@angular/common";
import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { routes } from "./app-routing.module";
import { CompleteGraphComponent } from "./complete-graph/complete-graph.component";
import { ContactComponent } from "./contact/contact.component";
import { ContentComponent } from "./content/content.component";
import { EditContentComponent } from "./edit-content/edit-content.component";
import { EditModuleComponent } from "./edit-module/edit-module.component";
import { EditSkillComponent } from "./edit-skill/edit-skill.component";
import { ImprintComponent } from "./imprint/imprint.component";
import { LoginComponent } from "./login/login.component";
import { ModuleComponent } from "./module/module.component";
import { PrivacyComponent } from "./privacy/privacy.component";
import { CanActivateService } from "./services/can-activate.service";
import { SkillDependencyComponent } from "./skill-dependency/skill-dependency.component";
import { SkillDetailComponent } from "./skill-detail/skill-detail.component";
import { SkillGraphComponent } from "./skill-graph/skill-graph.component";
import { SkillComponent } from "./skill/skill.component";
import { StartComponent } from "./start/start.component";
import { AppComponent } from "./app.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { UserService } from "./services/user.service";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CookieInfoSheetComponent } from "./cookie-info-sheet/cookie-info-sheet.component";

describe("Router: App", () => {
  let location: Location;
  let router: Router;
  let fixture;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompleteGraphComponent,
        ContactComponent,
        ContentComponent,
        EditContentComponent,
        EditModuleComponent,
        EditSkillComponent,
        ImprintComponent,
        LoginComponent,
        ModuleComponent,
        PrivacyComponent,
        SkillDependencyComponent,
        SkillDetailComponent,
        SkillGraphComponent,
        SkillComponent,
        StartComponent,
        CookieInfoSheetComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        MatSnackBarModule,
        MatBottomSheetModule,
        BrowserAnimationsModule,
      ],
    });
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    fixture = TestBed.createComponent(AppComponent);
    userService = TestBed.inject(UserService);
    // toggle this to check correct authentication
    userService.loggedIn = true;
    router.initialNavigation();
  });

  it("not defined route redirects you to /start", fakeAsync(() => {
    router.navigate(["/notexisting"]);
    tick();
    expect(location.path()).toBe("/start");
    flush();
  }));

  it("navigate to '' redirects you to /start", fakeAsync(() => {
    router.navigate([""]);
    tick();
    expect(location.path()).toBe("/start");
    flush();
  }));

  it("navigate to 'contact'", fakeAsync(() => {
    router.navigate(["contact"]);
    tick();
    expect(location.path()).toBe("/contact");
    flush();
  }));

  it("navigate to 'imprint'", fakeAsync(() => {
    router.navigate(["imprint"]);
    tick();
    expect(location.path()).toBe("/imprint");
    flush();
  }));

  it("navigate to 'privacy'", fakeAsync(() => {
    router.navigate(["privacy"]);
    tick();
    expect(location.path()).toBe("/privacy");
    flush();
  }));

  it("navigate to 'content'", fakeAsync(() => {
    router.navigate(["content"]);
    tick();
    if (userService.loggedIn) {
      expect(location.path()).toBe("/content");
    } else {
      expect(location.path()).toBe("/");
    }
    flush();
  }));

  it("navigate to 'editcontent' with id", fakeAsync(() => {
    router.navigate(["editcontent", 1]);
    tick();
    if (userService.loggedIn) {
      expect(location.path()).toBe("/editcontent/1");
    } else {
      expect(location.path()).toBe("/");
    }
    flush();
  }));

  it("navigate to 'contentDetail' with id", fakeAsync(() => {
    router.navigate(["content", 1]);
    tick();
    if (userService.loggedIn) {
      expect(location.path()).toBe("/content/1");
    } else {
      expect(location.path()).toBe("/");
    }
    flush();
  }));

  it("navigate to 'skill'", fakeAsync(() => {
    router.navigate(["skill"]);
    tick();
    if (userService.loggedIn) {
      expect(location.path()).toBe("/skill");
    } else {
      expect(location.path()).toBe("/");
    }
    flush();
  }));

  it("navigate to 'editskill' with id", fakeAsync(() => {
    router.navigate(["editskill", 1]);
    tick();
    if (userService.loggedIn) {
      expect(location.path()).toBe("/editskill/1");
    } else {
      expect(location.path()).toBe("/");
    }
    flush();
  }));

  it("navigate to 'skillDetail' with id", fakeAsync(() => {
    router.navigate(["skill", 1]);
    tick();
    if (userService.loggedIn) {
      expect(location.path()).toBe("/skill/1");
    } else {
      expect(location.path()).toBe("/");
    }
    flush();
  }));

  it("navigate to 'module'", fakeAsync(() => {
    router.navigate(["module"]);
    tick();
    if (userService.loggedIn) {
      expect(location.path()).toBe("/module");
    } else {
      expect(location.path()).toBe("/");
    }
    flush();
  }));

  it("navigate to 'editmodule' with id", fakeAsync(() => {
    router.navigate(["editmodule", 1]);
    tick();
    if (userService.loggedIn) {
      expect(location.path()).toBe("/editmodule/1");
    } else {
      expect(location.path()).toBe("/");
    }
    flush();
  }));

  it("navigate to 'moduleDetail' with id", fakeAsync(() => {
    router.navigate(["module", 1]);
    tick();
    if (userService.loggedIn) {
      expect(location.path()).toBe("/module/1");
    } else {
      expect(location.path()).toBe("/");
    }
    flush();
  }));

  it("navigate to 'completegraph'", fakeAsync(() => {
    router.navigate(["completegraph"]);
    tick();
    if (userService.loggedIn) {
      expect(location.path()).toBe("/completegraph");
    } else {
      expect(location.path()).toBe("/");
    }
    flush();
  }));

  it("navigate to 'skillgraph'", fakeAsync(() => {
    router.navigate(["skillgraph"]);
    tick();
    if (userService.loggedIn) {
      expect(location.path()).toBe("/skillgraph");
    } else {
      expect(location.path()).toBe("/");
    }
    flush();
  }));

  it("navigate to 'skilldependency'", fakeAsync(() => {
    router.navigate(["skilldependency"]);
    tick();
    if (userService.loggedIn) {
      expect(location.path()).toBe("/skilldependency");
    } else {
      expect(location.path()).toBe("/");
    }
    flush();
  }));
});
