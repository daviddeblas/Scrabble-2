import * as dictionariesActions from '@app/actions/dictionaries.actions';
import { resetAllState } from '@app/actions/game-status.actions';
import { createReducer, on } from '@ngrx/store';
import { iDictionary } from 'common/interfaces/dictionary';

export const dictionariesFeatureKey = 'dictionaries';

export const initialState: iDictionary[] = [];

export const reducer = createReducer(
    initialState,
    on(dictionariesActions.loadDictionariesSuccess, (state, { dictionaries }) => dictionaries),
    on(dictionariesActions.addDictionary, (state, { dictionary }) => [...state, dictionary]),
    on(dictionariesActions.modifyDictionary, (state, { index, dictionary }) => {
        const newState = [...state];
        newState[index] = dictionary;
        return newState;
    }),
    on(dictionariesActions.deleteDictionary, (state, { index }) => state.filter((e, i) => i !== index)),
    on(resetAllState, () => initialState),
);
