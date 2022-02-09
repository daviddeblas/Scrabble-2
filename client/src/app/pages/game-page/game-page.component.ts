import { Component } from '@angular/core';
import { browserReload, browserUnload } from '@app/actions/browser.actions';
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
        window.addEventListener('beforeunload', (event) => {
            event.preventDefault();
            store.dispatch(browserUnload());
        });
        window.addEventListener('load', (event) => {
            event.preventDefault();
            store.dispatch(browserReload());
        });
        this.store.dispatch(getGameStatus());
    }
}
