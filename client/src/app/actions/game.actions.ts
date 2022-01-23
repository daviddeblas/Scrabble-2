import { Player } from '@app/classes/player';
import { Word } from '@app/classes/word';
import { createAction, props } from '@ngrx/store';

export const startGame = createAction('[Game] Start Game', props<{ player: Player }>());

export const startGameSuccess = createAction(
    '[Game] Start Game Success',
    props<{ currentPlayer: Player; opponentPlayer: Player; activePlayer: string }>(),
);

export const startGameFailure = createAction('[Game] Start Game Failure', props<{ error: unknown }>());

export const startNewRound = createAction('[Game] Start New Round', props<{ activePlayer: string }>());

export const placeWord = createAction('[Game] Place a Word', props<{ word: Word }>());

export const placeWordSuccess = createAction('[Game] Place a Word Success', props<{ word: Word }>());

export const placeWordFailure = createAction('[Game] Place a Word Failure', props<{ error: unknown }>());
