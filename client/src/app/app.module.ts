import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatBoxComponent } from '@app/components/chat-box/chat-box.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MultiConfigWindowComponent } from './components/multi-config-window/multi-config-window.component';
import { WaitingRoomComponent } from './components/waiting-room/waiting-room.component';
import { ChatEffects } from './effects/chat.effects';
import { GamePreparationPageComponent } from './pages/game-preparation-page/game-preparation-page.component';
import { GameSelectionPageComponent } from './pages/game-selection-page/game-selection-page.component';
import * as chatReducer from './reducer/chat.reducer';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        StoreModule.forRoot({ chat: chatReducer.reducer }),
        StoreDevtoolsModule.instrument({}),
        EffectsModule.forRoot([ChatEffects]),
    ],
    declarations: [
        AppComponent,
        GamePageComponent,
        MainPageComponent,
        MaterialPageComponent,
        PlayAreaComponent,
        SidebarComponent,
        GameSelectionPageComponent,
        MultiConfigWindowComponent,
        GamePreparationPageComponent,
        WaitingRoomComponent,
        ChatBoxComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
