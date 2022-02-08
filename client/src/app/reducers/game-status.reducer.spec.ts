import * as gameStatusActions from '@app/actions/game-status.actions';
import { Player } from '@app/classes/player';
import { GameStatus, initialState, reducer } from '@app/reducers/game-status.reducer';
import { Players } from './player.reducer';

describe('[Game Status] Game Status Received', () => {
    const gameStatusStub: GameStatus = {
        activePlayer: 0,
        letterPotLength: 0,
    };

    const playersStub: Players = {
        player: new Player('Player 1'),
        opponent: new Player('Player 2'),
    };

    it('should set the game status', () => {
        const action = gameStatusActions.gameStatusReceived({
            status: gameStatusStub,
            players: playersStub,
            board: [],
        });

        const result = reducer(initialState, action);

        expect(result).toEqual(gameStatusStub);
    });
});
