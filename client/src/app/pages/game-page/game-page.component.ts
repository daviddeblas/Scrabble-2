import { Component } from '@angular/core';
import { getGameStatus } from '@app/actions/game-status.actions';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { BrowserManagerService } from '@app/services/browser-manager.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(public socketService: SocketClientService, public browserManager: BrowserManagerService, private store: Store<GameStatus>) {
        window.addEventListener('beforeunload', (event) => {
            event.preventDefault();
            this.browserManager.onBrowserClosed(this.socketService);
        });
        window.addEventListener('load', (event) => {
            event.preventDefault();
            this.browserManager.onBrowserLoad(this.socketService);
        });
        this.store.dispatch(getGameStatus());
    }
}
