import { createAction, props } from '@ngrx/store';

export const loadDictionaries = createAction('[Dictionaries] Load Dictionaries');

export const loadDictionariesSuccess = createAction('[Dictionaries] Load Dictionaries Success', props<{ dictionaries: string[] }>());

export const loadDictionariesFailure = createAction('[Dictionaries] Load Dictionaries Failure', props<{ error: Error }>());
