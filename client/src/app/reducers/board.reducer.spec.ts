import * as boardActions from '@app/actions/board.actions';
import { initialState, reducer } from './board.reducer';

describe('[Board] Reducer', () => {
    describe('an unknown action', () => {
        it('should return the previous state', () => {
            const action = boardActions.syncBoardSuccess({ newBoard: [[]] });

            const result = reducer(initialState, action);

            expect(result).toEqual([]);
        });
    });
});
