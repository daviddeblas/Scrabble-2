import { Component } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Multiplier } from '@app/classes/multiplier';
import { BOARD_SIZE } from '@app/constants';
import { BoardState } from '@app/reducers/board.reducer';
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
    board$: Observable<Letter[][]>;
    pointsPerLetter$: Observable<Map<Letter, number>>;
    multipliers$: Observable<(Multiplier | null)[][]>;

    constructor(store: Store<{ board: BoardState }>) {
        this.board$ = store.select('board', 'board');
        this.pointsPerLetter$ = store.select('board', 'pointsPerLetter');
        this.multipliers$ = store.select('board', 'multipliers');
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
