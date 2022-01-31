import { startGameSuccess } from '@app/actions/game-status.actions';
import { Player } from '@app/classes/player';
import { initialState, Players, reducer } from './player.reducer';

describe('[Players] Reducer', () => {
    const playersMock: Players = {
        player: new Player('Player 1'),
        opponent: new Player('Player 2'),
    };

    describe('[Players] Load Players', () => {
        it('should return the loaded players', () => {
            const action = startGameSuccess({ players: playersMock, activePlayer: 'Player 1' });

            const result = reducer(initialState, action);

            expect(result).toBe(playersMock);
        });
    });
});
