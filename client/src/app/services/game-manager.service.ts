import { Injectable } from '@angular/core';
import { gameStatusReceived } from '@app/actions/game-status.actions';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Store } from '@ngrx/store';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    constructor(private socketService: SocketClientService, private store: Store) {}

    getGameStatus(): void {
        this.socketService.send('get game status');
        this.socketService.on('game status', (status: GameStatus) => {
            this.store.dispatch(gameStatusReceived({ status }));
        });
    }
}
