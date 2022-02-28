import * as boardActions from '@app/actions/board.actions';
import { gameStatusReceived, resetAllState } from '@app/actions/game-status.actions';
import * as playersActions from '@app/actions/player.actions';
import { Letter } from '@app/classes/letter';
import { Multiplier } from '@app/classes/multiplier';
import { Player } from '@app/classes/player';
import { Direction, Word } from '@app/classes/word';
import { boardSize, BoardState, initialState, reducer } from './board.reducer';

const createInitialBoard = () => {
    const initialBoard = new Array(boardSize);
    for (let i = 0; i < boardSize; ++i) initialBoard[i] = new Array(boardSize).fill(null);
    return initialBoard;
};

const createInitialState = () => ({ board: createInitialBoard(), pointsPerLetter: new Map(), multipliers: createInitialBoard(), blanks: [] });

describe('[Board] Reducer', () => {
    let boardStub: BoardState;
    let stateStub: BoardState;
    const multiplierValue = 5;

    beforeEach(() => {
        boardStub = createInitialState();
        boardStub.board[5][5] = 'O';
        boardStub.board[5][6] = 'U';
        boardStub.board[5][7] = 'I';

        boardStub.multipliers[0][0] = new Multiplier(multiplierValue);

        stateStub = createInitialState();
    });

    describe('[Board] Sync Board', () => {
        it('should sync the state with the new board', () => {
            const action = boardActions.syncBoardSuccess({ newBoard: boardStub.board });

            stateStub.multipliers[0][0] = new Multiplier(multiplierValue);
            const result = reducer(stateStub, action);

            expect(result).toEqual(boardStub);
        });
    });

    describe('[Board] Sync Board', () => {
        it('should set the board state com', () => {
            const action = gameStatusReceived({
                status: { activePlayer: '', winner: null, gameEnded: false, letterPotLength: 0 },
                players: { player: new Player(''), opponent: new Player('') },
                board: boardStub,
            });

            const result = reducer(stateStub, action);

            expect(result).toEqual(boardStub);
        });
    });

    describe('[Players] Place Word Success', () => {
        it('should add the word in the board horizontally', () => {
            const newWord = new Word('alloA', { x: 0, y: 0 }, Direction.HORIZONTAL);
            const action = playersActions.placeWordSuccess({ word: newWord });

            const result = reducer(boardStub, action);

            for (let x = newWord.position.x; x < newWord.length(); ++x) {
                expect(result.board[x][0]).toEqual(newWord.letters[x].toUpperCase() as Letter);
            }
            expect(result.blanks[0]).toEqual({ x: 4, y: 0 });
        });

        it('should add the word in the board vertically', () => {
            const newWord = new Word('alloA', { x: 0, y: 0 }, Direction.VERTICAL);
            const action = playersActions.placeWordSuccess({ word: newWord });

            const result = reducer(boardStub, action);

            for (let y = newWord.position.y; y < newWord.length(); ++y) {
                expect(result.board[0][y]).toEqual(newWord.letters[y].toUpperCase() as Letter);
            }
            expect(result.blanks[0]).toEqual({ x: 0, y: 4 });
        });
    });

    it('should reset to initial state', () => {
        const action = resetAllState();
        const result = reducer(boardStub, action);

        expect(result).toEqual(initialState);
    });
});
