import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewGamePageComponent } from './pages/new-game-page/new-game-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { HttpClientModule } from "@angular/common/http";
import { GamePageComponent } from './pages/game-page/game-page.component';
import { FormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PlayersComponent } from './components/players/players.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { PlayingPageComponent } from './pages/playing-page/playing-page.component';
import { StoryPageComponent } from './pages/story-page/story-page.component';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    AppComponent,
    NewGamePageComponent,
    MainPageComponent,
    GamePageComponent,
    PlayersComponent,
    RegistrationPageComponent,
    PlayingPageComponent,
    StoryPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 5000}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
