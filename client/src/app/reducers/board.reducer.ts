import { backspaceSelection, cellClick, clearSelection, placeLetter, removeLetters, syncBoardSuccess } from '@app/actions/board.actions';
import { gameStatusReceived, resetAllState } from '@app/actions/game-status.actions';
import { placeWordSuccess } from '@app/actions/player.actions';
import { BoardSelection, Orientation } from '@app/classes/board-selection';
import { Direction } from '@app/classes/word';
import { createReducer, on } from '@ngrx/store';
import { Letter } from 'common/classes/letter';
import { Multiplier } from 'common/classes/multiplier';
import { iVec2 } from 'common/classes/vec2';

export const boardFeatureKey = 'board';

const createEmptyMatrix = (dimensions: iVec2) => {
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
    blanks: iVec2[];
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

        // If letters has been placed
        if (tempState.selection.modifiedCells.length > 0) return tempState;

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
        const selectedPosition = { x: (state.selection.cell as iVec2).x, y: (state.selection.cell as iVec2).y };
        const board = cloneBoard(state.board);
        board[selectedPosition.x][selectedPosition.y] = letter;

        const selection = state.selection.copy();
        selection.modifiedCells.push(state.selection.cell as iVec2);

        switch (state.selection.orientation) {
            case Orientation.Horizontal:
                selectedPosition.x++;
                break;
            case Orientation.Vertical:
                selectedPosition.y++;
                break;
        }

        selection.cell = selectedPosition;
        return {
            ...state,
            selection,
            board,
        };
    }),

    on(removeLetters, (state, { positions }) => {
        const board = cloneBoard(state.board);
        positions.forEach((pos) => (board[pos.x][pos.y] = null));

        return {
            ...state,
            board,
        };
    }),

    on(clearSelection, (state): BoardState => {
        return { ...state, selection: new BoardSelection() };
    }),

    on(backspaceSelection, (state): BoardState => {
        const selection = state.selection.copy();
        if (selection.cell === null) return { ...state };
        if (selection.modifiedCells.length === 0) return { ...state, selection: new BoardSelection() };
        switch (state.selection.orientation) {
            case Orientation.Horizontal:
                selection.cell.x--;
                break;
            case Orientation.Vertical:
                selection.cell.y--;
                break;
        }

        return {
            ...state,
            selection,
        };
    }),

    on(resetAllState, () => initialState),
);
