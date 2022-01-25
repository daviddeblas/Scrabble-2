import * as gameActions from '@app/actions/game-status.actions';
import { createReducer, on } from '@ngrx/store';

export const gameStatusFeatureKey = 'gameStatus';

export interface GameStatus {
    activePlayer?: string;
    waitingForServer: boolean;
}

export const initialState: GameStatus = {
    waitingForServer: true,
};

export const reducer = createReducer(
    initialState,
    on(gameActions.startGameSuccess, (state, { activePlayer }) => ({ ...state, activePlayer })),
    on(gameActions.startNewRound, (state, newRound) => ({ ...state, activePlayer: newRound.activePlayer })),
);
