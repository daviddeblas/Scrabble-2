import { BoardState } from '@app/reducers/board.reducer';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Players } from '@app/reducers/player.reducer';
import { createAction, props } from '@ngrx/store';

export const resetAllState = createAction('[Game Status] Reset All State');

export const getGameStatus = createAction('[Game Status] Get Game');

export const gameStatusReceived = createAction(
    '[Game Status] Game Status Received',
    props<{ status: GameStatus; players: Players; board: BoardState }>(),
);

export const refreshTimer = createAction('[Game Status] Refresh timer', props<{ timer: number }>());

export const endGame = createAction('[Game Status] End Game', props<{ players: Players; remainingLetters: number; winner: string }>());
