import * as gameActions from '@app/actions/game-status.actions';
import { Letter } from '@app/classes/letter';
import { Multiplier } from '@app/classes/multiplier';
import { createReducer, on } from '@ngrx/store';

export const gameStatusFeatureKey = 'gameStatus';

export interface GameStatus {
    multipliers: (Multiplier | null)[][];
    activePlayer: number;
    letterPotLength: number;
    pointsPerLetter: Map<Letter, number>;
}

export const initialState: GameStatus = {
    multipliers: [],
    activePlayer: 0,
    letterPotLength: 0,
    pointsPerLetter: new Map(),
};

export const reducer = createReducer(
    initialState,
    on(gameActions.gameStatusReceived, (state, { status }) => ({ ...status })),
);
