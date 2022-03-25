import { Component } from '@angular/core';
import { browserReload } from '@app/actions/browser.actions';
import { getGameStatus } from '@app/actions/game-status.actions';
import { Store } from '@ngrx/store';
import { GameMode } from 'common/interfaces/game-mode';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    isLog2990: boolean;
    constructor(private store: Store<{ gameMode: GameMode }>) {
        store.dispatch(getGameStatus());
        window.addEventListener('load', (event) => this.catchBrowserLoad(event));
        this.store.select('gameMode').subscribe((gameMode) => (this.isLog2990 = gameMode === GameMode.Log2990));
    }

    catchBrowserLoad(event: Event) {
        event.preventDefault();
        this.store.dispatch(browserReload());
    }
}
