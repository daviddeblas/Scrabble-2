import { Component, HostListener } from '@angular/core';
import { keyDown } from '@app/actions/board.actions';
import { getGameStatus } from '@app/actions/game-status.actions';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(private store: Store<GameStatus>) {
        this.store.dispatch(getGameStatus());
    }
    @HostListener('window:keydown', ['$event'])
    handleKeyDown(e: KeyboardEvent): void {
        this.store.dispatch(keyDown({ key: e.key }));
    }
}
