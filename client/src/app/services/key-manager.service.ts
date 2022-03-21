import { Injectable } from '@angular/core';
import { backspaceSelection, clearSelection, placeLetter, removeLetters } from '@app/actions/board.actions';
import { addLettersToEasel, placeWord, removeLetterFromEasel } from '@app/actions/player.actions';
import { Direction } from '@app/enums/direction';
import { BoardState, isCellAtBoardLimit } from '@app/reducers/board.reducer';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Players } from '@app/reducers/player.reducer';
import { Store } from '@ngrx/store';
import { BLANK_LETTER, Letter, lettersToString, stringToLetter } from 'common/classes/letter';
import { iVec2, Vec2 } from 'common/classes/vec2';
import { ASCII_ALPHABET_POSITION } from 'common/constants';
import { PlayerService } from './player.service';

@Injectable({
    providedIn: 'root',
})
export class KeyManagerService {
    constructor(private store: Store<{ board: BoardState; gameStatus: GameStatus; players: Players }>, private playerService: PlayerService) {}

    onEnter(): void {
        let modifiedCells: Vec2[] = [];
        let orientation: Direction | null = null;
        const placedLetters: Letter[] = [];
        let blanks: iVec2[] = [];
        let board: (Letter | null)[][] = [];
        this.store.select('board').subscribe((state) => {
            modifiedCells = state.selection.modifiedCells;
            orientation = state.selection.orientation;
            blanks = state.blanks;
            board = state.board;
        });
        if (modifiedCells.length === 0) return;

        const letters = modifiedCells.map((pos) => board[pos.x][pos.y] as Letter);
        letters.forEach((l) => placedLetters.push(l));

        if (blanks.length > 0)
            [...modifiedCells].reverse().forEach((cell, index) => {
                if (cell.equals(blanks[blanks.length - 1])) {
                    letters[letters.length - 1 - index] = BLANK_LETTER;
                }
            });

        this.store.dispatch(addLettersToEasel({ letters: [...letters] }));
        this.store.dispatch(removeLetters({ positions: modifiedCells }));

        if (orientation === null && modifiedCells.length > 1)
            orientation = modifiedCells[0].x === modifiedCells[1].x ? Direction.VERTICAL : Direction.HORIZONTAL;

        const encodedPosition = `${String.fromCharCode(modifiedCells[0].y + ASCII_ALPHABET_POSITION)}${modifiedCells[0].x + 1}${orientation}`;

        let encodedLetters = lettersToString(placedLetters).toLowerCase();

        letters.forEach((letter, index) => {
            if (letter === BLANK_LETTER) {
                encodedLetters =
                    encodedLetters.slice(0, index) +
                    encodedLetters.charAt(index).toUpperCase() +
                    encodedLetters.slice(index + 1, encodedLetters.length);
            }
        });

        this.store.dispatch(placeWord({ position: encodedPosition, letters: encodedLetters }));
        this.store.dispatch(clearSelection());
    }

    onEsc(): void {
        let letters: Letter[] = [];
        let modifiedCells: Vec2[] = [];
        let blanks: iVec2[] = [];
        this.store.select('board').subscribe((state) => {
            modifiedCells = state.selection.modifiedCells;
            letters = state.selection.modifiedCells.map((pos) => state.board[pos.x][pos.y] as Letter);
            blanks = state.blanks;
        });
        if (blanks.length > 0)
            modifiedCells.reverse().forEach((cell, index) => {
                if (cell.equals(blanks[blanks.length - 1])) letters[letters.length - 1 - index] = BLANK_LETTER;
            });
        this.store.dispatch(addLettersToEasel({ letters }));
        this.store.dispatch(removeLetters({ positions: modifiedCells }));
        this.store.dispatch(clearSelection());
    }

    onBackspace(): void {
        let letter: Letter = '*';
        let lastCell: Vec2 | null = null;
        let blanks: iVec2[] = [];
        this.store.select('board').subscribe((state) => {
            if (state.selection.modifiedCells.length === 0) return;
            lastCell = state.selection.modifiedCells[state.selection.modifiedCells.length - 1] as Vec2;
            letter = state.board[lastCell.x][lastCell.y] as Letter;
            blanks = state.blanks;
        });

        if (!lastCell) return;
        if (blanks.length > 0 && (lastCell as Vec2).equals(blanks[blanks.length - 1])) letter = BLANK_LETTER;

        this.store.dispatch(addLettersToEasel({ letters: [letter] }));
        this.store.dispatch(backspaceSelection());
    }

    onKey(key: string): void {
        if (document.activeElement !== null && document.activeElement.nodeName !== 'BODY') return;

        let selectedCell: Vec2 | null = null;
        this.store.select('board').subscribe((state) => {
            selectedCell = state.selection.cell;
        });
        if (!selectedCell) return;

        switch (key) {
            case 'Enter':
                this.onEnter();
                return;
            case 'Escape':
                this.onEsc();
                return;
            case 'Backspace':
                this.onBackspace();
                return;
            default:
        }

        if (key.length !== 1) return;

        // Verifie s'il possible de placer d'autre lettre sur le plateau
        let board: (Letter | null)[][] = [];
        let orientation: Direction | null = null;
        selectedCell = selectedCell as Vec2;
        this.store.select('board').subscribe((state) => {
            board = state.board;
            orientation = state.selection.orientation;
        });
        if (isCellAtBoardLimit(board, selectedCell, orientation as unknown as Direction) && board[selectedCell.x][selectedCell.y] !== null) return;

        key = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const letter = stringToLetter(key);
        if (this.playerService.getEasel().findIndex((l) => l === letter) < 0) return;
        this.store.dispatch(placeLetter({ letter: stringToLetter(key.toLowerCase()), isBlank: letter === '*' }));
        this.store.dispatch(removeLetterFromEasel({ letter }));
    }
}
