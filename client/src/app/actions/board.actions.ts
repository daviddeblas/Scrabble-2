import { Letter } from '@app/classes/letter';
import { Word } from '@app/classes/word';
import { createAction, props } from '@ngrx/store';

export const syncBoard = createAction('[Board] Sync Board');

export const syncBoardSuccess = createAction('[Board] Sync Board Success', props<{ newBoard: Letter[][] }>());

export const syncBoardFailure = createAction('[Board] Sync Board Failure', props<{ error: unknown }>());

export const addWord = createAction('[Board] Place New Word', props<{ word: Word }>());
