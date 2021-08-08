// Angular Modules
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

// Angular Material Modules
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

// general packages
import { CookieService } from "ngx-cookie-service";

// Components
import { AppComponent } from "./app.component";
import { StartComponent } from "./start/start.component";
import { LoginComponent } from "./login/login.component";
import { UserService } from "./services/user.service";
import { HttpService } from "./services/http.service";
import { ContentComponent } from "./content/content.component";
import { SkillComponent } from "./skill/skill.component";
import { ModuleComponent } from "./module/module.component";
import { CompleteGraphComponent } from "./complete-graph/complete-graph.component";
import { SkillGraphComponent } from "./skill-graph/skill-graph.component";
import { SkillDependencyComponent } from "./skill-dependency/skill-dependency.component";
import { ImprintComponent } from "./imprint/imprint.component";
import { PrivacyComponent } from "./privacy/privacy.component";

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    LoginComponent,
    ContentComponent,
    SkillComponent,
    ModuleComponent,
    CompleteGraphComponent,
    SkillGraphComponent,
    SkillDependencyComponent,
    ImprintComponent,
    PrivacyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
  ],
  providers: [UserService, HttpService, CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
