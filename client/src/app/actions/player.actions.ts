import { WordValidationError } from '@app/classes/errors/word-validation-error';
import { Letter } from '@app/classes/letter';
import { Word } from '@app/classes/word';
import { createAction, props } from '@ngrx/store';

export const placeWord = createAction('[Players] Place Word', props<{ word: Word }>());

export const placeWordSuccess = createAction('[Players] Place Word Success', props<{ word: Word; newLetters?: Letter[]; newScore?: number }>());

export const placeWordFailed = createAction('[Players] Place Word Failed', props<{ error: Error | WordValidationError }>());

export const exchangeLetters = createAction('[Players] Exchange Letters', props<{ letters: Letter[] }>());

export const exchangeLettersSuccess = createAction('[Players] Exchange Letters Success', props<{ newLetters: Letter[] }>());

export const exchangeLettersFailure = createAction('[Players] Exchange Letters Failure', props<{ error: Error }>());

export const skipTurn = createAction('[Players] Skip Turn');
