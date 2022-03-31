import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewGamePageComponent } from "./pages/new-game-page/new-game-page.component";
import { MainPageComponent } from "./pages/main-page/main-page.component";
import { GamePageComponent } from "./pages/game-page/game-page.component";

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'room/new', component: NewGamePageComponent},
  {path: 'room/:roomId', component: GamePageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
