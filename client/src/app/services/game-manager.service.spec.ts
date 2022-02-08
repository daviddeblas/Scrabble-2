import { TestBed } from '@angular/core/testing';
import { endGame } from '@app/actions/game-status.actions';
import { Player } from '@app/classes/player';
import { SocketTestHelper } from '@app/helper/socket-test-helper';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Players } from '@app/reducers/player.reducer';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { Socket } from 'socket.io-client';
import { GameManagerService } from './game-manager.service';
import { SocketClientService } from './socket-client.service';

describe('GameManagerService', () => {
    const players: Players = {
        player: new Player('Player 1'),
        opponent: new Player('Player 2'),
    };

    let service: GameManagerService;
    let socketService: SocketTestHelper;
    let store: MockStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideMockStore()],
        });
        service = TestBed.inject(GameManagerService);
        TestBed.inject(SocketClientService).socket = socketService as unknown as Socket;
        store = TestBed.inject(MockStore);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should dispatch "[Game Status] End Game"" when an end game call is received', () => {
        const endGameStatus = { players, winner: 'player 1' };

        socketService.peerSideEmit('end game', endGameStatus);

        const expectedAction = cold('a', { a: endGame(endGameStatus) });

        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('should dispatch "[Game Status] Game Status Received" when receive game status from server', () => {
        const gameStatus: GameStatus = { activePlayer: 0, letterPotLength: 5 };

        socketService.peerSideEmit('end game', gameStatus);

        // const expectedAction = cold('a', { a: gameStatusReceived({ gameStatus, players }) });

        // expect(store.scannedActions$).toBeObservable(expectedAction);
    });
});
