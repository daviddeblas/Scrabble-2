<<<<<<< HEAD
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
=======
>>>>>>> dev
import { createAction, props } from '@ngrx/store';
import { Letter } from 'common/classes/letter';

export const syncBoard = createAction('[Board] Sync Board');

export const syncBoardSuccess = createAction('[Board] Sync Board Success', props<{ newBoard: (Letter | null)[][] }>());

export const syncBoardFailure = createAction('[Board] Sync Board Failure', props<{ error: unknown }>());

export const cellClick = createAction('[Board] Cell Clicked', props<{ pos: Vec2 }>());

export const keyDown = createAction('[Board] Key Down', props<{ key: string }>());

export const placeLetter = createAction('[Board] Letter Placed', props<{ letter: Letter }>());

export const removeLetters = createAction('[Board] Letters Removed', props<{ positions: Vec2[] }>());

export const clearSelection = createAction('[Board] Selection Cleared');

export const backspaceSelection = createAction('[Board] Selection Backspace');
