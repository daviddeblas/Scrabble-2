import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { createAction, props } from '@ngrx/store';

export const syncBoard = createAction('[Board] Sync Board');

export const syncBoardSuccess = createAction('[Board] Sync Board Success', props<{ newBoard: (Letter | null)[][] }>());

export const syncBoardFailure = createAction('[Board] Sync Board Failure', props<{ error: unknown }>());

export const cellClick = createAction('[Board] Cell Clicked', props<{ pos: Vec2 }>());

export const keyDown = createAction('[Board] Key Down', props<{ key: string }>());

export const placeLetter = createAction('[Board] Letter Placed', props<{ letter: Letter }>());
