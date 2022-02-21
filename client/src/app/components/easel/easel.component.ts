import { Component } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { MAX_EASEL_SIZE } from '@app/constants';
import { BoardState } from '@app/reducers/board.reducer';
import { Players } from '@app/reducers/player.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-easel',
    templateUrl: './easel.component.html',
    styleUrls: ['./easel.component.scss'],
})
export class EaselComponent {
    readonly mainColor = '#fffcec';
    readonly exchangeColor = 'red';
    readonly maxEaselSize = MAX_EASEL_SIZE;
    pointsPerLetter$: Observable<Map<Letter, number>>;
    players$: Observable<Players>;
    letterColor: string[];
    playerIsActive: boolean = false;

    constructor(store: Store<{ board: BoardState; players: Players }>) {
        this.pointsPerLetter$ = store.select('board', 'pointsPerLetter');
        this.players$ = store.select('players');
        this.letterColor = new Array(this.maxEaselSize).fill(this.mainColor);
    }

    selectLetterToSwitch(event: MouseEvent, letterIndex: number): void {
        event.preventDefault();
        const color = this.letterColor[letterIndex];
        if (color === this.exchangeColor) {
            this.letterColor[letterIndex] = this.mainColor;
        } else if (color === this.mainColor) {
            this.letterColor[letterIndex] = this.exchangeColor;
        }
    }

    letterSelected(): boolean {
        return this.letterColor.includes(this.exchangeColor);
    }
}
