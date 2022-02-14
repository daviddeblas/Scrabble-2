import { syncBoardSuccess } from '@app/actions/board.actions';
import { gameStatusReceived } from '@app/actions/game-status.actions';
import { placeWordSuccess } from '@app/actions/player.actions';
import { Letter } from '@app/classes/letter';
import { Multiplier } from '@app/classes/multiplier';
import { Direction } from '@app/classes/word';
import { createReducer, on } from '@ngrx/store';

export const boardFeatureKey = 'board';

export const boardSize = 15;

export interface BoardState {
    board: (Letter | null)[][];
    pointsPerLetter: Map<Letter, number>;
    multipliers: (Multiplier | null)[][];
}

export const initialState: BoardState = { board: [], pointsPerLetter: new Map(), multipliers: [] };

export const reducer = createReducer(
    initialState,
    on(syncBoardSuccess, (state, { newBoard }) => ({ ...state, board: newBoard })),

    on(gameStatusReceived, (state, { board }) => {
        // transformer le array de tuple en map
        return { ...board, pointsPerLetter: new Map(board.pointsPerLetter as unknown as [Letter, number][]) };
    }),

    on(placeWordSuccess, (state, { word }) => {
        for (let i = word.direction === 'h' ? word.position.x : word.position.y; i < word.length(); ++i) {
            switch (word.direction) {
                case Direction.HORIZONTAL:
                    state.board[word.position.x + i][word.position.y] = word.letters[i];
                    state.multipliers[word.position.x + i][word.position.y] = null;
                    break;
                case Direction.VERTICAL:
                    state.board[word.position.x][word.position.y + i] = word.letters[i];
                    state.multipliers[word.position.x][word.position.y + i] = null;
                    break;
            }
        }
        return state;
    }),
);
