import { startGameSuccess } from '@app/actions/game-status.actions';
import { initialState, Players, reducer } from './player.reducer';

describe('[Players] Reducer', () => {
    const playersMock: Players = {
        player: { easel: ['H', 'E', 'A', 'L', 'O', 'L', 'W'], name: 'Player 1', score: 0 },
        opponent: { easel: ['S', 'U', 'A', 'L', 'T', 'L', 'P'], name: 'Player 2', score: 0 },
    };

    describe('[Players] Load Players', () => {
        it('should return the loaded players', () => {
            const action = startGameSuccess({ players: playersMock, activePlayer: 'Player 1' });

            const result = reducer(initialState, action);

            expect(result).toBe(playersMock);
        });
    });
});
