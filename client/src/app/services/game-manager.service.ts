import { Injectable } from '@angular/core';
import { endGame, gameStatusReceived } from '@app/actions/game-status.actions';
import { GameFinishStatus } from '@app/classes/game-finish-status';
import { Letter } from '@app/classes/letter';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Players } from '@app/reducers/player.reducer';
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
        this.socketService.on('game status', (gameStatus: { status: GameStatus; players: Players; board: Letter[] }) => {
            this.store.dispatch(gameStatusReceived(gameStatus));
        });
    }
}
