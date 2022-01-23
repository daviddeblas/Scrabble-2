import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BoardComponent } from '@app/components/board/board.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import * as boardReducer from '@app/reducers/board.reducer';
import * as gameReducer from '@app/reducers/game.reducer';
import { StoreModule } from '@ngrx/store';

@NgModule({
    declarations: [GamePageComponent, PlayAreaComponent, SidebarComponent, BoardComponent],
    imports: [
        CommonModule,
        StoreModule.forFeature(gameReducer.gameFeatureKey, gameReducer.reducer),
        StoreModule.forFeature(boardReducer.boardFeatureKey, boardReducer.reducer),
    ],
})
export class GamePageModule {}
