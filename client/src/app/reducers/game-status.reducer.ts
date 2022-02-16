import * as gameActions from '@app/actions/game-status.actions';
import { createReducer, on } from '@ngrx/store';

export const gameStatusFeatureKey = 'gameStatus';

export interface GameStatus {
    activePlayer: string;
    letterPotLength: number;
    gameEnded: boolean;
}

export const initialState: GameStatus = {
    activePlayer: '',
    letterPotLength: 0,
    gameEnded: false,
};

export const reducer = createReducer(
    initialState,
    on(gameActions.gameStatusReceived, (state, { status }) => ({
        ...state,
        activePlayer: status.activePlayer,
        letterPotLength: status.letterPotLength,
    })),
    on(gameActions.endGame, (state) => ({ ...state, gameEnded: true })),
);
