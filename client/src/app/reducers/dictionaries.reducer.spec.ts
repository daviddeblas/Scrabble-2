import { addDictionary, deleteDictionary, loadDictionariesSuccess, modifyDictionary } from '@app/actions/dictionaries.actions';
import { resetAllState } from '@app/actions/game-status.actions';
import { Dictionary } from 'common/classes/dictionary';
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

    it('should reset to addDictionary dictionnary to the list', () => {
        const dictionary: Dictionary = { title: 'dict', description: 'desc' } as Dictionary;
        const action = addDictionary({ dictionary });
        const result = reducer(initialState, action);

        expect(result).toEqual([dictionary]);
    });

    it('should modify to addDictionary dictionnary to the list', () => {
        const oldDictionary = { title: 'dict', description: 'desc' };
        const dictionaries: iDictionary[] = [oldDictionary];
        const dictionary: Dictionary = { title: 'New dict', description: 'nouvelle desc' } as Dictionary;
        const action = modifyDictionary({ oldDictionary, newDictionary: dictionary });
        const result = reducer(dictionaries, action);

        expect(result).toEqual([dictionary]);
    });

    it('should delete dictionary from the list', () => {
        const dictionary = { title: 'New dict', description: 'nouvelle desc' };
        const dictionaries: iDictionary[] = [dictionary];
        const action = deleteDictionary({ dictionary });
        const result = reducer(dictionaries, action);

        expect(result).toEqual(initialState);
    });
});
