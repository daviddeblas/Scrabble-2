import { Component } from '@angular/core';
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
}
