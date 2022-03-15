import { Component } from '@angular/core';
import { browserReload } from '@app/actions/browser.actions';
import { getGameStatus } from '@app/actions/game-status.actions';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(private store: Store) {
        store.dispatch(getGameStatus());
        window.addEventListener('load', (event) => this.catchBrowserLoad(event));
    }

    catchBrowserLoad(event: Event) {
        event.preventDefault();
        this.store.dispatch(browserReload());
    }
}
