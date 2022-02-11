import * as gameActions from '@app/actions/game-status.actions';
import { createReducer, on } from '@ngrx/store';

export const gameStatusFeatureKey = 'gameStatus';

export interface GameStatus {
    activePlayer: number;
    letterPotLength: number;
}

export const initialState: GameStatus = {
    activePlayer: 0,
    letterPotLength: 0,
};

export const reducer = createReducer(
    initialState,
    on(gameActions.gameStatusReceived, (state, { status }) => status),
);
