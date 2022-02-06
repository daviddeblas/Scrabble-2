import * as dictionariesActions from '@app/actions/dictionaries.actions';
import { createReducer, on } from '@ngrx/store';

export const dictionariesFeatureKey = 'dictionaries';

export const initialState: string[] = [];

export const reducer = createReducer(
    initialState,
    on(dictionariesActions.loadDictionariesSuccess, (state, { dictionaries }) => dictionaries),
);
