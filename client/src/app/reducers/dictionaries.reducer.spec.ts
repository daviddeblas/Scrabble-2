import { loadDictionariesSuccess } from '@app/actions/dictionaries.actions';
import { reducer, initialState } from './dictionaries.reducer';

describe('Dictionaries Reducer', () => {
    describe('an unknown action', () => {
        it('should return the previous state', () => {
            const dictionaries = ['dict'];
            const action = loadDictionariesSuccess({ dictionaries });

            const result = reducer(initialState, action);

            expect(result).toBe(dictionaries);
        });
    });
});
