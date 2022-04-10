import { loadDictionariesSuccess } from '@app/actions/dictionaries.actions';
import { resetAllState } from '@app/actions/game-status.actions';
import { iDictionary } from 'common/interfaces/dictionary';
import { initialState, reducer } from './dictionaries.reducer';

describe('Dictionaries Reducer', () => {
    describe('an unknown action', () => {
        it('should return the previous state', () => {
            const dictionaries: iDictionary[] = [{ title: 'dict', description: 'desc' }];
            const action = loadDictionariesSuccess({ dictionaries });

            const result = reducer(initialState, action);

            expect(result).toBe(dictionaries);
        });
    });

    it('should reset to initial state', () => {
        const dictionaries: iDictionary[] = [{ title: 'dict', description: 'desc' }];
        const action = resetAllState();
        const result = reducer(dictionaries, action);

        expect(result).toEqual(initialState);
    });
});
