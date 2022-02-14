import { zoomIn } from '@app/actions/local-settings.actions';
import { initialState, reducer } from './local-settings.reducer';

describe('LocalSettings Reducer', () => {
    describe('an unknown action', () => {
        it('should return the previous state', () => {
            const action = zoomIn();
            const result = reducer(initialState, action);
            expect(result).toBe(initialState);
        });
    });
});
