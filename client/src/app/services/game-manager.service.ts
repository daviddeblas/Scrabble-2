import { Injectable } from '@angular/core';
import { gameStatusReceived, endGame } from '@app/actions/game-status.actions';
import { GameFinishStatus } from '@app/classes/game-finish-status';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Store } from '@ngrx/store';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    constructor(private socketService: SocketClientService, private store: Store) {
        this.socketService.on('end game', (status: GameFinishStatus) => {
            this.store.dispatch(endGame({ gameFinishStatus: status }));
        });
    }

    getGameStatus(): void {
        this.socketService.send('get game status');
        this.socketService.on('game status', (status: GameStatus) => {
            this.store.dispatch(gameStatusReceived({ status }));
        });
    }
}
