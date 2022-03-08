import { Injectable } from '@angular/core';
import { backspaceSelection, clearSelection, placeLetter, removeLetters } from '@app/actions/board.actions';
import { addLettersToEasel, placeWord, removeLetterFromEasel } from '@app/actions/player.actions';
import { BoardSelection, Orientation } from '@app/classes/board-selection';
import { BoardState } from '@app/reducers/board.reducer';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Players } from '@app/reducers/player.reducer';
import { Store } from '@ngrx/store';
import { Letter, lettersToString, stringToLetter } from 'common/classes/letter';
import { iVec2, Vec2 } from 'common/classes/vec2';
import { ASCII_ALPHABET_POSITION } from 'common/constants';
import { PlayerService } from './player.service';

@Injectable({
    providedIn: 'root',
})
export class KeyManagerService {
    constructor(private store: Store<{ board: BoardState; gameStatus: GameStatus; players: Players }>, private playerService: PlayerService) {}

    onEnter(): void {
        let selection: BoardSelection = new BoardSelection();
        const placedLetters: Letter[] = [];
        let letters: Letter[] = [];
        this.store.select('board').subscribe((state) => {
            selection = state.selection;
            letters = selection.modifiedCells.map((pos) => state.board[pos.x][pos.y] as Letter);
        });
        letters.forEach((l) => placedLetters.push(l));
        this.store.dispatch(addLettersToEasel({ letters }));
        this.store.dispatch(removeLetters({ positions: selection.modifiedCells }));

        const encodedPosition = `${String.fromCharCode(selection.modifiedCells[0].y + ASCII_ALPHABET_POSITION)}${selection.modifiedCells[0].x + 1}${
            selection.orientation === Orientation.Horizontal ? 'h' : 'v'
        }`;

        this.store.dispatch(placeWord({ position: encodedPosition, letters: lettersToString(placedLetters).toLowerCase() }));
        this.store.dispatch(clearSelection());
    }

    onEsc(): void {
        let letters: Letter[] = [];
        let modifiedCells: iVec2[] = [];
        this.store.select('board').subscribe((state) => {
            modifiedCells = state.selection.modifiedCells;
            letters = state.selection.modifiedCells.map((pos) => state.board[pos.x][pos.y] as Letter);
        });
        this.store.dispatch(addLettersToEasel({ letters }));
        this.store.dispatch(removeLetters({ positions: modifiedCells }));
        this.store.dispatch(clearSelection());
    }

    onBackspace(): void {
        let letter: Letter = '*';
        let lastCell: Vec2 | null = null;
        this.store.select('board').subscribe((state) => {
            if (state.selection.modifiedCells.length === 0) return;
            lastCell = state.selection.modifiedCells[state.selection.modifiedCells.length - 1] as Vec2;
            letter = state.board[lastCell.x][lastCell.y] as Letter;
        });
        if (!lastCell) return;

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

        const letter = stringToLetter(key);
        if (this.playerService.getEasel().findIndex((l) => l === letter) < 0) return;
        this.store.dispatch(placeLetter({ letter }));
        this.store.dispatch(removeLetterFromEasel({ letter }));
    }
}
