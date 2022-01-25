import { Player } from '@app/classes/player';
import { Players } from '@app/reducers/player.reducer';
import { createAction, props } from '@ngrx/store';

export const startGame = createAction('[Game Status] Start Game', props<{ player: Player }>());

export const startGameSuccess = createAction('[Game Status] Start Game Success', props<{ players: Players; activePlayer: string }>());

export const startGameFailure = createAction('[Game Status] Start Game Failure', props<{ error: Error }>());

export const startNewRound = createAction('[Game Status] Start New Round', props<{ activePlayer: string }>());

export const endGame = createAction('[Game Status] End Game', props<{ finalPlayersState: Players; winner?: string }>());
