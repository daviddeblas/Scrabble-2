import * as gameActions from '@app/actions/game-status.actions';
import { createReducer, on } from '@ngrx/store';
import { Letter } from '@app/classes/letter';
import { Multiplier } from '@app/classes/multiplier';

export const gameStatusFeatureKey = 'gameStatus';

export interface GameStatus {
    playerNames: string[];
    thisPlayer: number;
    playerEasel: Letter[];
    board: (Letter | null)[][];
    multipliers: (Multiplier | null)[][];
    activePlayer: number;
    letterPotLength: number;
    pointsPerLetter: Map<Letter, number>;
}

export const initialState: GameStatus = {
    playerNames: ['Player 1', 'Player 2'],
    thisPlayer: 0,
    playerEasel: [],
    board: [],
    multipliers: [],
    activePlayer: 0,
    letterPotLength: 0,
    pointsPerLetter: new Map(),
};

export const reducer = createReducer(
    initialState,
    on(gameActions.gameStatusReceived, (state, { status }) => ({ ...status })),
);
