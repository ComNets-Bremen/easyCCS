import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { StartComponent } from "./start/start.component";

const routes: Routes = [
  { path: "start", component: StartComponent },
  { path: "login", component: LoginComponent },
  { path: "**", component: StartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
