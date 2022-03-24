import * as gameActions from '@app/actions/game-status.actions';
import { resetAllState } from '@app/actions/game-status.actions';
import { createReducer, on } from '@ngrx/store';
import { GameMode } from 'common/interfaces/game-mode';

export const gameStatusFeatureKey = 'gameStatus';

export interface GameStatus {
    activePlayer: string;
    letterPotLength: number;
    gameEnded: boolean;
    winner: string | null;
    timer: number;
    gameMode: GameMode;
}

export const initialState: GameStatus = {
    activePlayer: '',
    letterPotLength: 0,
    gameEnded: false,
    winner: null,
    timer: 0,
    gameMode: GameMode.Classical,
};

export const reducer = createReducer(
    initialState,
    on(gameActions.gameStatusReceived, (state, { status }) => ({
        ...state,
        activePlayer: status.activePlayer,
        letterPotLength: status.letterPotLength,
        timer: status.timer,
    })),
    on(gameActions.endGame, (state, { winner }) => ({ ...state, gameEnded: true, winner })),
    on(gameActions.refreshTimer, (state, { timer }) => ({
        ...state,
        timer,
    })),
    on(gameActions.changeGameMode, (state, { gameMode }) => ({ ...state, gameMode })),
    on(resetAllState, () => initialState),
);
