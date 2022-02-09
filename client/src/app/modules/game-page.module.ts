import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BoardComponent } from '@app/components/board/board.component';
import { SurrenderGameButtonComponent } from '@app/components/surrender-game-button/surrender-game-button.component';
import { BrowserEffects } from '@app/effects/browser.effects';
import { PlayerEffects } from '@app/effects/player.effects';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import * as boardReducer from '@app/reducers/board.reducer';
import * as gameReducer from '@app/reducers/game-status.reducer';
import * as playerReducer from '@app/reducers/player.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppMaterialModule } from './material.module';

@NgModule({
    declarations: [GamePageComponent, SurrenderGameButtonComponent, BoardComponent],
    imports: [
        AppMaterialModule,
        CommonModule,
        StoreModule.forFeature(gameReducer.gameStatusFeatureKey, gameReducer.reducer),
        StoreModule.forFeature(boardReducer.boardFeatureKey, boardReducer.reducer),
        StoreModule.forFeature(playerReducer.playerFeatureKey, playerReducer.reducer),
        EffectsModule.forFeature([PlayerEffects, BrowserEffects]),
    ],
})
export class GamePageModule {}
