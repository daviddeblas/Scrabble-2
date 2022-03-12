import { backspaceSelection, cellClick, clearSelection, placeLetter, removeLetters, syncBoardSuccess } from '@app/actions/board.actions';
import { gameStatusReceived, resetAllState } from '@app/actions/game-status.actions';
import { placeWordSuccess } from '@app/actions/player.actions';
import { BoardSelection, Orientation } from '@app/classes/board-selection';
import { Direction } from '@app/classes/word';
import { createReducer, on } from '@ngrx/store';
import { Letter, stringToLetter } from 'common/classes/letter';
import { Multiplier } from 'common/classes/multiplier';
import { iVec2, Vec2 } from 'common/classes/vec2';
import { BOARD_SIZE } from 'common/constants';

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

const isCellAtBoardLimit = (board: (Letter | null)[][], pos: Vec2, orientation: Orientation): boolean => {
    switch (orientation) {
        case Orientation.Horizontal:
            for (let i = pos.x + 1; i < BOARD_SIZE; ++i) if (board[i][pos.y] === null) return false;
            break;
        case Orientation.Vertical:
            for (let i = pos.y + 1; i < BOARD_SIZE; ++i) if (board[pos.x][i] === null) return false;
            break;
    }
    return true;
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
        // Clear la selection au cas de fin de tour
        selection: new BoardSelection(),
    })),

    on(placeWordSuccess, (state, { word }) => {
        const multipliersCopy = JSON.parse(JSON.stringify(state.multipliers));
        const boardCopy = cloneBoard(state.board);
        const blankCopy: Vec2[] = JSON.parse(JSON.stringify(state.blanks));
        for (let i = 0; i < word.length(); ++i) {
            switch (word.direction) {
                case Direction.HORIZONTAL:
                    boardCopy[word.position.x + i][word.position.y] = word.letters[i].toUpperCase() as Letter;
                    multipliersCopy[word.position.x + i][word.position.y] = null;
                    if (stringToLetter(word.letters[i]) === '*') {
                        blankCopy.push(new Vec2(word.position.x + i, word.position.y));
                    }
                    break;
                case Direction.VERTICAL:
                    boardCopy[word.position.x][word.position.y + i] = word.letters[i].toUpperCase() as Letter;
                    multipliersCopy[word.position.x][word.position.y + i] = null;
                    if (stringToLetter(word.letters[i]) === '*') {
                        blankCopy.push(new Vec2(word.position.x, word.position.y + i));
                    }
                    break;
            }
        }
        return { ...state, board: boardCopy, blanks: blankCopy, multipliers: multipliersCopy };
    }),

    on(cellClick, (state, { pos }) => {
        const tempState = {
            ...state,
            selection: state.selection.copy(),
        };

        // If letters has been placed
        if (tempState.selection.modifiedCells.length > 0) return tempState;

        tempState.selection.cell = new Vec2(pos.x, pos.y);

        if (state.selection.cell?.x === pos.x && state.selection.cell?.y === pos.y) {
            tempState.selection.orientation =
                tempState.selection.orientation === Orientation.Horizontal ? Orientation.Vertical : Orientation.Horizontal;
            if (isCellAtBoardLimit(state.board, state.selection.cell, tempState.selection.orientation)) {
                tempState.selection.orientation =
                    tempState.selection.orientation === Orientation.Horizontal ? Orientation.Vertical : Orientation.Horizontal;
                if (isCellAtBoardLimit(state.board, state.selection.cell, tempState.selection.orientation)) tempState.selection.orientation = null;
            }

            return tempState;
        }

        tempState.selection.orientation = Orientation.Horizontal;
        return tempState;
    }),

    on(placeLetter, (state, { letter }) => {
        const selectedPosition = { x: (state.selection.cell as iVec2).x, y: (state.selection.cell as iVec2).y };
        if (state.board[selectedPosition.x][selectedPosition.y]) return state;
        const board = cloneBoard(state.board);
        board[selectedPosition.x][selectedPosition.y] = letter;

        const selection = state.selection.copy();
        selection.modifiedCells.push(state.selection.cell as Vec2);

        if (isCellAtBoardLimit(state.board, selection.cell as Vec2, selection.orientation as Orientation)) selection.orientation = null;
        else
            do {
                switch (state.selection.orientation) {
                    case Orientation.Horizontal:
                        selectedPosition.x++;
                        break;
                    case Orientation.Vertical:
                        selectedPosition.y++;
                        break;
                }
            } while (board[selectedPosition.x][selectedPosition.y] !== null);

        selection.cell = new Vec2(selectedPosition.x, selectedPosition.y);

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
        if (selection.modifiedCells.length === 0)
            // Clear selection
            return { ...state, selection: new BoardSelection() };

        const lastCell = selection.modifiedCells.pop() as Vec2;
        selection.orientation = selection.cell.x === lastCell.x ? Orientation.Horizontal : Orientation.Vertical;
        selection.cell = lastCell;

        const board = cloneBoard(state.board);
        board[selection.cell.x][selection.cell.y] = null;

        return {
            ...state,
            board,
            selection,
        };
    }),

    on(resetAllState, () => initialState),
);
