import { loadPlayers } from '@app/actions/player.actions';
import { initialState, reducer } from './player.reducer';

describe('Player Reducer', () => {
    describe('an unknown action', () => {
        it('should return the previous state', () => {
            const action = loadPlayers({ players: {} });

            const result = reducer(initialState, action);

            expect(result).toEqual(initialState);
        });
    });
});
