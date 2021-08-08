import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CompleteGraphComponent } from "./complete-graph/complete-graph.component";
import { ContentComponent } from "./content/content.component";
import { ImprintComponent } from "./imprint/imprint.component";
import { LoginComponent } from "./login/login.component";
import { ModuleComponent } from "./module/module.component";
import { PrivacyComponent } from "./privacy/privacy.component";
import { SkillDependencyComponent } from "./skill-dependency/skill-dependency.component";
import { SkillGraphComponent } from "./skill-graph/skill-graph.component";
import { SkillComponent } from "./skill/skill.component";
import { StartComponent } from "./start/start.component";

const routes: Routes = [
  { path: "start", component: StartComponent },
  { path: "login", component: LoginComponent },
  { path: "completegraph", component: CompleteGraphComponent },
  { path: "skillgraph", component: SkillGraphComponent },
  { path: "skilldependency", component: SkillDependencyComponent },
  { path: "content", component: ContentComponent },
  { path: "skill", component: SkillComponent },
  { path: "module", component: ModuleComponent },
  { path: "imprint", component: ImprintComponent },
  { path: "privacy", component: PrivacyComponent },
  { path: "**", component: StartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
