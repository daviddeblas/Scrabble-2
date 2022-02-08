import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BoardComponent } from '@app/components/board/board.component';
import { ChatBoxComponent } from '@app/components/chat-box/chat-box.component';
import { ChatEffects } from '@app/effects/chat.effects';
import { AppMaterialModule } from '@app/modules/material.module';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import * as boardReducer from '@app/reducers/board.reducer';
import * as chatReducer from '@app/reducers/chat.reducer';
import * as gameReducer from '@app/reducers/game-status.reducer';
import * as playerReducer from '@app/reducers/player.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

@NgModule({
    declarations: [GamePageComponent, BoardComponent, ChatBoxComponent],
    imports: [
        AppMaterialModule,
        CommonModule,
        StoreModule.forFeature(gameReducer.gameStatusFeatureKey, gameReducer.reducer),
        StoreModule.forFeature(boardReducer.boardFeatureKey, boardReducer.reducer),
        StoreModule.forFeature(playerReducer.playerFeatureKey, playerReducer.reducer),
        StoreModule.forFeature(chatReducer.chatFeatureKey, chatReducer.reducer),
        EffectsModule.forFeature([ChatEffects]),
    ],
})
export class GamePageModule {}
