import { createAction, props } from '@ngrx/store';
import { iDictionary } from 'common/interfaces/dictionary';

export const loadDictionaries = createAction('[Dictionaries] Load Dictionaries');

export const loadDictionariesSuccess = createAction('[Dictionaries] Load Dictionaries Success', props<{ dictionaries: iDictionary[] }>());

export const loadDictionariesFailure = createAction('[Dictionaries] Load Dictionaries Failure', props<{ error: Error }>());

export const addDictionary = createAction('[Dictionaries] Add Dictionary', props<{ dictionary: iDictionary }>());

export const resetDictionaries = createAction('[Dictionaries] Reset Dictionaries');

export const deleteDictionary = createAction('[Dictionaries] Delete Dictionary', props<{ index: number }>());

export const modifyDictionary = createAction('[Dictionaries] Modify Dictionary', props<{ index: number; dictionary: iDictionary }>());

export const downloadDictionary = createAction('[Dictionaries] Download Dictionary', props<{ dictionary: iDictionary }>());
