import { createAction, props } from '@ngrx/store';
import { iDictionary } from 'common/interfaces/dictionary';

export const loadDictionaries = createAction('[Dictionaries] Load Dictionaries');

export const loadDictionariesSuccess = createAction('[Dictionaries] Load Dictionaries Success', props<{ dictionaries: iDictionary[] }>());

export const loadDictionariesFailure = createAction('[Dictionaries] Load Dictionaries Failure', props<{ error: Error }>());

export const deleteDictionary = createAction('[Dictionaries] Delete Dictionary', props<{ index: number }>());
