import { GameFinishStatus } from '@app/classes/game-finish-status';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { createAction, props } from '@ngrx/store';

export const getGameStatus = createAction('[Game Status] Get Game');

export const gameStatusReceived = createAction('[Game Status] Game Status Received', props<{ status: GameStatus }>());

export const endGame = createAction('[Game Status] End Game', props<{ gameFinishStatus: GameFinishStatus }>());
