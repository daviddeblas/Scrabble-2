import * as gameActions from '@app/actions/game-status.actions';
import { Player } from '@app/classes/player';
import { createReducer, on } from '@ngrx/store';

export const gameStatusFeatureKey = 'gameStatus';

export interface GameStatus {
    currentPlayer?: Player;
    opponentPlayer?: Player;
    activePlayer?: string;
    waitingForServer: boolean;
}

export const initialState: GameStatus = {
    waitingForServer: true,
};

export const reducer = createReducer(
    initialState,
    on(gameActions.startGameSuccess, (state, newGame) => ({
        ...state,
        currentPlayer: newGame.currentPlayer,
        opponentPlayer: newGame.opponentPlayer,
        activePlayer: newGame.activePlayer,
    })),
    on(gameActions.startNewRound, (state, newRound) => {
        return { ...state, activePlayer: newRound.activePlayer };
    }),
);
