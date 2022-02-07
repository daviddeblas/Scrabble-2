import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BoardComponent } from '@app/components/board/board.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import * as boardReducer from '@app/reducers/board.reducer';
import * as gameReducer from '@app/reducers/game-status.reducer';
import * as playerReducer from '@app/reducers/player.reducer';
import { StoreModule } from '@ngrx/store';

@NgModule({
    declarations: [GamePageComponent, BoardComponent],
    imports: [
        AppMaterialModule,
        CommonModule,
        StoreModule.forFeature(gameReducer.gameStatusFeatureKey, gameReducer.reducer),
        StoreModule.forFeature(boardReducer.boardFeatureKey, boardReducer.reducer),
        StoreModule.forFeature(playerReducer.playerFeatureKey, playerReducer.reducer),
    ],
})
export class GamePageModule {}
