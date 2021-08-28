// Angular Modules
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

// Angular Material Modules
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatListModule } from "@angular/material/list";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialogModule } from "@angular/material/dialog";

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
import { ErrorInterceptorService } from "./services/error-interceptor.service";
import { MyErrorModule, MyErrorHandler } from "./helper/errorHandler";
import { EditContentComponent } from "./edit-content/edit-content.component";
import { BaseDialogComponent } from "./base-dialog/base-dialog.component";
import { EditSkillComponent } from "./edit-skill/edit-skill.component";
import { EditModuleComponent } from "./edit-module/edit-module.component";
import { SkillGraphTemplateComponent } from "./skill-graph-template/skill-graph-template.component";

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
    EditContentComponent,
    BaseDialogComponent,
    EditSkillComponent,
    EditModuleComponent,
    SkillGraphTemplateComponent,
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
    MatTableModule,
    MatSnackBarModule,
    MyErrorModule,
    MatSortModule,
    MatExpansionModule,
    MatListModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDialogModule,
  ],
  providers: [
    UserService,
    HttpService,
    CookieService,
    MyErrorHandler,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
