import { syncBoardSuccess } from '@app/actions/board.actions';
import { gameStatusReceived, resetAllState } from '@app/actions/game-status.actions';
import { placeWordSuccess } from '@app/actions/player.actions';
import { Direction } from '@app/classes/word';
import { createReducer, on } from '@ngrx/store';
import { Letter, stringToLetter } from 'common/classes/letter';
import { Multiplier } from 'common/classes/multiplier';
import { Vec2 } from 'common/classes/vec2';

export const boardFeatureKey = 'board';

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
        const multipliersCopy = JSON.parse(JSON.stringify(state.multipliers));
        const boardCopy = JSON.parse(JSON.stringify(state.board));
        const blankCopy: Vec2[] = JSON.parse(JSON.stringify(state.blanks));
        for (let i = 0; i < word.length(); ++i) {
            switch (word.direction) {
                case Direction.HORIZONTAL:
                    boardCopy[word.position.x + i][word.position.y] = word.letters[i].toUpperCase();
                    multipliersCopy[word.position.x + i][word.position.y] = null;
                    if (stringToLetter(word.letters[i]) === '*') {
                        blankCopy.push(new Vec2(word.position.x + i, word.position.y));
                    }
                    break;
                case Direction.VERTICAL:
                    boardCopy[word.position.x][word.position.y + i] = word.letters[i].toUpperCase();
                    multipliersCopy[word.position.x][word.position.y + i] = null;
                    if (stringToLetter(word.letters[i]) === '*') {
                        blankCopy.push(new Vec2(word.position.x, word.position.y + i));
                    }
                    break;
            }
        }
        return { ...state, board: boardCopy, blanks: blankCopy, multipliers: multipliersCopy };
    }),

    on(resetAllState, () => initialState),
);
