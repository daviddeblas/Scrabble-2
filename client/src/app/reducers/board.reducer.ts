import { syncBoardSuccess } from '@app/actions/board.actions';
import { gameStatusReceived, resetAllState } from '@app/actions/game-status.actions';
import { placeWordSuccess } from '@app/actions/player.actions';
import { Letter } from '@app/classes/letter';
import { Multiplier } from '@app/classes/multiplier';
import { Vec2 } from '@app/classes/vec2';
import { Direction } from '@app/classes/word';
import { createReducer, on } from '@ngrx/store';

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
        const boardCopy = JSON.parse(JSON.stringify(state.board));
        for (let i = 0; i < word.length(); ++i) {
            switch (word.direction) {
                case Direction.HORIZONTAL:
                    boardCopy[word.position.x + i][word.position.y] = word.letters[i];
                    break;
                case Direction.VERTICAL:
                    boardCopy[word.position.x][word.position.y + i] = word.letters[i];
                    break;
            }
        }
        return { ...state, board: boardCopy };
    }),

    on(resetAllState, () => initialState),
);
