import { WordValidationError } from '@app/classes/errors/word-validation-error';
import { Letter } from '@app/classes/letter';
import { Word } from '@app/classes/word';
import { Players } from '@app/reducers/player.reducer';
import { createAction, props } from '@ngrx/store';

export const loadPlayers = createAction('[Players] Load Players', props<{ players: Players }>());

export const placeWord = createAction('[Players] Place Word', props<{ word: Word }>());

export const placeWordSuccess = createAction('[Players] Place Word Success', props<{ word: Word; newLetters: Letter[] }>());

export const placeWordFailed = createAction('[Players] Place Word Failed', props<{ error: Error | WordValidationError }>());
