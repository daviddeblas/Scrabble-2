import { loadPlayers } from '@app/actions/player.actions';
import { initialState, Players, reducer } from './player.reducer';

describe('[Players] Reducer', () => {
    const playersMock: Players = {
        player: { easel: ['H', 'E', 'A', 'L', 'O', 'L', 'W'], name: 'Player 1', score: 0 },
        opponent: { easel: ['S', 'U', 'A', 'L', 'T', 'L', 'P'], name: 'Player 2', score: 0 },
    };

    describe('[Players] Load Players', () => {
        it('should return the loaded players', () => {
            const action = loadPlayers({ players: playersMock });

            const result = reducer(initialState, action);

            expect(result).toBe(playersMock);
        });
    });
});
