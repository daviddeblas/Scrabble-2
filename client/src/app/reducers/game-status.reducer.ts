import * as gameActions from '@app/actions/game-status.actions';
import { createReducer, on } from '@ngrx/store';

export const gameStatusFeatureKey = 'gameStatus';

export interface GameStatus {
    activePlayer: string;
    letterPotLength: number;
}

export const initialState: GameStatus = {
    activePlayer: '',
    letterPotLength: 0,
};

export const reducer = createReducer(
    initialState,
    on(gameActions.gameStatusReceived, (state, { status }) => status),
);
