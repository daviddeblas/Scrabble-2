import { createAction, props } from '@ngrx/store';
import { Letter } from 'common/classes/letter';

export const syncBoard = createAction('[Board] Sync Board');

export const syncBoardSuccess = createAction('[Board] Sync Board Success', props<{ newBoard: (Letter | null)[][] }>());

export const syncBoardFailure = createAction('[Board] Sync Board Failure', props<{ error: unknown }>());
