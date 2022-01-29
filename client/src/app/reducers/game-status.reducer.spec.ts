import * as gameStatusActions from '@app/actions/game-status.actions';
import { initialState, reducer } from '@app/reducers/game-status.reducer';

describe('[Game Status] Reducer', () => {
    describe('[Game Status] Start New Round', () => {
        it('should set the active player', () => {
            const action = gameStatusActions.startNewRound({ activePlayer: 'player 1' });

            const result = reducer(initialState, action);

            expect(result).toEqual({ ...initialState, activePlayer: 'player 1' });
        });
    });

    describe('[Game Status] Start Game Success', () => {
        it('should set the active player', () => {
            const action = gameStatusActions.startGameSuccess({ players: {}, activePlayer: 'player 1' });

            const result = reducer(initialState, action);

            expect(result).toEqual({ ...initialState, activePlayer: 'player 1' });
        });
    });
});
