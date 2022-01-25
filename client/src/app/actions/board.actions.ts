import { Letter } from '@app/classes/letter';
import { createAction, props } from '@ngrx/store';

export const syncBoard = createAction('[Board] Sync Board');

export const syncBoardSuccess = createAction('[Board] Sync Board Success', props<{ newBoard: Letter[][] }>());

export const syncBoardFailure = createAction('[Board] Sync Board Failure', props<{ error: unknown }>());
