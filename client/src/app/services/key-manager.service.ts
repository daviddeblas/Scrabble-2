import { Injectable } from '@angular/core';
import { placeLetter } from '@app/actions/board.actions';
import { placeWord, removeLetterFromEasel } from '@app/actions/player.actions';
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

    onKey(key: string): void {
        if (document.activeElement !== null && document.activeElement.nodeName !== 'BODY') return;
        try {
            if (key === 'Enter') {
                let selection: BoardSelection = new BoardSelection();
                const placedLetters: Letter[] = [];
                this.store.select('board').subscribe((state) => {
                    selection = state.selection;
                    selection.modifiedCells.forEach((pos) => placedLetters.push(state.board[pos.x][pos.y] as Letter));
                });

                const encodedPostion = `${String.fromCharCode(selection.modifiedCells[0].y + ASCII_ALPHABET_POSITION)}${
                    selection.modifiedCells[0].x + 1
                }${selection.orientation === Orientation.Horizontal ? 'h' : 'v'}`;

                this.store.dispatch(placeWord({ position: encodedPostion, letters: lettersToString(placedLetters).toLowerCase() }));
            }

            const letter = stringToLetter(key);
            if (this.playerService.lettersInEasel(key.toUpperCase())) return;
            this.store.dispatch(placeLetter({ letter }));
            this.store.dispatch(removeLetterFromEasel({ letter }));
            // eslint-disable-next-line no-empty
        } catch (error: unknown) {}
    }
}
