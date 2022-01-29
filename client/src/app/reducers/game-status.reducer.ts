import * as gameActions from '@app/actions/game-status.actions';
import { createReducer, on } from '@ngrx/store';

export const gameStatusFeatureKey = 'gameStatus';

export interface GameStatus {
    activePlayer?: string;
}

export const initialState: GameStatus = {};

export const reducer = createReducer(
    initialState,
    on(gameActions.startGameSuccess, (state, { activePlayer }) => ({ ...state, activePlayer })),
    on(gameActions.startNewRound, (state, { activePlayer }) => ({ ...state, activePlayer })),
);
