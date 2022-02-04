import { GameStatus } from '@app/reducers/game-status.reducer';
import { Players } from '@app/reducers/player.reducer';
import { createAction, props } from '@ngrx/store';

export const getGameStatus = createAction('[Game Status] Get Game');

export const gameStatusReceived = createAction('[Game Status] Game Status Received', props<{ status: GameStatus }>());

export const endGame = createAction('[Game Status] End Game', props<{ finalPlayersState: Players; winner?: string }>());
