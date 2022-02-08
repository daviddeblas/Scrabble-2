import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import * as dictionariesReducer from '@app/reducers/dictionaries.reducer';
import * as gameReducer from '@app/reducers/game-status.reducer';
import * as roomReducer from '@app/reducers/room.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MultiConfigWindowComponent } from './components/multi-config-window/multi-config-window.component';
import { WaitingRoomComponent } from './components/waiting-room/waiting-room.component';
import { DictionariesEffects } from './effects/dictionaries.effects';
import { GameEffects } from './effects/game.effects';
import { RoomEffects } from './effects/room.effects';
import { GamePageModule } from './modules/game-page.module';
import { GameJoinPageComponent } from './pages/game-join-page/game-join-page.component';
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
        MainPageComponent,
        MaterialPageComponent,
        GameSelectionPageComponent,
        MultiConfigWindowComponent,
        GamePreparationPageComponent,
        WaitingRoomComponent,
        GameJoinPageComponent,
    ],
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        StoreModule.forRoot({
            dictionaries: dictionariesReducer.reducer,
            room: roomReducer.reducer,
            game: gameReducer.reducer,
        }),
        EffectsModule.forRoot([DictionariesEffects, RoomEffects, GameEffects]),
        StoreDevtoolsModule.instrument({}),
        GamePageModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
