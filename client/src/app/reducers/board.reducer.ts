import { syncBoardSuccess } from '@app/actions/board.actions';
import { gameStatusReceived, resetAllState } from '@app/actions/game-status.actions';
import { placeWordSuccess } from '@app/actions/player.actions';
import { Multiplier } from '@app/classes/multiplier';
import { Vec2 } from '@app/classes/vec2';
import { Direction } from '@app/classes/word';
import { createReducer, on } from '@ngrx/store';
import { Letter } from 'common/classes/letter';

export const boardFeatureKey = 'board';

export const boardSize = 15;

export interface BoardState {
    board: (Letter | null)[][];
    pointsPerLetter: Map<Letter, number>;
    multipliers: (Multiplier | null)[][];
    blanks: Vec2[];
}

export const initialState: BoardState = { board: [], pointsPerLetter: new Map(), multipliers: [], blanks: [] };

export const reducer = createReducer(
    initialState,
    on(syncBoardSuccess, (state, { newBoard }) => ({ ...state, board: newBoard })),

    on(gameStatusReceived, (state, { board }) => ({
        ...board,
        // transformer le array de tuple en map
        pointsPerLetter: new Map(board.pointsPerLetter as unknown as [Letter, number][]),
    })),

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

    on(resetAllState, () => initialState),
);
