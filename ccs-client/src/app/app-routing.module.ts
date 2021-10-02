import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
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

export const routes: Routes = [
  { path: "start", component: StartComponent },
  { path: "login", component: LoginComponent },
  {
    path: "completegraph",
    component: CompleteGraphComponent,
    canActivate: [CanActivateService],
  },
  {
    path: "skillgraph",
    component: SkillGraphComponent,
    canActivate: [CanActivateService],
  },
  {
    path: "skilldependency",
    component: SkillDependencyComponent,
    canActivate: [CanActivateService],
  },
  {
    path: "content",
    component: ContentComponent,
    canActivate: [CanActivateService],
  },
  {
    path: "editcontent/:id",
    component: EditContentComponent,
    canActivate: [CanActivateService],
  },
  {
    path: "editskill/:id",
    component: EditSkillComponent,
    canActivate: [CanActivateService],
  },
  {
    path: "skill/:id",
    component: SkillDetailComponent,
    canActivate: [CanActivateService],
  },
  {
    path: "editmodule/:id",
    component: EditModuleComponent,
    canActivate: [CanActivateService],
  },
  {
    path: "skill",
    component: SkillComponent,
    canActivate: [CanActivateService],
  },
  {
    path: "module",
    component: ModuleComponent,
    canActivate: [CanActivateService],
  },
  { path: "imprint", component: ImprintComponent },
  { path: "privacy", component: PrivacyComponent },
  { path: "contact", component: ContactComponent },
  { path: "**", component: StartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
