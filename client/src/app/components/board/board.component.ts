import { Component } from '@angular/core';
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
    gameStatus$: Observable<GameStatus>;

    constructor(store: Store<{ gameStatus: GameStatus }>) {
        this.gameStatus$ = store.select('gameStatus');
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
