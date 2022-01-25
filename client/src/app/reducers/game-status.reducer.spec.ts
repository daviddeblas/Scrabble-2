import * as gameStatusActions from '@app/actions/game-status.actions';
import { initialState, reducer } from '@app/reducers/game-status.reducer';

describe('[Game Status] Reducer', () => {
    describe('an unknown action', () => {
        it('should return the previous state', () => {
            const action = gameStatusActions.startNewRound({ activePlayer: 'player 1' });

            const result = reducer(initialState, action);

            expect(result).toEqual({ ...initialState, activePlayer: 'player 1' });
        });
    });
});
