import { BoardState } from '@app/reducers/board.reducer';
import { GameStatus } from '@app/reducers/game-status.reducer';
import { Players } from '@app/reducers/player.reducer';
import { createAction, props } from '@ngrx/store';

export const getGameStatus = createAction('[Game Status] Get Game');

export const gameStatusReceived = createAction(
    '[Game Status] Game Status Received',
    props<{ status: GameStatus; players: Players; board: BoardState }>(),
);

export const endGame = createAction('[Game Status] End Game', props<{ players: Players; winner: string }>());
