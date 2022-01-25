import { Player } from '@app/classes/player';
import { Word } from '@app/classes/word';
import { createAction, props } from '@ngrx/store';

export const startGame = createAction('[Game Status] Start Game', props<{ player: Player }>());

export const startGameSuccess = createAction(
    '[Game Status] Start Game Success',
    props<{ currentPlayer: Player; opponentPlayer: Player; activePlayer: string }>(),
);

export const startGameFailure = createAction('[Game Status] Start Game Failure', props<{ error: unknown }>());

export const startNewRound = createAction('[Game Status] Start New Round', props<{ activePlayer: string }>());

export const placeWord = createAction('[Game Status] Place a Word', props<{ word: Word }>());

export const placeWordSuccess = createAction('[Game Status] Place a Word Success', props<{ word: Word }>());

export const placeWordFailure = createAction('[Game Status] Place a Word Failure', props<{ error: unknown }>());
