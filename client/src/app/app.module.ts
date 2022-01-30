import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { ConfirmSurrenderComponent } from './components/confirm-surrender/confirm-surrender.component';
import { MultiConfigWindowComponent } from './components/multi-config-window/multi-config-window.component';
import { SurrenderGameComponent } from './components/surrender-game/surrender-game.component';
import { WaitingRoomComponent } from './components/waiting-room/waiting-room.component';
import { GamePreparationPageComponent } from './pages/game-preparation-page/game-preparation-page.component';
import { GameSelectionPageComponent } from './pages/game-selection-page/game-selection-page.component';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    declarations: [
        AppComponent,
        GamePageComponent,
        MainPageComponent,
        MaterialPageComponent,
        PlayAreaComponent,
        SidebarComponent,
        SurrenderGameComponent,
        ConfirmSurrenderComponent,
        GameSelectionPageComponent,
        MultiConfigWindowComponent,
        GamePreparationPageComponent,
        WaitingRoomComponent,
    ],
    imports: [AppMaterialModule, AppRoutingModule, BrowserAnimationsModule, BrowserModule, FormsModule, HttpClientModule, ReactiveFormsModule],
    bootstrap: [AppComponent],
})
export class AppModule {}
