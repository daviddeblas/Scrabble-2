import { gameStatusReceived } from '@app/actions/game-status.actions';
import { Player } from '@app/classes/player';
import { GameStatus } from './game-status.reducer';
import { initialState, Players, reducer } from './player.reducer';

describe('[Players] Reducer', () => {
    const playersStub: Players = {
        player: new Player('Player 1'),
        opponent: new Player('Player 2'),
    };
    const gameStatusStub: GameStatus = {
        multipliers: [],
        activePlayer: 0,
        letterPotLength: 0,
        pointsPerLetter: new Map(),
    };

    describe('[Players] Load Players', () => {
        it('should return the loaded players', () => {
            const action = gameStatusReceived({
                status: gameStatusStub,
                players: playersStub,
                board: [],
            });

            const result = reducer(initialState, action);

            expect(result).toBe(playersStub);
        });
    });
});
