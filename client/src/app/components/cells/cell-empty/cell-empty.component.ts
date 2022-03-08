import { Component, Input } from '@angular/core';
import { cellClick } from '@app/actions/board.actions';
import { BoardSelection } from '@app/classes/board-selection';
import { BoardState } from '@app/reducers/board.reducer';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Players } from '@app/reducers/player.reducer';
import { Store } from '@ngrx/store';
import { iVec2 } from 'common/classes/vec2';
import { Observable } from 'rxjs';

@Component({
    /* Nécessaire pour les composantes SVG */
    /* eslint-disable-next-line @angular-eslint/component-selector */
    selector: '[app-cell-empty]',
    templateUrl: './cell-empty.component.html',
    styleUrls: ['./cell-empty.component.scss'],
})
export class CellEmptyComponent {
    @Input() pos: iVec2 = { x: 0, y: 0 };

    selection$: Observable<BoardSelection>;

    constructor(
        public store: Store<{
            board: BoardState;
            players: Players;
            gameStatus: GameStatus;
        }> /* private elementRef: ElementRef*/,
    ) {
        this.selection$ = store.select('board', 'selection');
    }

    click(): void {
        let currentPlayer = '';
        let activePlayer = '';
        let gameEnded = false;
        this.store.select('players').subscribe((state) => {
            currentPlayer = state.player.name;
        });
        this.store.select('gameStatus').subscribe((state) => {
            activePlayer = state.activePlayer;
            gameEnded = state.gameEnded;
        });

        if (gameEnded || currentPlayer !== activePlayer) return;

        this.store.dispatch(cellClick({ pos: this.pos }));
    }
}
