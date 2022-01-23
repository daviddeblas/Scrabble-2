import { Player } from '@app/classes/player';
import { createReducer, on } from '@ngrx/store';
import * as gameActions from '../actions/game.actions';

export const gameFeatureKey = 'game';

export interface GameState {
    currentPlayer?: Player;
    opponentPlayer?: Player;
    activePlayer?: string;
    waitingForServer: boolean;
}

export const initialState: GameState = {
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
    on(gameActions.syncBoardSuccess, (state, { newBoard }) => ({ ...state, board: newBoard })),
);
