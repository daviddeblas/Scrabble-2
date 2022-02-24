import { Component, HostListener } from '@angular/core';
import { exchangeLetters, switchLettersEasel } from '@app/actions/player.actions';
import { Letter } from '@app/classes/letter';
import { MAX_EASEL_SIZE, POSITION_LAST_CHAR } from '@app/constants';
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
    readonly manipulationNotInArray = POSITION_LAST_CHAR;
    readonly mainColor = '#fffcec';
    readonly exchangeColor = 'red';
    readonly manipulationColor = 'url(#rainbowGradient)';
    easelSize: number;
    pointsPerLetter$: Observable<Map<Letter, number>>;
    players$: Observable<Players>;
    letterColor: string[];
    playerIsActive: boolean = false;

    constructor(private store: Store<{ board: BoardState; players: Players; gameStatus: GameStatus }>) {
        this.pointsPerLetter$ = store.select('board', 'pointsPerLetter');
        this.players$ = store.select('players');
        this.players$.subscribe((players) => {
            this.easelSize = players.player.easel.length;
        });
        this.letterColor = new Array(MAX_EASEL_SIZE).fill(this.mainColor);
    }

    @HostListener('keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.key === 'ArrowRight') {
            this.handlePositionSwitch(true);
        } else if (event.key === 'ArrowLeft') {
            this.handlePositionSwitch(false);
        }
    }

    handlePositionSwitch(moveRight: boolean) {
        const manipulatedLetterIndex = this.letterColor.indexOf(this.manipulationColor);
        if (manipulatedLetterIndex === this.manipulationNotInArray) return;
        let nextPosition;
        if (moveRight) nextPosition = manipulatedLetterIndex === this.easelSize - 1 ? 0 : manipulatedLetterIndex + 1;
        else nextPosition = manipulatedLetterIndex === 0 ? this.easelSize - 1 : manipulatedLetterIndex - 1;
        this.store.dispatch(switchLettersEasel({ positionIndex: manipulatedLetterIndex, destinationIndex: nextPosition }));
        this.switchColorPosition(manipulatedLetterIndex, nextPosition);
    }

    switchColorPosition(positionIndex: number, destinationIndex: number) {
        const tempColor = this.letterColor[positionIndex];
        this.letterColor[positionIndex] = this.letterColor[destinationIndex];
        this.letterColor[destinationIndex] = tempColor;
    }

    cancelSelection(): void {
        this.cancelExchangeSelection();
        this.cancelManipulationSelection();
    }

    gameIsEnded(): boolean {
        let gameEnded;
        this.store.select('gameStatus').subscribe((status) => {
            gameEnded = status.gameEnded;
        });
        if (gameEnded) {
            this.cancelSelection();
            return true;
        }
        return false;
    }

    selectLetterToSwitch(event: MouseEvent, letterIndex: number): void {
        event.preventDefault();
        if (this.gameIsEnded()) return;
        const color = this.letterColor[letterIndex];
        if (color === this.exchangeColor) {
            this.letterColor[letterIndex] = this.mainColor;
        } else {
            this.letterColor[letterIndex] = this.exchangeColor;
            this.cancelManipulationSelection();
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
        let gameEnded;
        this.store.select('gameStatus').subscribe((status) => {
            gameEnded = status.gameEnded;
        });
        return !(activePlayer === playerUsername && minLettersForExchange <= lettersInPot && !gameEnded);
    }

    exchangeLetterSelected(): boolean {
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
        this.cancelExchangeSelection();
    }

    cancelExchangeSelection(): void {
        this.letterColor.forEach((color, index) => {
            if (color === this.exchangeColor) this.letterColor[index] = this.mainColor;
        });
    }

    cancelManipulationSelection(): void {
        const indexManipulationLetter = this.letterColor.indexOf(this.manipulationColor);
        if (indexManipulationLetter !== this.manipulationNotInArray) this.letterColor[indexManipulationLetter] = this.mainColor;
    }

    selectLetterForManipulation(letterIndex: number): void {
        if (this.gameIsEnded()) return;
        this.cancelSelection();
        this.letterColor[letterIndex] = this.manipulationColor;
    }
}
