import { Injectable } from '@angular/core';
import { backspaceSelection, clearSelection, placeLetter, removeLetters } from '@app/actions/board.actions';
import { addLettersToEasel, placeWord, removeLetterFromEasel } from '@app/actions/player.actions';
import { BoardSelection, Orientation } from '@app/classes/board-selection';
import { Letter, lettersToString, stringToLetter } from '@app/classes/letter';
import { ASCII_ALPHABET_POSITION } from '@app/constants';
import { BoardState } from '@app/reducers/board.reducer';
import { Store } from '@ngrx/store';
import { PlayerService } from './player.service';

@Injectable({
    providedIn: 'root',
})
export class KeyManagerService {
    constructor(private store: Store<{ board: BoardState }>, private playerService: PlayerService) {}

    onEnter(): void {
        let selection: BoardSelection = new BoardSelection();
        const placedLetters: Letter[] = [];
        this.store.select('board').subscribe((state) => {
            selection = state.selection;
            const letters = selection.modifiedCells.map((pos) => state.board[pos.x][pos.y] as Letter);
            letters.forEach((l) => placedLetters.push(l));
            this.store.dispatch(addLettersToEasel({ letters }));
            this.store.dispatch(removeLetters({ positions: selection.modifiedCells }));
        });

        const encodedPosition = `${String.fromCharCode(selection.modifiedCells[0].y + ASCII_ALPHABET_POSITION)}${selection.modifiedCells[0].x + 1}${
            selection.orientation === Orientation.Horizontal ? 'h' : 'v'
        }`;

        this.store.dispatch(placeWord({ position: encodedPosition, letters: lettersToString(placedLetters).toLowerCase() }));
        this.store.dispatch(clearSelection());
    }

    onEsc(): void {
        this.store.select('board').subscribe((state) => {
            this.store.dispatch(removeLetters({ positions: state.selection.modifiedCells }));
            const letters = state.selection.modifiedCells.map((pos) => state.board[pos.x][pos.y] as Letter);
            this.store.dispatch(addLettersToEasel({ letters }));
        });
        this.store.dispatch(clearSelection());
    }

    onBackspace(): void {
        this.store.dispatch(backspaceSelection());
    }

    onKey(key: string): void {
        if (document.activeElement !== null && document.activeElement.nodeName !== 'BODY') return;
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
        try {
            const letter = stringToLetter(key);
            if (this.playerService.getEasel().findIndex((l) => l === letter) < 0) return;
            this.store.dispatch(placeLetter({ letter }));
            this.store.dispatch(removeLetterFromEasel({ letter }));
        } catch (_: unknown) {
            // eslint-disable-next-line no-empty
        }
    }
}
