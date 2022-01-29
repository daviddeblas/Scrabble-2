import { syncBoardSuccess } from '@app/actions/board.actions';
import { placeWordSuccess } from '@app/actions/player.actions';
import { Letter } from '@app/classes/letter';
import { Direction } from '@app/classes/word';
import { createReducer, on } from '@ngrx/store';

export const boardFeatureKey = 'board';

export const boardSize = 15;

export const createInitialBoard = () => {
    const initialState: Letter[][] = new Array(boardSize);
    for (let i = 0; i < boardSize; ++i) initialState[i] = new Array(boardSize).fill(null);
    return initialState;
};

export const reducer = createReducer(
    createInitialBoard(),
    on(syncBoardSuccess, (state, { newBoard }) => newBoard),

    on(placeWordSuccess, (state, { word }) => {
        for (let i = word.direction === 'h' ? word.position.x : word.position.y; i < word.length(); ++i) {
            switch (word.direction) {
                case Direction.HORIZONTAL:
                    state[word.position.x + i][word.position.y] = word.letters[i];
                    break;
                case Direction.VERTICAL:
                    state[word.position.x][word.position.y + i] = word.letters[i];
                    break;
            }
        }
        return state;
    }),
);
