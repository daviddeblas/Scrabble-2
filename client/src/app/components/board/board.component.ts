import { Component } from '@angular/core';
import { BOARD_SIZE } from '@app/constants';
import { BoardState } from '@app/reducers/board.reducer';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

const LETTER_A = 'A'.charCodeAt(0);

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
    readonly boardSize = BOARD_SIZE;
    gameStatus$: Observable<GameStatus>;
    boardState$: Observable<BoardState>;

    constructor(store: Store<{ gameStatus: GameStatus; boardState: BoardState }>) {
        this.gameStatus$ = store.select('gameStatus');
        this.boardState$ = store.select('boardState');
    }

    numberSequence(n: number): number[] {
        return Array(n)
            .fill(0)
            .map((x, i) => i + 1);
    }

    letterSequence(n: number): string[] {
        return Array(n)
            .fill(0)
            .map((x, i) => String.fromCharCode(LETTER_A + i));
    }
}
