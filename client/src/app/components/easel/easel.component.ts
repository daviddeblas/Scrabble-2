import { Component } from '@angular/core';
import { exchangeLetters } from '@app/actions/player.actions';
import { Letter } from '@app/classes/letter';
import { MAX_EASEL_SIZE } from '@app/constants';
import { BoardState } from '@app/reducers/board.reducer';
import { GameStatus } from '@app/reducers/game-status.reducer';
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

    constructor(private store: Store<{ board: BoardState; players: Players; gameStatus: GameStatus }>) {
        this.pointsPerLetter$ = store.select('board', 'pointsPerLetter');
        this.players$ = store.select('players');
        this.letterColor = new Array(this.maxEaselSize).fill(this.mainColor);
    }

    selectLetterToSwitch(event: MouseEvent, letterIndex: number): void {
        event.preventDefault();
        const color = this.letterColor[letterIndex];
        if (color === this.exchangeColor) {
            this.letterColor[letterIndex] = this.mainColor;
        } else {
            this.letterColor[letterIndex] = this.exchangeColor;
        }
    }

    disableExchange(): boolean {
        const minLettersForExchange = 7;
        let activePlayer;
        let playerUsername;
        let lettersInPot = 0;
        this.store.select('gameStatus').subscribe((status) => {
            activePlayer = status.activePlayer;
            lettersInPot = status.letterPotLength;
        });
        this.store.select('players').subscribe((players) => {
            playerUsername = players.player.name;
        });
        return !(activePlayer === playerUsername && minLettersForExchange <= lettersInPot);
    }

    letterSelected(): boolean {
        return this.letterColor.includes(this.exchangeColor);
    }
    exchangeLetters(): void {
        let playerEasel: Letter[] = [];
        this.store.select('players').subscribe((players) => {
            playerEasel = players.player.easel;
        });
        let lettersToExchange = '';
        for (let index = 0; index < playerEasel.length; index++) {
            if (this.letterColor[index] === this.exchangeColor) {
                lettersToExchange += playerEasel[index].toLowerCase();
            }
        }
        this.store.dispatch(exchangeLetters({ letters: lettersToExchange }));
        this.cancelSelection();
    }

    cancelSelection(): void {
        this.letterColor.forEach((color, index) => {
            if (color === this.exchangeColor) this.letterColor[index] = this.mainColor;
        });
    }
}
