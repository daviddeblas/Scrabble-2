import { Injectable } from '@angular/core';
import { placeLetter } from '@app/actions/board.actions';
import { removeLetterFromEasel } from '@app/actions/player.actions';
import { stringToLetter } from '@app/classes/letter';
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
            const letter = stringToLetter(key);
            if (this.playerService.lettersInEasel(key.toUpperCase())) return;
            this.store.dispatch(placeLetter({ letter }));
            this.store.dispatch(removeLetterFromEasel({ letter }));
            // eslint-disable-next-line no-empty
        } catch (error: unknown) {}
    }
}
