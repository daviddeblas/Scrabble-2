import * as boardActions from '@app/actions/board.actions';
import * as playersActions from '@app/actions/player.actions';
import { Letter } from '@app/classes/letter';
import { Direction, Word } from '@app/classes/word';
import { initialState, reducer } from './board.reducer';

describe('[Board] Reducer', () => {
    const boardSize = 15;
    let boardStub: Letter[][];

    beforeEach(() => {
        boardStub = new Array(boardSize);
        for (let i = 0; i < boardSize; ++i) boardStub[i] = new Array(boardSize).fill(null);
    });

    it('should sync the state with the new board', () => {
        const action = boardActions.syncBoardSuccess({ newBoard: boardStub });

        const result = reducer(initialState, action);

        expect(result).toEqual(boardStub);
    });

    it('should add the word in the board horizontally', () => {
        const newWord = new Word(['A', 'L', 'L', 'O'], { x: 0, y: 0 }, Direction.HORIZONTAL);
        const action = playersActions.placeWordSuccess({ word: newWord });

        const result = reducer(boardStub, action);

        for (let x = newWord.position.x; x < newWord.length(); ++x) {
            expect(result[x][0]).toEqual(newWord.letters[x]);
        }
    });

    it('should add the word in the board vertically', () => {
        const newWord = new Word(['A', 'L', 'L', 'O'], { x: 0, y: 0 }, Direction.VERTICAL);
        const action = playersActions.placeWordSuccess({ word: newWord });

        const result = reducer(boardStub, action);

        for (let y = newWord.position.y; y < newWord.length(); ++y) {
            expect(result[0][y]).toEqual(newWord.letters[y]);
        }
    });
});
