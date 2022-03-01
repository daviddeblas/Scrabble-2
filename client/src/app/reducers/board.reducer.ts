import { cellClick, placeLetter, syncBoardSuccess } from '@app/actions/board.actions';
import { gameStatusReceived, resetAllState } from '@app/actions/game-status.actions';
import { placeWordSuccess } from '@app/actions/player.actions';
import { BoardSelection, Orientation } from '@app/classes/board-selection';
import { Letter } from '@app/classes/letter';
import { Multiplier } from '@app/classes/multiplier';
import { Vec2 } from '@app/classes/vec2';
import { Direction } from '@app/classes/word';
import { createReducer, on } from '@ngrx/store';

export const boardFeatureKey = 'board';

export const boardSize = 15;

const createEmptyMatrix = (dimensions: Vec2) => {
    const matrix = new Array(dimensions.x);
    for (let i = 0; i < dimensions.x; i++) {
        matrix[i] = new Array(dimensions.y);
        for (let j = 0; j < dimensions.y; j++) matrix[i][j] = null;
    }
    return matrix;
};

const cloneBoard = (board: (Letter | null)[][]): (Letter | null)[][] => {
    const newBoard = createEmptyMatrix({ x: board.length, y: board[0].length });
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            newBoard[i][j] = board[i][j];
        }
    }
    return newBoard;
};

export interface BoardState {
    board: (Letter | null)[][];
    pointsPerLetter: Map<Letter, number>;
    multipliers: (Multiplier | null)[][];
    blanks: Vec2[];
    selection: BoardSelection;
}

export const initialState: BoardState = {
    board: [],
    pointsPerLetter: new Map(),
    multipliers: [],
    blanks: [],
    selection: new BoardSelection(null, 'horizontal' as Orientation),
};
/*
const copyBoard = (state: BoardState): BoardState => {
    const blanks: Vec2[] = [];
    state.blanks.forEach((pos: Vec2) => blanks.push({ x: pos.x, y: pos.y }));
    const board = createEmptyMatrix({ x: state.board.length, y: state.board[0].length });
    const multipliers = createEmptyMatrix({ x: state.board.length, y: state.board[0].length });
    const selection = state.selection.copy();
    const pointsPerLetter = state.pointsPerLetter;

    for (let i = 0; i < state.board.length; i++) {
        for (let j = 0; j < state.board[0].length; j++) {
            board[i][j] = state.board[i][j];
            multipliers[i][j] = state.multipliers[i][j];
        }
    }

    return { blanks, board, multipliers, selection, pointsPerLetter };
};
*/
export const reducer = createReducer(
    initialState,
    on(syncBoardSuccess, (state, { newBoard }) => ({ ...state, board: newBoard })),

    on(gameStatusReceived, (state, { board }) => ({
        ...state,
        board: board.board,
        multipliers: board.multipliers,
        blanks: board.blanks,
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

    on(cellClick, (state, { pos }) => {
        const tempState = {
            ...state,
            selection: state.selection.copy(),
        };

        tempState.selection.cell = pos;

        if (state.selection.cell?.x === pos.x && state.selection.cell?.y === pos.y) {
            tempState.selection.orientation =
                tempState.selection.orientation === Orientation.Horizontal ? Orientation.Vertical : Orientation.Horizontal;
            return tempState;
        }
        tempState.selection.orientation = Orientation.Horizontal;
        return tempState;
    }),

    on(placeLetter, (state, { letter }) => {
        const selectedPosition = { x: (state.selection.cell as Vec2).x, y: (state.selection.cell as Vec2).y };
        const board = cloneBoard(state.board);
        board[selectedPosition.x][selectedPosition.y] = letter;

        switch (state.selection.orientation) {
            case Orientation.Horizontal:
                selectedPosition.x++;
                break;
            case Orientation.Vertical:
                selectedPosition.y++;
                break;
        }
        const selection = state.selection.copy();
        selection.cell = selectedPosition;
        return {
            ...state,
            selection,
            board,
        };
    }),

    on(resetAllState, () => initialState),
);
